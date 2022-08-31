const axios = require('axios');

const listSecrets = async function () {
    return await axios.request({
        url: `http://localhost:13501/api/call`,
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
        url: `http://localhost:13501/api/call`,
        method: 'post',
        headers: {
            "accept": "application/json",
            "content-type": "application/json"
        },
        data:{
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
        url: `http://localhost:13501/api/call`,
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
    const { secretType, secretAlias, ...secret } = body;
    return await axios.request({
        url: `http://localhost:13501/api/call`,
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
};
const copySecret = async function (body) {
    return await axios.request({
        url: `http://localhost:13501/api/call`,
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