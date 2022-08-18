sap.ui.define(["./BaseController"], function (BaseController) {

  return BaseController.extend("com.add.vault.controller.App", {
    onInit: function _onInit() {
      this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
    }
  });
});