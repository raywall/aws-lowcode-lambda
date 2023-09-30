#!/bin/sh
# docker run -d -p 8000:8000 --network local-api-network --hostname dynamodb --name dynamodb amazon/dynamodb-local:latest
# sleep 5

# aws dynamodb create-table --endpoint-url http://localhost:8000 --table-name UserTable --attribute-definitions AttributeName="userId",AttributeType="S" --key-schema AttributeName="userId",KeyType=HASH --provisioned-throughput ReadCapacityUnits=2,WriteCapacityUnits=2

sam build -t template.yaml
sam local start-api --debug --docker-network local-api-network --skip-pull-image