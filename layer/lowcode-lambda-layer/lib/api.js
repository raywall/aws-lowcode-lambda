const { getVariables, formatError, checkPath } = require('../structure/functions.js')
const { Event, Response } = require('../modules/controls.js')
const { DynamoResource } = require('../modules/dynamo.js')

class LowCodeLambda {
    constructor(region = 'sa-east-1') {
        this.region = region
        this.routes = {}
    }
  
    validateCondition(condition, req, args) {
        if (condition !== undefined) {
            if (typeof condition === 'function' && condition.length === 2)
                return condition(req, args)

            return new Response(400, "Sorry, but conditional functions needs two parameters: (req, args) => { ... }")
        }

        return new Response(200)
    }

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
    get(route, resource, condition = undefined) {
        this.registerRoute('GET', route, async (req, res) => {
            if (!this.validateRequest('GET', route, req))
                return formatError(501, 'method not supported')
    
            const params = getVariables(req.path, route)
            let result = this.validateCondition(condition, req, params)

            if (result.statusCode !== 200)
                return formatError(result.statusCode, result.message)

            if (resource instanceof DynamoResource)
                return await resource.get(params)
    
            return formatError(501, 'resource not supported')
        })
    }
  
    // method: post
    post(route, resource, condition = undefined) {
        this.registerRoute('POST', route, async (req, res) => {
            if (!this.validateRequest('POST', route, req))
                return formatError(501, 'method not supported')
    
            const params = getVariables(req.path, route)
            let result = this.validateCondition(condition, req, params)

            if (result.statusCode !== 200)
                return formatError(result.statusCode, result.message)

            if (resource instanceof DynamoResource)
                return await resource.post(params, req.body)
    
            return formatError(501, 'resource not supported')
        })
    }

    // method: put
    put(route, resource, condition = undefined) {
        this.registerRoute('PUT', route, async (req, res) => {
            if (!this.validateRequest('PUT', route, req))
                return formatError(501, 'method not supported')
    
            const params = getVariables(req.path, route)
            let result = this.validateCondition(condition, req, params)

            if (result.statusCode !== 200)
                return formatError(result.statusCode, result.message)

            if (resource instanceof DynamoResource)
                return await resource.put(params, req.body)
    
            return formatError(501, 'resource not supported')
        })
    }

    // method: delete
    delete(route, resource, condition = undefined) {
        this.registerRoute('DELETE', route, async (req, res) => {
            if (!this.validateRequest('DELETE', route, req))
                return formatError(501, 'method not supported')
    
            const params = getVariables(req.path, route)
            let result = this.validateCondition(condition, req, params)

            if (result.statusCode !== 200)
                return formatError(result.statusCode, result.message)

            if (resource instanceof DynamoResource)
                return await resource.delete(params)
    
            return formatError(501, 'resource not supported')
        })
    }
  
    // process incoming request from lambda function
    async start(req) {
        const event = new Event(req.path, req.httpMethod, req.body)
        let middleware = null;

        return new Promise(async (resolve, reject) => {
            for (const key in this.routes) {
                const keyRegExp = new RegExp('^' + key.replace(/\{.*?\}/g, '([^/]+)') + '$');
                
                if (event.path.match(keyRegExp)) {
                    middleware = this.routes[key][event.method];
                    break;
                }
            }
    
            if (middleware) {
                // executes the middleware function
                return resolve(await middleware(event, null))
            } else {
                // method and route do not exist
                return reject(formatError(404, 'route not found'))
            }
        })
    }
  }

  module.exports = { LowCodeLambda, DynamoResource, Response }