const { formatError } = require("../util/functions")

async function processBucketRequest(config) {
    // Download
    if (rule.action == actionType.Download) {
        return formatError(500, "option not implemented")
    }

    // Upload
    else if (rule.action == actionType.Upload) {
        return formatError(500, "option not implemented")
    }

    // Delete
    else if (rule.action == actionType.Delete) {
        return formatError(500, "option not implemented")
    }
}

module.exports = { processBucketRequest }