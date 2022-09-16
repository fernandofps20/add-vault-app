const request = require('supertest');
const app = require('./server');

describe('Integration Test', ()=>{
    describe('Testing all routes', ()=>{
        it('Should test the GET route for listSecrets', async () => {
            const res = await request(app).get('/local/api/listSecrets');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('statusInfo.message');
        })
        it('Should test the GET route for retrieveSecret', async () => {
            const alias = "companycert1";
            const res = await request(app).get(`/local/api/retrieveSecret/${alias}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('statusInfo.message');
        })
        it('Should test the DELETE route for deleteSecret', async () => {
            const alias = "companycert1";
            const res = await request(app).delete(`/local/api/deleteSecret/${alias}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('statusInfo.message');
        })
        it('Should test the PUT route for copySecret', async () => {
            const alias = "companycert1";
            const res = await request(app).put(`/local/api/copySecret`).send({
                secretType: "others",
                secretAlias: "companyothers1",
                newSecretAlias: "companyothers2"
            });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('statusInfo.message');
        })
        it('Should test the POST route for upsertSecret', async () => {
            const alias = "companycert1";
            const res = await request(app).post(`/local/api/upsertSecret`).send({
                expiryDate: "2023-01-23",
                ouField: "MTIzNDU2Nzg5",
                pbKey: "",
                pkcs12: "aGFzaDEyMzEyMzIxMzIxMzEyMzIxMzEyMzEyYWRzbGtqMW5kbGsxa2xkazFqbGsxZGpsag==",
                pkcs12Password: "MTIzNDU2Nzg5",
                pvKey: "",
                secretType: "certificate",
                secretAlias: "companycert3"
            });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('statusInfo.message');
        })
    })
    describe('Testing incorrect requests', ()=>{
        it('Should test incorrect body for route upsertSecret', async () => {
            const alias = "companycert1";
            const res = await request(app).post(`/local/api/upsertSecret`).send({
                secretType: "certificate",
                secretAlias: "companycert3"
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('statusInfo.message');
        })
        it('Should test incorrect body for route copySecret', async () => {
            const alias = "companycert1";
            const res = await request(app).put(`/local/api/copySecret`).send({
                secretType: "certificate",
                secretAlias: "companycert3"
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('statusInfo.message');
        })
    });
})