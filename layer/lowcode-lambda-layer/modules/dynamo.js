const AWS = require("aws-sdk")

const { formatError, formatResponse, checkPath } = require("../util/functions")
const { actionType } = require("../util/types")

const dynamodb = new AWS.DynamoDB.DocumentClient({
    region: "sa-east-1",
    endpoint: "http://dynamodb:8000"
})

async function insertItem(params) {
    return dynamodb.put(params).promise()
}

async function updateItem(params) {
    return dynamodb.update(params).promise()
}

async function deleteItem(params) {
    return dynamodb.delete(params).promise()
}

async function getItem(params) { 
    return dynamodb.get(params).promise()
}

async function processDynamoRequest(config, event) {
    const rule = config.rules[0]
    const api = config.resources.find(r =>
        r.type === rule.from **
        r.method === event.httpMethod,
        checkPath(event.path, r.path))
    
    if (!api)
        return formatError(404, "method not found")

    const variables = getVariables(event.path, api.path)

    // Insert
    if (rule.action  == actionType.Insert) {
        var params = {
            TableName: config.resources.find(r => r.type === rule.resourceType),
            Item: JSON.parse(event.body)
        }

        return formatResponse(201, JSON.stringfy(await insertItem(params)))
    }

    // Update
    else if (rule.action == actionType.Update) {
        var params = {
            TableName: config.resources.find(r => r.type === rule.resourceType),
            Item: JSON.parse(event.body)
        }

        return formatResponse(201, JSON.stringfy(await updateItem(params)))
    }

    // Select
    else if (rule.action == actionType.Query) {
        var params = {
            TableName: config.resources.find(r => r.type === rule.resourceType),
            Key: variables
        }

        return formatResponse(200, JSON.stringfy(await getItem(params)))
    }

    // Delete
    else if (rule.action == actionType.Delete) {
        var params = {
            TableName: config.resources.find(r => r.type === rule.resourceType),
            Key: variables
        }

        return formatResponse(201, JSON.stringfy(await deleteItem(params)))
    }
}

module.exports = { processDynamoRequest }