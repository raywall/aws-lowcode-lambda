const AWS = require('aws-sdk')

const { getVariables, formatError, formatResponse, checkPath } = require('../util/functions.js')
const { actionType, resourceType, messageType } = require('../util/types.js')
const { postDynamoData, getDynamoData } = require('../modules/dynamo.js')
const { Event } = require('./event.js')
const { DynamoResource } = require('./dynamo.js')

class LowCodeLambda {
    constructor(region, endpoint) {
        this.endpoint = endpoint === '' ? 'http://dynamodb:8000' : endpoint
        this.region = region === '' ? 'sa-east-1' : region
        this.routes = {};
    }
  
    // create a dynamodb client
    createConnection() {
        this.conn = new AWS.DynamoDB.DocumentClient({
            endpoint: this.endpoint,
            region: this.region
        })
    }

    validateRequest(method, route, event) {
        return (event.method === method && checkPath(event.path, route))
    }

    // registers middleware functions for a specific HTTP route and method
    registerRoute(method, route, middleware) {
      if (!this.routes[route]) {
        this.routes[route] = {};
      }

      this.routes[route][method] = middleware;
    }
  
    // method: get
    get(route, resource) {
        this.registerRoute('GET', route, async (req, res) => {
            if (!this.validateRequest('GET', route, req)) {
                return formatError(501, 'method not supported')
            }
    
            const params = getVariables(req.path, route)
            
            if (resource instanceof DynamoResource) {
                return formatResponse(200, JSON.stringify(await getDynamoData(resource.tableName, params)))
            }
    
            return formatError(501, 'resource not supported')
        });
    }
  
    // method: post
    post(route, resource) {
        this.registerRoute('POST', route, async (req, res) => {
            if (!this.validateRequest('POST', route, req)) {
                return formatError(501, 'method not supported')
            }
    
            const params = getVariables(req.path, route)
            
            if (resource instanceof DynamoResource) {
                return formatResponse(201, JSON.stringify(await postDynamoData(resource.tableName, params, req.body)))
            }
    
            return formatError(501, 'resource not supported')
        });
    }
  
    // process incoming request from lambda function
    async start(req) {
        const event = new Event(req.path, req.httpMethod, req.body)
        // const middleware = this.routes[event.path] && this.routes[baseUrl][event.method]
        
        let matchedKey = null;
        let middleware = null;

        for (const key in this.routes) {
            const keyRegExp = new RegExp('^' + key.replace(/\{.*?\}/g, '([^/]+)') + '$');
            
            if (event.path.match(keyRegExp)) {
                matchedKey = key;
                middleware = this.routes[key][event.method];
                break;
            }
        }

        if (middleware) {
            // executes the middleware function
            return await middleware(event, null) 
        } else {
            // method and route do not exist
            return formatError(404, 'route not found')
        }
    }
  }

  module.exports = { LowCodeLambda, DynamoResource }