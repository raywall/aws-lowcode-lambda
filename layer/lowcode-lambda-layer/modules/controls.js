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

module.exports = { Event, Response }