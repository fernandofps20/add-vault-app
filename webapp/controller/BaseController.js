sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/UIComponent", "sap/ui/core/routing/History", "sap/ui/core/Core", "sap/m/MessageToast"], function (Controller, UIComponent, History, Core, MessageToast) {
  return Controller.extend("com.add.vault.controller.BaseController", {
    getOwnerComponent: function () {
      return Controller.prototype.getOwnerComponent.call(this);
    },
    getRouter: function () {
      return UIComponent.getRouterFor(this);
    },
    getResourceBundle: function () {
      const oModel = this.getOwnerComponent().getModel("i18n");
      return oModel.getResourceBundle();
    },
    getModel: function (sName) {
      return this.getView().getModel(sName);
    },
    setModel: function (oModel, sName) {
      this.getView().setModel(oModel, sName);
      return this;
    },
    navTo: function (sName, oParameters, bReplace) {
      this.getRouter().navTo(sName, oParameters, undefined, bReplace);
    },
    onNavBack: function () {
      const sPreviousHash = History.getInstance().getPreviousHash();

      if (sPreviousHash !== undefined) {
        window.history.go(-1);
      } else {
        this.getRouter().navTo("main", {}, undefined, true);
      }
    },
    getEventBus: function () {
      return this.getOwnerComponent().getEventBus();
    },
    _setEventBus: function () {
      this.bus = Core.getEventBus();
      this.bus.subscribe("flexible", "setDetailPage", this.setDetailPage, this);
      this.oFlexibleColumnLayout = this.byId("flexibleColumnLayoutRegistration");
    },
    setDetailPage: function () {
      if (!this.detailView) {
        this.detailView = this.byId("pageVaultDetail");
        this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
      }

      this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
    },
    handleMasterPress: function () {
      this.bus.publish("flexible", "setDetailPage");
    },
    closeDetail: function () {
      this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
    },
    _pressSelectDelete: function (oTable) {
      oTable.setMode("Delete");
      this.byId("buttonCancel").setVisible(true);
      this.byId("buttonDelete").setVisible(false);
    },
    _pressCancelDelete: function (oTable) {
      oTable.setMode("None");
      this.byId("buttonCancel").setVisible(false);
      this.byId("buttonDelete").setVisible(true);
    },
    updateModel: function(oModel, value, change) {
      if (change == "create") {
          oModel.getData().data.push(value);
      } else if (change == "update") {
          var index = oModel.getData().data.indexOf(value);
          oModel.getData().data[index] = value;
      } else if (change == "remove") {
          var index = oModel.getData().data.indexOf(value);
          oModel.getData().data.splice(index, 1);
      }
      oModel.refresh(true);
    },
    setMessageToast: function(msg) {
      MessageToast.show(msg);
    }
  });
});