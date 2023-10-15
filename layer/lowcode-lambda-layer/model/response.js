export class Response {
    constructor(statusCode, message = null) {
        this.statusCode = statusCode
        this.message = message
    }
}