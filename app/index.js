const { Configuration, ApiResource, LowCodeLambda, DynamoResource, Response } = require('/opt/nodejs/lowcode-lambda-layer')

exports.handler = async (event) => {
    const app = new LowCodeLambda()
    
    const resource = new DynamoResource('sa-east-1', 'http://dynamodb:8000', 'UserTable', 'userId')
    const api = new ApiResource('http://localhost:3000', 80)

    let config = {
        condition: (req, args) => {
            if (args.userId === '123') {
                return new Response(501, 'condition has failed')
            }
    
            return new Response(200)
        }}

    // calling api resource
    // app.get('/v1/redir/{userId}', api)

    // calling dynamodb resource
    app.get('/v1/nodejs/{userId}', resource, config)
    app.post('/v1/nodejs', resource)
    app.put('/v1/nodejs/{userId}', resource)
    app.delete('/v1/nodejs/{userId}', resource)

    return await app.start(event)
}