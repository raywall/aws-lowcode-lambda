const { lowcodeLambda } = require("/opt/nodejs/lowcode-lambda-layer");
const config = require("./setting.json");

exports.handler = async (event, context) => {
    return lowcodeLambda(event, context, config)
}