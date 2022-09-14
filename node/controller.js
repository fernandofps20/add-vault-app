const axios = require('axios');
const secrets = require('./secrets.json');
const { Buffer } = require('node:buffer');

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
        return {
            context: "Success",
            statusInfo: {
                status: response.status,
                errorCode: null,
                message: response.data,
                solution: null,
                trace: null
            }
        }
    }).catch(error => {
        return {
            context: "Error",
            statusInfo: {
                status: error.response.data,
                errorCode: null,
                message: error.response.data,
                solution: null,
                trace: null
            }
        }
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
        switch (response.data.data.secretType) {
            case "certificate":
                //response.data.data.pkcs12Password = Buffer.from(response.data.data.pkcs12Password, 'base64').toString('utf8');
                response.data.data.pkcs12Password = "";
                response.data.data.ouField = Buffer.from(response.data.data.ouField, 'base64').toString('utf8');
                break;
            case "mailcredentials":
                response.data.data.mailPassword = Buffer.from(response.data.data.mailPassword, 'base64').toString('utf8');
                break;
            case "oauthcredentials":
                break;
            case "others":
                response.data.data.credentialSecret = Buffer.from(response.data.data.credentialSecret, 'base64').toString('utf8');
                break;
            case "usercredentials":
                response.data.data.userPassword = Buffer.from(response.data.data.userPassword, 'base64').toString('utf8');
                response.data.data.userDirectoryAddress = Buffer.from(response.data.data.userDirectoryAddress, 'base64').toString('utf8');
                break;
            default:
                break;
        }
        return {
            context: "Success",
            statusInfo: {
                status: response.status,
                errorCode: null,
                message: response.data,
                solution: null,
                trace: null
            }
        }
    }).catch(error => {
        return {
            context: "Error",
            statusInfo: {
                status: error.response.data,
                errorCode: null,
                message: error.response.data,
                solution: null,
                trace: null
            }
        }
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
        return {
            context: "Success",
            statusInfo: {
                status: response.status,
                errorCode: null,
                message: response.data,
                solution: null,
                trace: null
            }
        }
    }).catch(error => {
        return {
            context: "Error",
            statusInfo: {
                status: error.response.data,
                errorCode: null,
                message: error.response.data,
                solution: null,
                trace: null
            }
        }
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
        } else {
            throw new Error("Requisição invalida");
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
            return {
                context: "Success",
                statusInfo: {
                    status: response.status,
                    errorCode: null,
                    message: response.data,
                    solution: null,
                    trace: null
                }
            }
        }).catch(error => {
            return {
                context: "Error",
                statusInfo: {
                    status: error.response.data,
                    errorCode: null,
                    message: error.response.data,
                    solution: null,
                    trace: null
                }
            }
        });
    } catch (error) {
        return {
            context: "Error",
            statusInfo: {
                status: 400,
                errorCode: null,
                message: error.message,
                solution: null,
                trace: null
            }
        }
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
        } else {
            throw new Error("Requisição invalida");
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
            return {
                context: "Success",
                statusInfo: {
                    status: response.status,
                    errorCode: null,
                    message: response.data,
                    solution: null,
                    trace: null
                }
            }
        }).catch(error => {
            return {
                context: "Error",
                statusInfo: {
                    status: error.response.data,
                    errorCode: null,
                    message: error.response.data,
                    solution: null,
                    trace: null
                }
            }
        });
    } catch (error) {
        return {
            context: "Error",
            statusInfo: {
                status: 400,
                errorCode: null,
                message: error.message,
                solution: null,
                trace: null
            }
        }
    }
};

module.exports = {
    destination: async function (req, res) {
        let vault;
        switch (req.params.destination) {
            case "listSecrets":
                vault = await listSecrets();
                res.status(vault.statusInfo.status).send(vault);
                break;
            case "retrieveSecret":
                vault = await retrieveSecret(req.params.secretAlias);
                res.status(vault.statusInfo.status).send(vault);
                break;
            case "deleteSecret":
                vault = await deleteSecret(req.params.secretAlias);
                res.status(vault.statusInfo.status).send(vault);
                break;
            case "upsertSecret":
                vault = await upsertSecret(req.body);
                res.status(vault.statusInfo.status).send(vault);
                break;
            case "copySecret":
                vault = await copySecret(req.body);
                res.status(vault.statusInfo.status).send(vault);
                break;
            default:
                break;
        }
    }
}