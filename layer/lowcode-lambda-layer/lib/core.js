const { getVariables, formatError, checkPath } = require('./functions')
const { Event, Response, Configuration } = require('../model/configuration')
const { DynamoResource } = require('./dynamodb/dynamo.')
const { EventEmitter } = require('events');
const { ApiResource } = require('./clients/api');

class LowCodeLambda {
    constructor(region = 'sa-east-1') {
        this.events = new EventEmitter();
        this.region = region
        this.routes = {}
    }
  
    // condition validation - before running the middleware function
    validateCondition(condition, req, args) {
        if (condition !== undefined) {
            if (typeof condition === 'function' && condition.length === 2)
                return condition(req, args)

            return new Response(400, "Sorry, but conditional functions needs two parameters: (req, args) => { ... }")
        }

        return new Response(200)
    }

    // request validation
    validateRequest(method, route, event) {
        return (event.method === method && checkPath(event.path, route))
    }

    // registers middleware functions for a specific HTTP route and method
    registerRoute(method, route, middleware) {
      if (!this.routes[route])
        this.routes[route] = {};

      this.routes[route][method] = middleware;
    }
  
    // method: get
    get(route, resource, config = null) {
        this.registerRoute('GET', route, async (req, res) => {
            if (!this.validateRequest('GET', route, req))
                return formatError(501, 'method not supported')
    
            const params = getVariables(req.path, route)
            let valid = this.validateCondition(config.condition, req, params)

            if (valid.statusCode !== 200)
                return valid

            // DynamoDB
            if (resource instanceof DynamoResource) {
                let result = await resource.get(params)
                res.emit('get', result)

                return result
            }

            // API
            else if (resource instanceof ApiResource) {
                let result = await resource.get(config.path, config.headers)
                res.emit('get', result)

                return result
            }

            return formatError(501, 'resource not supported')
        })
    }
  
    // method: post
    post(route, resource, config = null) {
        this.registerRoute('POST', route, async (req, res) => {
            if (!this.validateRequest('POST', route, req))
                return formatError(501, 'method not supported')
    
            const params = getVariables(req.path, route)
            let valid = this.validateCondition(config.condition, req, params)

            if (valid.statusCode !== 200)
                return valid

            // DynamoDB
            if (resource instanceof DynamoResource) {
                let result = await resource.post(params, req.body)
                res.emit('post', result)

                return result
            }

            // API
            else if (resource instanceof ApiResource) {
                let result = await resource.post(config.path, config.headers, config.body)
                res.emit('post', result)

                return result
            }

            return formatError(501, 'resource not supported')
        })
    }

    // method: put
    put(route, resource, config = null) {
        this.registerRoute('PUT', route, async (req, res) => {
            if (!this.validateRequest('PUT', route, req))
                return formatError(501, 'method not supported')
    
            const params = getVariables(req.path, route)
            let valid = this.validateCondition(config.condition, req, params)

            if (valid.statusCode !== 200)
                return valid

            // DynamoDB
            if (resource instanceof DynamoResource) {
                let result = await resource.put(params, req.body)
                res.emit('put', result)

                return result
            }

            // API
            else if (resource instanceof ApiResource) {
                let result = await resource.put(config.path, config.headers, config.body)
                res.emit('put', result)

                return result
            }
    
            return formatError(501, 'resource not supported')
        })
    }

    // method: delete
    delete(route, resource, config = null) {
        this.registerRoute('DELETE', route, async (req, res) => {
            if (!this.validateRequest('DELETE', route, req))
                return formatError(501, 'method not supported')
    
            const params = getVariables(req.path, route)
            let valid = this.validateCondition(config.condition, req, params)

            if (valid.statusCode !== 200)
                return valid

            // DynamoDB
            if (resource instanceof DynamoResource) {
                let result = await resource.delete(params)
                res.emit('delete', result)

                return result
            }

            // API
            else if (resource instanceof ApiResource) {
                let result = await resource.delete(config.path, config.headers)
                res.emit('delete', result)

                return result
            }
    
            return formatError(501, 'resource not supported')
        })
    }
  
    // process incoming request from lambda function
    async start(evt) {
        const req = new Event(evt.path, evt.httpMethod, evt.body)
        let middleware = null;

        return new Promise(async (resolve, reject) => {
            for (const key in this.routes) {
                const keyRegExp = new RegExp('^' + key.replace(/\{.*?\}/g, '([^/]+)') + '$');
                
                if (req.path.match(keyRegExp)) {
                    middleware = this.routes[key][req.method];
                    break;
                }
            }
    
            if (middleware) {
                // executes the middleware function
                return resolve(await middleware(req, this.events))
            } else {
                // method and route do not exist
                return reject(formatError(404, 'route not found'))
            }
        })
    }
  }

  module.exports = { LowCodeLambda, DynamoResource, ApiResource, Response, Configuration }