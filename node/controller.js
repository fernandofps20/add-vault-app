const axios = require('axios');
const secrets = require('./secrets.json');

const listSecrets = async function () {
    return await axios.request({
        url: process.env.BACKEND_URL,
        method: 'post',
        headers: {
            "accept": "application/json",
            "content-type": "application/json"
        },
        data: {
            "actionName": "vault.listSecrets",
            "params": {
                "secretType": "",
                "companyCode": ""
            }
        }
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log('EEEEEXCEPTION: ' + err.toString());
    });
};
const retrieveSecret = async function (secretAlias) {
    return await axios.request({
        url: process.env.BACKEND_URL,
        method: 'post',
        headers: {
            "accept": "application/json",
            "content-type": "application/json"
        },
        data: {
            "actionName": "vault.retrieveSecret",
            "params": {
                "secretType": "",
                "secretAlias": secretAlias
            }
        }
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log('EEEEEXCEPTION: ' + err.toString());
    });
};
const deleteSecret = async function (secretAlias) {
    return await axios.request({
        url: process.env.BACKEND_URL,
        method: 'post',
        headers: {
            "accept": "application/json",
            "content-type": "application/json"
        },
        data: {
            "actionName": "vault.deleteSecret",
            "params": {
                "secretType": "",
                "secretAlias": secretAlias,
                "companyCode": ""
            }
        }
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log('EEEEEXCEPTION: ' + err.toString());
    });
};
const upsertSecret = async function (body) {
    try {
        if (!body.hasOwnProperty('secretType')) throw new Error("Propriedade não encontrada");
        let index = secrets.map(function (data) {
            return data.secretType;
        }).indexOf(body.secretType);
        if (index == -1) throw new Error("SecretType não encontrado");
        const obj = secrets[index]
        if (Object.keys(body).length === Object.keys(obj).length) {
            const prop = Object.keys(body).every(
                key => obj.hasOwnProperty(key)
                    && obj[key] === body[key]);
            if (prop) throw new Error("Propriedades incorretas");
        }
        const { secretType, secretAlias, ...secret } = body;
        return await axios.request({
            url: process.env.BACKEND_URL,
            method: 'post',
            headers: {
                "accept": "application/json",
                "content-type": "application/json"
            },
            data: {
                "actionName": "vault.upsertSecret",
                "params": { secretType, secretAlias, secret }
            },
        }).then(response => {
            return response.data;
        }).catch(err => {
            console.log('EEEEEXCEPTION: ' + err.toString());
        });
    } catch (error) {
        return error
    }
};
const copySecret = async function (body) {
    try {
        const obj = {
            secretType: "",
            secretAlias: "",
            newSecretAlias: ""
        }
        if (Object.keys(body).length === Object.keys(obj).length) {
            const prop = Object.keys(body).every(
                key => obj.hasOwnProperty(key)
                    && obj[key] === body[key]);
            if (prop) throw new Error("Propriedades incorretas");
        }
        return await axios.request({
            url: process.env.BACKEND_URL,
            method: 'post',
            headers: {
                "accept": "application/json",
                "content-type": "application/json"
            },
            data: {
                "actionName": "vault.copySecret",
                "params": body
            }
        }).then(response => {
            return response.data;
        }).catch(err => {
            console.log('EEEEEXCEPTION: ' + err.toString());
        });
    } catch (error) {
        return error
    }
};

module.exports = {
    destination: async function (req, res) {
        switch (req.params.destination) {
            case "listSecrets":
                res.send(await listSecrets());
                break;
            case "retrieveSecret":
                res.send(await retrieveSecret(req.params.secretAlias));
                break;
            case "deleteSecret":
                res.send(await deleteSecret(req.params.secretAlias));
                break;
            case "upsertSecret":
                res.send(await upsertSecret(req.body));
                break;
            case "copySecret":
                res.send(await copySecret(req.body));
                break;
            default:
                break;
        }
    }
}