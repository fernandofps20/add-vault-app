const data = [
    {
        "name": "companycert1",
        "vaultResponse": "Secret obtido com sucesso - Alias: companycert1",
        "data": {
            "expiryDate": "20230123",
            "ouField": "hash12390u12oi231u213o231",
            "pbKey": "empty",
            "pkcs12": "hash12312321321312321312312adslkj1ndlk1kldk1jlk1djlj",
            "pkcs12Password": "hash1231312j12eklje2lj11",
            "pvKey": "empty",
            "secretType": "certificate",
            "updatedAt": "2022-08-15T11:44:14.376Z"
        }
    }, {
        "name": "companymail1",
        "vaultResponse": "Secret obtido com sucesso - Alias: companymail1",
        "data": {
            "mailAddress": "mailbox@company.com",
            "mailId": "mailbox",
            "mailPassword": "hash121j22jl21jl1",
            "mailUserAccount": "mailboxuser",
            "mailUserDomain": "companydomain",
            "passwordExpiryDate": "20230606",
            "secretType": "mailcredentials",
            "updatedAt": "2022-08-15T11:44:18.203Z"
        }
    }, {
        "name": "companyoauth1",
        "vaultResponse": "Secret obtido com sucesso - Alias: companyoauth1",
        "data": {
            "clientId": "hash213ljkkl13j23",
            "clientSecret": "hashkj21jh3k21hj3",
            "secretExpiryDate": "20230418",
            "secretType": "oauthcredentials",
            "tenant": "hash23j4jk32k342",
            "updatedAt": "2022-08-15T11:44:45.652Z"
        }
    }, {
        "name": "companyothers1",
        "vaultResponse": "Secret obtido com sucesso - Alias: companyothers1",
        "data": {
            "credentialSecret": "hash12j3l21j1j2lk3j21l",
            "secretType": "others",
            "updatedAt": "2022-08-15T11:44:31.360Z"
        }
    }, {
        "name": "companyuser1",
        "vaultResponse": "Secret obtido com sucesso - Alias: companyuser1",
        "data": {
            "passwordExpiryDate": "20221230",
            "secretType": "usercredentials",
            "updatedAt": "2022-08-15T11:44:20.963Z",
            "userAccount": "useraccount",
            "userDirectoryAddress": "hash123hh21u3uh231",
            "userDomain": "companydomain",
            "userPassword": "hash12321j123jj231j"
        }
    }
];
module.exports = {
    listSecrets: function (req, res) {
        res.send({
            "vaultResponse": "Secrets obtidos com sucesso",
            "count": 7,
            "data": [
                "companycert1",
                "companycert2",
                "companymail1",
                "companyoauth1",
                "companyothers1",
                "companyothers3",
                "companyuser1"
            ]
        });
    },
    deleteSecret: function (req, res) {
        res.send({
            "vaultResponse": "Deletado com sucesso"
        });
    },
    retrieveSecret: function (req, res) {
        let obj = JSON.parse(JSON.stringify(data.find(obj => {
            return obj.name === secretAlias;
        })));
        if (obj != undefined) {
            delete obj["name"];
            res.send(obj);
        } else {
            res.send({
                "vaultResponse": `Secret nao encontrado - Alias: ${secretAlias}`
            });
        }
    },
    destination: function (req, res) {
        switch (req.params.destination) {
            case "listSecrets":
                result = listSecrets();
                res.send(result);
                break;
            case "retrieveSecret":
                result = retrieveSecret(req.query.secretAlias);
                res.send(result);
                break;
            case "deleteSecret":
                result = deleteSecret(req.params.secretAlias);
                res.send(result);
                break;
            case "upsertSecret":
                res.send({
                    "vaultResponse": "Gravado com sucesso"
                });
                break;
            case "copySecret":
                obj = data.find(obj => {
                    return obj.name === req.body.params.secretAlias;
                });
                if (obj != undefined) {
                    res.send({
                        "vaultResponse": "Gravado com sucesso"
                    });
                } else {
                    res.send({
                        "vaultResponse": `Secret nao encontrado - Alias: ${req.body.params.secretAlias}`
                    });
                }
                break;
            default:
                break;
        }
    }
}