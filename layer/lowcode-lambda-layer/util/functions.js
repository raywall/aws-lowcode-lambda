var formatResponse = function(statusCode, body) {
    var response = {
        "statusCode": statusCode,
        "headers": {
            "Content-Type": "application/json"
        },
        "isBase64Encoded": false,
        "multiValueHeaders": {
            "X-Custom-Header": ["My value", "My other value"]
        },
        "body": body
    }

    return response
}

var formatError = function(statusCode, message) {
    var response = {
        "statusCode": statusCode,
        "headers": {
            "Content-Type": "text/plain"
            // "x-amzn-ErrorType": code
        },
        "isBase64Encoded": false,
        "body": message
    }

    return response
}

var getVariables = function(resourcePath, pathPattern) {
    const regexPattern = /\{([^}]+)\}/g
    const variables = {}
    const params = []

    let match

    while ((match = regexPattern.exec(pathPattern)) !== null)
        params.push(match[1])

    const values = resourcePath.match(new RegExp(pathPattern.replace(regexPattern, '([^/]+)')))

    if (values)
        for (let i = 0; i < params.length; i++)
            variables[params[i]] = values[i + 1]

    return variables
}

var checkPath = function(resourcePath, routePath) {
    const routePattern = routePath.replace(/\{([^}]+)\}/g, '([^/]+)')
    return new RegExp(`^${routePattern}$`).test(resourcePath)
}

var getAccountSettings = function() {
    return lambda.getAccountSettings().promise()
}

var serialize = function(object) {
    return JSON.stringify(object, null, 2)
}

module.exports = { formatResponse, formatError, getVariables, checkPath, getAccountSettings, serialize }