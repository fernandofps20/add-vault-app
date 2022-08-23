const express = require('express');
const controller = require('./controller.js');
const app = express();
app.use(express.json());

app.get('/local/api/:destination/:secretAlias', controller.destination);
app.get('/local/api/:destination', controller.destination);
app.put('/local/api/:destination', controller.destination);
app.post('/local/api/:destination', controller.destination);
app.delete('/local/api/:destination/:secretAlias', controller.destination);

app.use('/local/', express.static('../webapp'));

const port = process.env.PORT || 13500;
app.listen(port, function () {
    console.log("ADD-VAULT-APP - listening at port " + port);
});