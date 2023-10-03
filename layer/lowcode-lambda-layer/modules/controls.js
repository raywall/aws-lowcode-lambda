class Event {
    constructor(path, method, body) {
        this.method = method
        this.path = path
        this.body = body
    }
}

class Response {
    constructor(statusCode, message = null) {
        this.statusCode = statusCode
        this.message = message
    }
}

class Configuration {
    constructor(condition = undefined, headers = null, body = null, path = null) {
        this.condition = condition
        this.headers = headers
        this.body = this.body
        this.path = path
    }
}

module.exports = { Event, Response, Configuration }