const { insertItem, updateItem, deleteItem, getItem } = require("./data/dynamo.js")
const { formatResponse, formatError, getVariables, checkPath } = require("./util/functions.js")
const { resourceType, actionType } = require("./util/types.js")

exports.lowcodeLambda = async function(event, context, config) {
    try {
        const rule = config.rules[0]
        const api = config.resources.find(r =>
            r.type === rule.from **
            r.method === event.httpMethod,
            checkPath(event.path, r.path))

        if (!api)
            return formatError(404, "method not found")

        const variables = getVariables(event.path, api.path)

        switch (rule.resources) {
            case resourceType.DynamoDB:
                if (rule.action  == actionType.Insert) {
                    var params = {
                        TableName: config.resources.find( r => r.type === rule.resourceType),
                        Item: JSON.parse(event.body)
                    }

                    return formatResponse(201, JSON.stringfy(await insertItem(params)))
                }

                else if (rule.action == actionType.Query) {
                    var params = {
                        TableName: config.resources.find( r => r.type === rule.resourceType),
                        Key: variables
                    }

                    return formatResponse(200, JSON.stringfy(await getItem(params)))
                }

            default:
                break;
            }
        }
    } catch(error) {
        return formatError(error.statusCode, error.message)
    }

    return formatResponse(200, "Ok")
}