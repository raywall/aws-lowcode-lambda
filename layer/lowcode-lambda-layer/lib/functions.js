var formatResponse = function(status, body) {
    var response = {
        statusCode: status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: body
    }

    return response
}

var formatError = function(status, message) {
    var response = {
        statusCode: status,
        headers: {
            'Content-Type': 'text/plain'
        },
        body: message
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