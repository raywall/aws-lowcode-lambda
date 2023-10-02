const AWS = require("aws-sdk")
const http = require("http")

const { getVariables, formatError, formatResponse, checkPath } = require("../util/functions.js")
const { actionType, resourceType, messageType } = require("../util/types.js")
const { postDynamoData, getDynamoData } = require("./dynamo.js")

class API {
    constructor(region, endpoint, event) {
        this.endpoint = endpoint === '' ? 'http://dynamodb:8000' : endpoint
        this.region = region === '' ? 'sa-east-1' : region
        this.event = event !== '' ? event : null
    }

    createConnection() {
        this.conn = new AWS.DynamoDB.DocumentClient({
            endpoint: this.endpoint,
            region: this.region
        })
    }

    validateRequest(method, route, event) {
        return (event.httpMethod === method && checkPath(event.path, route))
    }

    notSupported(msg) {
        switch (msg) {
            case messageType.Method:
                return formatError(501, "method not supported")

            case messageType.Resource:
                return formatError(501, "resource not supported")

            default:
                return formatError(500, "command not recognized")
        }
    }

    // listening requests method
    listen(port) {
        this.server = http.createServer((req, res) => {
            this.event = new Event(req.url, req.method, req.body)
        })
    
        this.server.listen(port, () => {
          console.log(`API listening on port ${port}`)
        })
      }

    // method: post
    async post(route, resource) {
        if (!this.validateRequest('POST', route, this.event)) {
            return this.notSupported(messageType.Method)
        }

        const params = getVariables(this.event.path, route)
        
        if (resource instanceof DynamoDB) {
            return await postDynamoData(resource.tableName, params, this.event.body)
        }

        return notSupported(messageType.Resource)
    }

    // method: get
    async get(route, resource) {
        if (!this.validateRequest('GET', route, this.event)) {
            return this.notSupported(messageType.Method)
        }

        const params = getVariables(this.event.path, route)
        
        if (resource instanceof DynamoDB) {
            return await getDynamoData(resource.tableName, params)
        }

        return this.notSupported(messageType.Resource)
    }
}

class DynamoDB {
    constructor(tableName, pk, sk) {
        this.tableName = tableName
        this.pk = pk
        this.sk = sk
    }
}

class Event {
    constructor(path, method, body) {
        this.method = method
        this.path = path
        this.body = body
    }
}

module.exports = { API , DynamoDB }