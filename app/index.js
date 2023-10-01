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

const { API, DynamoDB } = require('/opt/nodejs/lowcode-lambda-layer/modules/api.js')

exports.handler = async (event, context) => {
    var api = new API('sa-east-1', 'http://dynamodb:8000', event)
    var table = new DynamoDB('UserTable', 'userId', null)

    return await api.get('/v1/nodejs/{userId}', table)
}


/** 
 * Running more than one method with LowCodeLambda class 
 */

// const { API, DynamoDB } = require('/opt/nodejs/lowcode-lambda-layer/modules/api.js')

// const lowcode = require('/opt/nodejs/lowcode-lambda-layer')
// const app = lowcode()

// const api = new API('sa-east-1', 'http://dynamodb:8000')
// const table = new DynamoDB('UserTable', 'userId', null)

// app.get('/v1/nodejs/{userId}', table)
// app.post('/v1/nodejs', table)

// const handler = serverless(app);

// const startServer = async () => {
//     app.listen(3000, () => {
//       console.log("listening on port 3000!");
//     })
// }

// startServer()

// module.exports.handler = (event, context, callback) => {
//     const response = handler(event, context, callback);
//     return response;
// }