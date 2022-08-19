const axios = require('axios');

const listSecrets = async function () {
    return await axios.request({
        url: `http://localhost:13501/api/listSecrets`,
        method: 'get',
        headers: {
            "accept": "application/json",
            "content-type": "application/json"
        },
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log('EEEEEXCEPTION: ' + err.toString());
    });
};
const retrieveSecret = async function (secretAlias) {
    return await axios.request({
        url: `http://localhost:13501/api/retrieveSecret/${secretAlias}`,
        method: 'get',
        headers: {
            "accept": "application/json",
            "content-type": "application/json"
        },
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log('EEEEEXCEPTION: ' + err.toString());
    });
};
const deleteSecret = async function (secretAlias) {
    return await axios.request({
        url: `http://localhost:13501/api/deleteSecret/${secretAlias}`,
        method: 'delete',
        headers: {
            "accept": "application/json",
            "content-type": "application/json"
        },
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log('EEEEEXCEPTION: ' + err.toString());
    });
};
const upsertSecret = async function (secretAlias) {
    return await axios.request({
        url: `http://localhost:13501/api/upsertSecret/${secretAlias}`,
        method: 'post',
        headers: {
            "accept": "application/json",
            "content-type": "application/json"
        },
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log('EEEEEXCEPTION: ' + err.toString());
    });
};
const copySecret = async function (secretAlias) {
    return await axios.request({
        url: `http://localhost:13501/api/copySecret/${secretAlias}`,
        method: 'put',
        headers: {
            "accept": "application/json",
            "content-type": "application/json"
        },
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
                res.send(await upsertSecret(req.params.secretAlias));
                break;
            case "copySecret":
                res.send(await copySecret(req.params.secretAlias));
                break;
            default:
                break;
        }
    }
}