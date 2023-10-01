const AWS = require("aws-sdk")

const { getVariables, formatError, formatResponse, checkPath } = require("../util/functions.js")
const { actionType } = require("../util/types.js")

const dynamodb = new AWS.DynamoDB.DocumentClient({
    region: "sa-east-1",
    endpoint: "http://dynamodb:8000"
})

async function postDynamoData(tableName, args, body) {
    var params = {
        TableName: tableName,
        Item: JSON.parse(body)
    }
    
    return formatResponse(201, JSON.stringify(await dynamodb.put(params).promise()))
}

async function getDynamoData(tableName, args) {
    var params = {
        TableName: tableName,
        Key: args
    }
    
    return formatResponse(200, JSON.stringify(await dynamodb.get(params).promise()))
}

async function processDynamoRequest(rule, config, event) {
    const api = config.resources.find(r => 
        r.type === rule.from &&
        r.method === event.httpMethod &&
        checkPath(event.path, r.path))
    
    if (!api)
        return formatError(404, "method not found")

    const variables = getVariables(event.path, api.path)

    // Insert
    if (rule.action  == actionType.Insert) {
        var params = {
            TableName: config.resources.find(r => r.type === rule.resource).table,
            Item: JSON.parse(event.body)
        }

        return formatResponse(201, JSON.stringify(await dynamodb.put(params).promise()))
    }

    // Update
    else if (rule.action == actionType.Update) {
        var params = {
            TableName: config.resources.find(r => r.type === rule.resource).table,
            Item: JSON.parse(event.body)
        }

        return formatResponse(200, JSON.stringify(await dynamodb.update(params).promise()))
    }

    // Select
    else if (rule.action == actionType.Query) {
        var params = {
            TableName: config.resources.find(r => r.type === rule.resource).table,
            Key: variables
        }
        
        return formatResponse(200, JSON.stringify(await dynamodb.get(params).promise()))
    }

    // Delete
    else if (rule.action == actionType.Delete) {
        var params = {
            TableName: config.resources.find(r => r.type === rule.resource).table,
            Key: variables
        }

        return formatResponse(200, JSON.stringify(await dynamodb.delete(params).promise()))
    }
}

module.exports = { postDynamoData, getDynamoData, processDynamoRequest }