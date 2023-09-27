const { formatError } = require("../util/functions")

async function processStepFuncRequest(config) {
    return formatError(500, "option not implemented")
}

module.exports = { processStepFuncRequest }