sap.ui.define(["./CoreService"], function (CoreService) {
    return CoreService.extend("com.add.vault.service.VaultService", {
        retrieveSecret: function (secretAlias) {
            return this.http(`api/retrieveSecret`).get(false, {secretAlias});
        },
        listSecrets: function () {
            return this.http("api/listSecrets").get();
        },
        upsertSecret: function (body) {
            return this.http("api/call/upsertSecret").post(false, body);
        },
        copySecret: function (body) {
            return this.http("/api/call/copySecret").put(false, body);
        },
        deleteSecret: function (secretAlias) {
            return this.http(`api/deleteSecret/${secretAlias}`).delete();
        }
    })
});