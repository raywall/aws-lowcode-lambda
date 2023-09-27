const { formatError } = require("../util/functions")

async function processSqsRequest(config) {
    return formatError(500, "option not implemented")
}

module.exports = { processSqsRequest }