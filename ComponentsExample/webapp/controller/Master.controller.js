sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device"
], function(jQuery, Controller, Device) {
    "use strict";

    return Controller.extend("sap.components.custom.controller.Master", {
        onInit : function () {
            this.getOwnerComponent().getRouter().getRoute("master").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function(oEvent) {
            /*
            * Navigate to the first item by default only on desktop and tablet (but not phone).
            * Note that item selection is not handled as it is
            * out of scope of this sample
            */
            if(!Device.system.phone) {
                this.getOwnerComponent().getRouter()
                    .navTo("detail1",  true);
            }
        },
        onSelectionChange: function(oEvent, page) {
            this.getOwnerComponent().getRouter().navTo(oEvent.getSource().getSelectedItem().getProperty('info'));
        }
    });

}, true);