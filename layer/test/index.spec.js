const { lowcodeLambda } = require('../lowcode-lambda-layer')

describe('verify tests of the application', () => {
    it('verify result of method method', () => {
        const res = method()
        expect(res).toBe(0)
    })

    it('verify return value handler', async () => {
        const expectedResult = mockupReturn(3)
        const res = await lowcodeLambda({ v1: 1, v2: 2 })
        expect(res).toEqual(expectedResult)
    })

    it('verify if return of the handler not contains status code 400', async () => {
        const res = await lowcodeLambda({ v1: 1, v2: 2 })
        expect(res).not.toMatch(/"statusCode":400/)
    })
})

const mockupReturn = (res) => {
    return JSON.stringify({
        statusCode: 200,
        body: 'the result is ' + res
    })
}