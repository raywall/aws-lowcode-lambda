/** 
 * Running with settings.json
 */

// const { lowcodeLambda } = require("/opt/nodejs/lowcode-lambda-layer")
// const config = require("./settings.json")

// exports.handler = async (event, context) => {
//     return await lowcodeLambda(event, context, config)
// }


/** 
 * Running with API class
 */

// const { API, DynamoResource } = require('/opt/nodejs/lowcode-lambda-layer/modules/api.js')

// exports.handler = async (event, context) => {
//     var api = new API('sa-east-1', 'http://dynamodb:8000', event)
//     var table = new DynamoDB('UserTable', 'userId', null)

//     return await api.get('/v1/nodejs/{userId}', table)
// }


/** 
 * Running more than one method with LowCodeLambda class 
 */

const { LowCodeLambda, DynamoResource } = require('/opt/nodejs/lowcode-lambda-layer')

exports.handler = async (event) => {
    const app = new LowCodeLambda('sa-east-1', 'http://dynamodb:8000')
    const table = new DynamoResource('UserTable', 'userId', null)

    app.get('/v1/nodejs/{userId}', table)
    app.post('/v1/nodejs', table)
    
    return await app.start(event)
};