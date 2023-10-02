class DynamoResource {
    constructor(tableName, pk, sk) {
        this.tableName = tableName
        this.pk = pk
        this.sk = sk
    }
}

module.exports = { DynamoResource }