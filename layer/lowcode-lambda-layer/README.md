# @raysouz/lambda-lowcode-layer

About
-----
The @lowcode/lambda-layer is a node.js framework that can accelerate development of lambda integrations on AWS using low-code strategy. Can be used as a dependency of a project or as a lambda layer, granting reuse for all of your lambda functions.

License
-----------------

The source code authored by us in this repo is licensed under the Apache v2. The full core is open source, but the are some boundary functions that are difficult to publish in a way we can maintain them.

Additional minified JavaScript files and Java libraries are used in this project. All of the licenses are deemed compatible with the Apache 2.0, nothing is GPL or AGPL, due dilgence is performed on all third-party code.

Scope of the Project
--------------------

@raysouz/lambda-lowcode-layer is a framework that you can use to build your own AWs lambda functions with it.

If you are using a @lowcode/lambda-layer project/framework and have issues or questions about the available services integrations, the issue tracker and discussion in this GitHub project are likely a good place to look.

Using
-----

@raysouz/lambda-lowcode-layer is a easy framework to use, And there are some ways to do this:

1. You can get the package from [npmjs.com](https://www.npmjs.com/package/lambda-lowcode-layer) using 'npm i @raysouz/lambda-lowcode-layer'
2. You can refer our public lambda layer on AWS using ARN: arn:aws:lambda:us-east-1:844370664488:layer:lowcode-lambda-layer:1
3. You can get the release zip file on [release layer](https://github.com/raywall/aws-lowcode-lambda/tree/main/.package) and create your own AWS lambda layer

The project use a middleware functions to help you create your integration fast.

Example of use
--------------
Let's consider you want to build a lambda to integrate an API Gateway resource/method to a DynamoDB table.

In this example you're using:
1. GET on 'http://myapi.com/v1/users/{username}' route to get information about an specific user
2. PUT on 'http://myapi.com/v1/users' route to insert a new record of an user

You can choose one of the three options to refer the framework described above, then you can start write your code like this:
```node.js
const { LowCodeLambda, DynamoResource } = require("lambda-lowcode-layer")

exports.handler = async (event) => {
    const app = new LowCodeLambda();
    const resource = new DynamoResource({
        region: 'sa-east-1', 
        tableName: 'UserTable',
        pk: 'username'
    });

    app.get('/v1/users/{userId}', resource);
    app.put('/v1/users', resource);

    return await app.start(event)
}
```

You also can user a middleware function to create a custom validation that need to be checked before the action configured. Let's say for any reason you won't allow the GET method return information about an specific username, like raysouz.

You can write the condition, then you can pass the condition through the app.get declaration:
```node.js
const { LowCodeLambda, DynamoResource } = require("lambda-lowcode-layer")

exports.handler = async (event) => {
    const app = new LowCodeLambda();
    const resource = new DynamoResource({
        region: 'sa-east-1', 
        tableName: 'UserTable',
        pk: 'username'
    });

    let config = {
        condition: (req, args) => {
            if (args.username === 'raysouz') {
                return new Response(501, 'condition has failed');
            }

            return new Response(200);
        }
    };

    app.get('/v1/users/{userId}', resource, condition);
    app.put('/v1/users', resource);

    return await app.start(event)
}
```

The framework will procede the validation of the condition, and if the validation returns a status code different than 200 your get will not be executed.

Services available for integration
----------------------------------

1. API Gateway
2. DynamoDB

Node.js Versions
----------------

@raysouz/lambda-lowcode-layer was built using Node.js v14