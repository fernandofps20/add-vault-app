const express = require('express');
const controller = require('./controller.js');
const app = express();
app.use(express.json());
app.get('/api/retrieveSecret/:id', controller.retrieveSecret);
app.get('/api/listSecrets', controller.listSecrets);
app.put('/api/copySecret/:id', controller.copySecret);
app.post('/api/upsertSecret/:id', controller.upsertSecret);
app.delete('/api/deleteSecret/:id', controller.deleteSecret);

const port = process.env.PORT || 13501;
app.listen(port, function () {
    console.log("ADD-VAULT-APP-BACKEND - listening at port " + port);
});