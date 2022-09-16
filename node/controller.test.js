const controller = require('./controller');
//const request = require('supertest');
process.env.BACKEND_URL = "http://localhost:13501/api/call"

describe('Testando controller', () => {
    it('testando listSecrets', async () => {
        const req = {
            params: {
                destination: "listSecrets"
            }
        }
        const res = {
            status: (statusCode) => {
                console.log(statusCode)
                return statusCode;
            },
            send: (vault) => {
                console.log(vault)
                return vault
            }
        }
        //console.log(await controller.destination(req, res))
        //expect(controller.destination(req, res)).toHaveProperty('statusInfo.message');

    })
})