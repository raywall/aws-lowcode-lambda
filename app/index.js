const { LowCodeLambda, DynamoResource, Response } = require('/opt/nodejs/lowcode-lambda-layer')

exports.handler = async (event) => {
    const app = new LowCodeLambda()
    const resource = new DynamoResource('sa-east-1', 'http://dynamodb:8000', 'UserTable', 'userId')

    // app.get('/v1/nodejs/{userId}', resource)

    app.get('/v1/nodejs/{userId}', resource, (req, args) => {
        if (args.userId === '123') {
            return new Response(501, 'condition has failed')
        }

        return new Response(200)
    })

    app.post('/v1/nodejs', resource)
    app.put('/v1/nodejs/{userId}', resource)
    app.delete('/v1/nodejs/{userId}', resource)

    return await app.start(event)
}