const express = require('express');
const controller = require('./controller.js');
const app = express();
app.use(express.json());
app.post('/api/call', controller.destination);

module.exports = app;