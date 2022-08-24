sap.ui.define(["./BaseController", "../model/formatter", "sap/ui/model/json/JSONModel", "sap/m/Label", "sap/m/Text", "../service/VaultService", "sap/m/MessageBox", "sap/ui/core/Fragment", "sap/m/Dialog", "sap/m/Button", "sap/m/library"], function (BaseController, formatter, JSONModel, Label, Text, VaultService, MessageBox, Fragment, Dialog, Button, mobileLibrary) {
  const ButtonType = mobileLibrary.ButtonType;
  const DialogType = mobileLibrary.DialogType;
  return BaseController.extend("com.add.vault.controller.Main", {
    formatter: formatter,
    vaultService: new VaultService(),
    _fragments: [],
    onInit: async function () {
      this._setEventBus();
      let oModelListSecrets = new JSONModel(JSON.parse(await this.vaultService.listSecrets()));
      this.setModel(oModelListSecrets, "listSecrets");
    },
    onCloseDetail: function () {
      this.getView().byId("pageVaultDetail").destroyContent();
      this.closeDetail();
    },
    openDetails: async function (oEvent) {
      let oSource = oEvent.getSource();
      this.sValue = oSource.getCustomData()[0].getValue();
      let oModelRetrieveSecret = new JSONModel(JSON.parse(await this.vaultService.retrieveSecret(this.sValue)));
      oModelRetrieveSecret.getData().data.secretAlias = oSource.getCustomData()[0].getValue();
      this.setModel(oModelRetrieveSecret, "retrieveSecret");
      let sPath = `com.add.vault.fragments`;
      let sKey = oModelRetrieveSecret.getData().data.secretType;
      let sName = `${sKey}.Display`;
      let id = this.getView().getId() + "-" + sName;
      let oPageDetail = this.getView().byId("pageVaultDetail")
      oPageDetail.destroyContent();
      oPageDetail.addContent(await Fragment.load({
        id: id,
        name: `${sPath}.${sName}`,
        controller: this
      }));
      this.handleMasterPress();
    },
    onPressDelete: function () {
      let that = this;
      MessageBox.show("Tem certeza que deseja deletar o cadastro?", {
        icon: MessageBox.Icon.INFORMATION,
        title: "Deletar cadastro",
        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
        emphasizedAction: MessageBox.Action.YES,
        onClose: function (oAction) {
          if (oAction == "YES") {
            that._onPressDelete(that.sValue);
          }
        }
      });
    },
    _onPressDelete: async function (id) {
      await this.vaultService.deleteSecret(id);
      this.updateModel(this.getModel("listSecrets"), id, "remove");
      this.onCloseDetail();
      //this.getModel("listSecrets").setData(JSON.parse(await this.vaultService.listSecrets()));
      //this.getModel("listSecrets").refresh(true);
      this.setMessageToast("Dado deletado com sucesso!");
      this.sValue = "";
    },
    createCredentials: async function () {
      let sName = "certificate.Change";
      let sPath = `com.add.vault.fragments`;
      let id = this.getView().getId() + "-" + sName;
      this.oCreateCredentials = new Dialog({
        title: "Create Secret",
        content: await Fragment.load({
          id: id,
          name: `${sPath}.${sName}`,
          controller: this
        }),
        beginButton: new Button({
          text: "Salvar",
          press: function () {
            this.oCreateCredentials.close();
          }.bind(this)
        }),
        endButton: new Button({
          text: "Cancelar",
          press: function () {
            this.oCreateCredentials.close();
          }.bind(this)
        })
      });
      this.getView().addDependent(this.oCreateCredentials);
      this.oCreateCredentials.open();
    },
    onChangeCreateCredentials: async function (oEvent) {
      let oSource = oEvent.getSource();
      let sPath = `com.add.vault.fragments`;
      let sKey = oSource.getSelectedKey();
      let sName = `${sKey}.Change`;
      let id = this.getView().getId() + "-" + sName;
      this.oCreateCredentials.destroyContent();
      this.oCreateCredentials.addContent(await Fragment.load({
        id: id,
        name: `${sPath}.${sName}`,
        controller: this
      }));
    }
  });
});