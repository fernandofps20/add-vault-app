const express = require('express');
const controller = require('./controller.js');
const app = express();
app.use(express.json());
app.post('/api/call', controller.destination);

const port = process.env.PORT || 13501;
app.listen(port, function () {
    console.log("ADD-VAULT-APP-BACKEND - listening at port " + port);
});