sap.ui.define(["./BaseController", "../model/formatter", "sap/ui/model/json/JSONModel", "../service/VaultService", "sap/m/MessageBox", "sap/ui/core/Fragment", "sap/m/Dialog", "sap/m/Button", "sap/m/library"], function (BaseController, formatter, JSONModel, VaultService, MessageBox, Fragment, Dialog, Button, mobileLibrary) {
  const ButtonType = mobileLibrary.ButtonType;
  const DialogType = mobileLibrary.DialogType;
  return BaseController.extend("com.add.vault.controller.Main", {
    formatter: formatter,
    vaultService: new VaultService(),
    _fragments: [],
    onInit: async function () {
      this._setEventBus();
      let oModelListSecrets = new JSONModel(await this.vaultService.listSecrets());
      this.setModel(oModelListSecrets, "listSecrets");
    },
    onCloseDetail: function () {
      this.getView().byId("pageVaultDetail").destroyContent();
      this.getView().byId("btnEdit").setVisible(true);
      this.getView().byId("btnCopy").setVisible(true);
      this.getView().byId("btnDelete").setVisible(true);
      this.getView().byId("btnSave").setVisible(false);
      this.getView().byId("btnCancel").setVisible(false);
      this.closeDetail();
    },
    openDetails: async function (oEvent) {
      let oSource = oEvent.getSource();
      this.sSecretAlias = oSource.getCustomData()[0].getValue();
      let oModelRetrieveSecret = new JSONModel(await this.vaultService.retrieveSecret(this.sSecretAlias));
      oModelRetrieveSecret.getData().data.secretAlias = oSource.getCustomData()[0].getValue();
      this.setModel(oModelRetrieveSecret, "retrieveSecret");
      this.getView().byId("btnEdit").setVisible(true);
      this.getView().byId("btnCopy").setVisible(true);
      this.getView().byId("btnDelete").setVisible(true);
      this.getView().byId("btnSave").setVisible(false);
      this.getView().byId("btnCancel").setVisible(false);
      let sPath = `com.add.vault.fragment`;
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
            that._onPressDelete(that.sSecretAlias);
          }
        }
      });
    },
    _onPressDelete: async function (id) {
      let response = await this.vaultService.deleteSecret(id);
      this.setMessageToast(response.vaultResponse);
      this.onCloseDetail();
      this.getModel("listSecrets").setData(await this.vaultService.listSecrets());
      this.getModel("listSecrets").refresh(true);
      this.sSecretAlias = "";
    },
    createCredentials: async function () {
      this.onCloseDetail();
      let oModelSecrets = new JSONModel();
      await oModelSecrets.loadData("model/secrets.json");
      let index = oModelSecrets.getData().map(function (data) {
        return data.secretType;
      }).indexOf("certificate");
      this.setModel(new JSONModel(oModelSecrets.getData()[index]), "secret");
      let sName = "certificate.Change";
      let sPath = `com.add.vault.fragment`;
      let id = this.getView().getId() + "-" + sName;
      this.oCreateCredentials = new Dialog({
        title: "Create Secret",
        content: await Fragment.load({
          id: id,
          name: `${sPath}.${sName}`,
          controller: this
        }),
        beginButton: new Button({
          type: ButtonType.Emphasized,
          text: "Salvar",
          press: function () {
            this.onPressSave()
          }.bind(this)
        }),
        endButton: new Button({
          text: "Cancelar",
          press: function () {
            this.oCreateCredentials.destroyContent();
            this.oCreateCredentials.close();
          }.bind(this)
        })
      });
      this.getView().addDependent(this.oCreateCredentials);
      this.oCreateCredentials.open();
    },
    onChangeCreateCredentials: async function (oEvent) {
      let oSource = oEvent.getSource();
      let sPath = `com.add.vault.fragment`;
      let sKey = oSource.getSelectedKey();
      let sName = `${sKey}.Change`;
      let id = this.getView().getId() + "-" + sName;
      let oModelSecrets = new JSONModel();
      await oModelSecrets.loadData("model/secrets.json");
      let index = oModelSecrets.getData().map(function (data) {
        return data.secretType;
      }).indexOf(sKey);
      this.setModel(new JSONModel(oModelSecrets.getData()[index]), "secret");
      this.oCreateCredentials.destroyContent();
      this.oCreateCredentials.addContent(await Fragment.load({
        id: id,
        name: `${sPath}.${sName}`,
        controller: this
      }));
    },
    onPressSave: function () {
      let that = this;
      MessageBox.show("Tem certeza que deseja salvar?", {
        icon: MessageBox.Icon.INFORMATION,
        title: "Cancelar Cadastro",
        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
        emphasizedAction: MessageBox.Action.YES,
        onClose: function (oAction) {
          if (oAction == "YES") {
            that._saveForm();
          }
        }
      });
    },
    _saveForm: async function () {
      let bValidationError = false;
      try {
        /*this.aInputs.forEach( (oInput) => {
          bValidationError = this._validateInput(oInput) || bValidationError;
        }, this);
        if (bValidationError) throw new Error("Complete as informações");*/
        let index = this.getModel("listSecrets").getData().data.indexOf(this.getModel("secret").getData().secretAlias);
        if (index != -1) throw new Error("SecretAlias já cadastrado");
        let response = await this.vaultService.upsertSecret(this.getModel("secret").getData());
        this.getModel("listSecrets").setData(await this.vaultService.listSecrets());
        this.getModel("listSecrets").refresh(true);
        this.setMessageToast(response.vaultResponse);
        this.oCreateCredentials.close();
      } catch (err) {
        this.alertMessageBox(err.message);
      }
    },
    onPressEdit: async function () {
      let { secretAlias, secretType, updatedAt, ...secret } = this.getModel("retrieveSecret").getData().data;
      this.setModel(new JSONModel({ secretType, secretAlias, secret }), "secret");
      this.getView().byId("btnEdit").setVisible(false);
      this.getView().byId("btnCopy").setVisible(false);
      this.getView().byId("btnDelete").setVisible(false);
      this.getView().byId("btnSave").setVisible(true);
      this.getView().byId("btnCancel").setVisible(true);
      let sPath = `com.add.vault.fragment`;
      let sKey = this.getModel("retrieveSecret").getData().data.secretType;
      let sName = `${sKey}.Change`;
      let id = this.getView().getId() + "-" + sName;
      let oPageDetail = this.getView().byId("pageVaultDetail")
      oPageDetail.destroyContent();
      oPageDetail.addContent(await Fragment.load({
        id: id,
        name: `${sPath}.${sName}`,
        controller: this
      }));
      this.getFragmentControlById(id, "selectSecret").setEnabled(false);
    },
    onPressCancelEdit: async function () {
      this.getView().byId("btnEdit").setVisible(true);
      this.getView().byId("btnCopy").setVisible(true);
      this.getView().byId("btnDelete").setVisible(true);
      this.getView().byId("btnSave").setVisible(false);
      this.getView().byId("btnCancel").setVisible(false);
      let sPath = `com.add.vault.fragment`;
      let sKey = this.getModel("retrieveSecret").getData().data.secretType;
      let sName = `${sKey}.Display`;
      let id = this.getView().getId() + "-" + sName;
      let oPageDetail = this.getView().byId("pageVaultDetail")
      oPageDetail.destroyContent();
      oPageDetail.addContent(await Fragment.load({
        id: id,
        name: `${sPath}.${sName}`,
        controller: this
      }));
    },
    onPressSaveEdit: function () {
      let that = this;
      MessageBox.show("Tem certeza que deseja salvar?", {
        icon: MessageBox.Icon.INFORMATION,
        title: "Cancelar Cadastro",
        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
        emphasizedAction: MessageBox.Action.YES,
        onClose: function (oAction) {
          if (oAction == "YES") {
            that._saveEditForm();
          }
        }
      });
    },
    _saveEditForm: async function () {
      let bValidationError = false;
      try {
        /*this.aInputs.forEach( (oInput) => {
          bValidationError = this._validateInput(oInput) || bValidationError;
        }, this);
        if (bValidationError) throw new Error("Complete as informações");*/
        let response = await this.vaultService.upsertSecret(this.getModel("secret").getData());
        this.getModel("listSecrets").setData(await this.vaultService.listSecrets());
        this.getModel("listSecrets").refresh(true);
        this.setMessageToast(response.vaultResponse);
        this.onCloseDetail();
      } catch (err) {
        this.alertMessageBox(err.message);
      }
    },
    onPressCopy: function () {
      this.onCloseDetail();
      let { secretAlias, secretType } = this.getModel("retrieveSecret").getData().data;
      this.setModel(new JSONModel({secretAlias, secretType}), "copySecret");
      this.openFragment("DialogCopySecret");
    },
    onPressCancelCopy: function () {
      this.closeFragment();
    },
    onPressSaveCopy: function () {
      let that = this;
      MessageBox.show("Tem certeza que deseja salvar?", {
        icon: MessageBox.Icon.INFORMATION,
        title: "Cancelar Cadastro",
        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
        emphasizedAction: MessageBox.Action.YES,
        onClose: function (oAction) {
          if (oAction == "YES") {
            that._saveCopyForm();
          }
        }
      });
    },
    _saveCopyForm: async function () {
      let bValidationError = false;
      try {
        /*this.aInputs.forEach( (oInput) => {
          bValidationError = this._validateInput(oInput) || bValidationError;
        }, this);
        if (bValidationError) throw new Error("Complete as informações");*/
        let response = await this.vaultService.copySecret(this.getModel("copySecret").getData());
        this.getModel("listSecrets").setData(await this.vaultService.listSecrets());
        this.getModel("listSecrets").refresh(true);
        this.setMessageToast(response.vaultResponse);
        this.closeFragment();
      } catch (err) {
        this.alertMessageBox(err.message);
      }
    }
  });
});