const resourceType = {
    API: "api",
    SQS: "sqs",
    SNS: "sns",
    BucketS3: "bucket",
    DynamoDB: "dynamodb",
    StepFunction: "stepfunction"
}

const actionType = {
    Query: "query",
    Insert: "insert",
    Update: "update",
    Delete: "delete",
    Process: "process",
    Download: "download",
    Upload: "upload"
}

module.exports = { actionType, resourceType }