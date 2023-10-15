export class Event {
    constructor(path, method, body) {
        this.method = method
        this.path = path
        this.body = body
    }
}