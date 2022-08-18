sap.ui.define(["./BaseController", "../model/formatter", "sap/ui/model/json/JSONModel", "sap/m/Label", "sap/m/Text", "../service/VaultService", "sap/m/MessageBox"], function (BaseController, formatter, JSONModel, Label, Text, VaultService, MessageBox) {
  return BaseController.extend("com.add.vault.controller.Main", {
    formatter: formatter,
    vaultService: new VaultService(),
    onInit: async function () {
      this._setEventBus();
      let oModelListSecrets = new JSONModel(JSON.parse(await this.vaultService.listSecrets()));
      this.setModel(oModelListSecrets, "listSecrets");
    },
    onCloseDetail: function () {
      this.getView().byId("simpleVaultDetail").destroyContent();
      this.closeDetail();
    },
    openDetails: async function (oEvent) {
      let oSource = oEvent.getSource();
      let sValue = oSource.getCustomData()[0].getValue();
      let aKeysValues = Object.entries(JSON.parse(await this.vaultService.retrieveSecret(sValue)).data);
      let oPageDetail = this.getView().byId("simpleVaultDetail");
      oPageDetail.destroyContent();
      for (let i in aKeysValues) {
        oPageDetail.addContent(new Label({
          text: aKeysValues[i][0]
        }));
        oPageDetail.addContent(new Text({
          text: aKeysValues[i][1]
        }));
      }

      this.handleMasterPress();
    },
    _deleteLine: function (oEvent) {
      let that = this;
      let sPath = oEvent.getParameter("listItem").oBindingContexts.listSecrets.getPath().replace("/data/", "");
      let customId = this.getModel("listSecrets").getData().data[sPath];
      MessageBox.show("Tem certeza que deseja deletar o cadastro?", {
        icon: MessageBox.Icon.INFORMATION,
        title: "Deletar cadastro",
        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
        emphasizedAction: MessageBox.Action.YES,
        onClose: function (oAction) {
          if (oAction == "YES") {
            that._onPressDelete(customId);
          }
        }
      });
    },
    _onPressDelete: async function (id) {
      await this.vaultService.deleteSecret(id);
      this.updateModel(this.getModel("listSecrets"), id, "remove");
      this.setMessageToast("Dado deletado com sucesso!");
      this.cancelDelete();
    },
    selectDelete: function () {
      this._pressSelectDelete(this.byId("listSecretsTable"));
    },
    cancelDelete: function () {
      this._pressCancelDelete(this.byId("listSecretsTable"));
    }
  });
});