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
const listSecrets = function (body) {
    let secret = data.map(obj => {
        return obj.name;
    });
    return {
        "vaultResponse": "Secrets obtidos com sucesso",
        "count": data.length,
        "data": secret
    }
};
const retrieveSecret = function (body) {
    let obj = JSON.parse(JSON.stringify(data.find(obj => {
        return obj.name === body.params.secretAlias;
    })));
    if (obj != undefined) {
        delete obj["name"];
        return obj;
    } else {
        return {
            "vaultResponse": `Secret nao encontrado - Alias: ${body.params.secretAlias}`
        };
    }
};
const deleteSecret = function (body) {
    let index = data.map(function (data) {
        return data.name;
    }).indexOf(body.params.secretAlias);
    data.splice(index, 1);
    return {
        "vaultResponse": "Deletado com sucesso"
    }
};
const upsertSecret = function (body) {
    let index = data.map(function (data) {
        return data.name;
    }).indexOf(body.params.secretAlias);
    if(index == -1){
        data.push({
            name : body.params.secretAlias,
            vaultResponse: `Secret obtido com sucesso - Alias: ${body.params.secretType}`,
            data:{...body.params.secret, updatedAt: new Date(), secretType: body.params.secretType}
        });
    } else {
        data[index] = {
            name : body.params.secretAlias,
            vaultResponse: `Secret obtido com sucesso - Alias: ${body.params.secretType}`,
            data:{...body.params.secret, updatedAt: new Date(), secretType: body.params.secretType}
        };
    }
    return {
        "vaultResponse": "Gravado com sucesso"
    }
};
const copySecret = function (body) {
    let obj = data.find(obj => {
        return obj.name === body.params.secretAlias;
    });
    if (obj != undefined) {
        return {
            "vaultResponse": "Gravado com sucesso"
        };
    } else {
        return {
            "vaultResponse": `Falha ao copiar secret - Secret nao encontrado - Alias: ${body.params.secretAlias}`
        };
    }
};
module.exports = {
    destination: function (req, res) {
        switch (req.body.actionName) {
            case "vault.listSecrets":
                res.send(listSecrets(req.body));
                break;
            case "vault.retrieveSecret":
                res.send(retrieveSecret(req.body));
                break;
            case "vault.deleteSecret":
                res.send(deleteSecret(req.body));
                break;
            case "vault.upsertSecret":
                res.send(upsertSecret(req.body));
                break;
            case "vault.copySecret":
                res.send(copySecret(req.body));
                break;
            default:
                break;
        }
    }
}