const AWS = require('aws-sdk')

const { formatError, formatResponse } = require('../functions.js')

class DynamoResource {
    constructor(region = 'sa-east-1', endpointUrl = null, tableName, pk, sk = null) {
        this.dynamoClient = new AWS.DynamoDB.DocumentClient({
            endpoint: endpointUrl === null ? '' : endpointUrl,
            region: region
        })

        this.tableName = tableName
        this.pk = pk
        this.sk = sk
    }

    async get(args) {
        try {
            var params = {
                TableName: this.tableName,
                Key: args
            }

            return formatResponse(200, JSON.stringify(await this.dynamoClient.get(params).promise()))
        }

        catch (error) {
            return formatError(500, JSON.stringify(error))
        }
    }

    async post(args, body) {
        try {
            var params = {
                TableName: this.tableName,
                Item: JSON.parse(body)
            }

            return formatResponse(201, JSON.stringify(await this.dynamoClient.put(params).promise()))
        }

        catch (error) {
            return formatError(500, JSON.stringify(error))
        }
    }

    async put(args, body) {
        try {
            let data = JSON.parse(body)
            data[this.pk] = args[this.pk]

            if (this.sk !== null)
                data[this.sk] = args[this.sk]

            var params = {
                TableName: this.tableName,
                Item: data
            }

            return formatResponse(200, JSON.stringify(await this.dynamoClient.put(params).promise()))
        }

        catch (error) {
            return formatError(500, JSON.stringify(error))
        }
    }

    async delete(args) {
        try {
            var params = {
                TableName: this.tableName,
                Key: args
            }

            return formatResponse(200, JSON.stringify(await this.dynamoClient.delete(params).promise()))
        }

        catch (error) {
            return formatError(500, JSON.stringify(error))
        }
    }
}

module.exports = { DynamoResource }