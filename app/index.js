const { lowcodeLambda } = require("/opt/nodejs/lowcode-lambda-layer");
const config = require("./settings.json");

exports.handler = async (event, context) => {
    return await lowcodeLambda(event, context, config)
}