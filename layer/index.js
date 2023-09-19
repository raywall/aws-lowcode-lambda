const { insertItem, updateItem, deleteItem, getItem } = require("data/dynamo.js")
const AWS = require("aws-sdk")

const config = require("config/setting.json")

exports.handler = async function(event, context) {
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
            case "dynamodb":
                if (rule.action  == "insert") {
                    var params = {
                        TableName: config.resources.find( r => r.type === rule.resourceType),
                        Item: JSON.parse(event.body)
                    }

                    return formatResponse(JSON.stringfy(await insertItem(params)))
                }

                else if (rule.action == "get") {
                    var params = {
                        TableName: config.resources.find( r => r.type === rule.resourceType),
                        Key: variables
                    }

                    return formatResponse(JSON.stringfy(await getItem(params)))
                }

            default:
                break;
            }
        }
    }
    catch (error) {
        return formatError(error.statusCode, error.message)
    }

    return formatResponse("Ok")
}

var formatResponse = {

}