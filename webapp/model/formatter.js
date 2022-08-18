sap.ui.define([], function () {
  return {
    formatValue: value => {
      if (!value) {
        return "";
      }

      try {
        return parseFloat(value).toFixed(2);
      } catch (error) {
        return value;
      }
    }
  };
});