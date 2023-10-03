const { formatError, formatResponse } = require('../structure/functions');
const https = require('https');

export class ApiResource {
    constructor(hostname, port) {
        this.hostname = hostname
        this.port = port
    }    

    _request(path, method, headers = null, body = null) {
        return new Promise(async (resolve, reject) => {
            let options = {
                hostname: this.hostname,
                port: this.port,
                path: path,
                method: method,
                headers: headers === null ? {} : headers
            }
    
            const req = https.request(options, (res) => {
                let data = '';
              
                res.on('data', (chunk) => {
                  data += chunk
                })
              
                res.on('end', () => {
                    return resolve(formatResponse(res.statusCode, data))
                })
            })
              
            req.on('error', (error) => {
                return reject(formatError(500, error.message))
            })
    
            if (method === 'POST' || method === 'PUT')
                req.write(body)
              
            req.end();
        })
    }

    // method: get
    async get(path, headers = null) {
        return this._request(path, 'GET', headers)
    }

    // method: post
    async post(path, headers = null, body = null) {
        return this._request(path, 'POST', headers, body)
    }

    // method: put
    async put(path, headers = null, body = null) {
        return this._request(path, 'PUT', headers, body)
    }

    // method: delete
    async delete(path, headers = null) {
        return this._request(path, 'DELETE', headers)
    }
}