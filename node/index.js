const app = require('./server');

const port = process.env.PORT || 13500;
app.listen(port, function () {
    console.log("ADD-VAULT-APP - listening at port " + port);
});