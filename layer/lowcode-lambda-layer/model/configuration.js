class Configuration {
    constructor(condition = undefined, headers = null, body = null, path = null) {
        this.condition = condition
        this.headers = headers
        this.body = this.body
        this.path = path
    }
}

module.exports = { Configuration }