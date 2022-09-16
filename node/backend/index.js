const app = require('./server');

const port = process.env.PORT || 13501;
app.listen(port, function () {
    console.log("ADD-VAULT-APP-BACKEND - listening at port " + port);
});