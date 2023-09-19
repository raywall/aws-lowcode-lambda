const AWS = require("aws-sdk")
const dynamodb = new AWS.DynamoDB.DocumentClient({
    region: "sa-east-1",
    endpoint: "http://dynamodb:8000"
})

async function insertItem(params) {
    return dynamodb.put(params).promise()
}

async function updateItem(params) {
    return dynamodb.update(params).promise()
}

async function deleteItem(params) {
    return dynamodb.delete(params).promise()
}

async function getItem(params) { 
    return dynamodb.get(params).promise()
}

module.exports = { insertItem, updateItem, deleteItem, getItem }