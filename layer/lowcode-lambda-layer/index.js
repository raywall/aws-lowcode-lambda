const { processBucketRequest } = require("./modules/bucket.js")
const { processDynamoRequest } = require("./modules/dynamo.js")
const { processSnsRequest } = require("./modules/sns.js")
const { processSqsRequest } = require("./modules/sqs.js")
const { processStepFuncRequest } = require("./modules/stepfunctions.js")
const { formatError, getVariables, checkPath } = require("./util/functions.js")
const { resourceType } = require("./util/types.js")

exports.lowcodeLambda = async function(event, context, config) {
    try {
        switch (rule.resources) {
            case resourceType.BucketS3:
                return await processBucketRequest(config)

            case resourceType.DynamoDB:
                return await processDynamoRequest(config, event)
            
            case resourceType.SNS:
                return await processSnsRequest(config)

            case resourceType.SQS:
                return await processSqsRequest(config)

            case resourceType.StepFunction:
                return await processStepFuncRequest(config)
        }
    } catch(error) {
        return formatError(error.statusCode, error.message)
    }

    return formatError(500, "option not recognized")
}