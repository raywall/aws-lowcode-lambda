/** 
 * Running with settings.json
 */

// const { processBucketRequest } = require("./modules/bucket.js")
// const { processDynamoRequest } = require("./modules/dynamo.js")
// const { processSnsRequest } = require("./modules/sns.js")
// const { processSqsRequest } = require("./modules/sqs.js")
// const { processStepFuncRequest } = require("./modules/stepfunctions.js")
// const { formatError } = require("./util/functions.js")
// const { resourceType } = require("./util/types.js")

// exports.lowcodeLambda = async function(event, context, config) {
//     try {
//         const rule = config.rules[0]

//         switch (rule.resource) {
//             case resourceType.BucketS3:
//                 return await processBucketRequest(config)

//             case resourceType.DynamoDB:
//                 return await processDynamoRequest(rule, config, event)
            
//             case resourceType.SNS:
//                 return await processSnsRequest(config)

//             case resourceType.SQS:
//                 return await processSqsRequest(config)

//             case resourceType.StepFunction:
//                 return await processStepFuncRequest(config)

//             default:
//                 return formatError(500, "option not recognized")
//         }
//     } catch(error) {
//         return formatError(error.statusCode, error.message)
//     }
// }


/** 
 * Running more than one method with LowCodeLambda class 
 */

const { LowCodeLambda, DynamoResource } = require('./lib/lambda.js')

module.exports = { LowCodeLambda, DynamoResource }