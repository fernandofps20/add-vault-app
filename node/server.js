const express = require('express');
const controller = require('./controller.js');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use('/local/', express.static('../webapp'));

app.get('/', (req, res) =>{
    res.send({message: "OK"})
})
app.get('/local/api/:destination/:secretAlias', controller.destination);
app.get('/local/api/:destination', controller.destination);
app.put('/local/api/:destination', controller.destination);
app.post('/local/api/:destination', controller.destination);
app.delete('/local/api/:destination/:secretAlias', controller.destination);

module.exports = app;