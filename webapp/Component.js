sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/Device",
  "./model/models"
], function (UIComponent, { support }, models) {
  return UIComponent.extend("com.add.vault.Component", {
    metadata: {
      manifest: "json"
    },
    init: function () {
      UIComponent.prototype.init.call(this);
      this.setModel(models.createDeviceModel(), "device"); // create the views based on the url/hash

      this.getRouter().initialize();
    },
    getContentDensityClass: function () {
      if (this.contentDensityClass === undefined) {
        if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
          this.contentDensityClass = "";
        } else if (!support.touch) {
          this.contentDensityClass = "sapUiSizeCompact";
        } else {
          this.contentDensityClass = "sapUiSizeCozy";
        }
      }
      return this.contentDensityClass;
    }
  });
});