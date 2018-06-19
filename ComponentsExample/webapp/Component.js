sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/UIComponent"
], function (jQuery, UIComponent) {
    "use strict";

    return UIComponent.extend("sap.components.custom.Component", {

        metadata: {
            rootView: {
                "viewName": "sap.components.custom.view.App",
                "type": "XML",
                "async": true
            },
            routing: {
                config: {
                    routerClass: "sap.m.routing.Router",
                    viewPath: "sap.components.custom.view",
                    controlId: "rootControl",
                    viewType: "XML",
                    async: true
                },
                routes: [
                    {
                        name: "master",
                        pattern: "",
                        target: ["master"]
                    },
                    {
                        name: "detail1",
                        pattern: "detail1:",
                        target: ["master", "detail1"]
                    },
                    {
                        name: "detail2",
                        pattern: "detail2",
                        target: ["master", "detail2"],
                    }
                ],
                targets: {
                    master: {
                        viewName: "Master",
                        controlAggregation: "masterPages",
                        viewLevel: 0
                    },
                    detail1: {
                        viewName: "Detail1",
                        controlAggregation: "detailPages",
                        title: {
                            parts: ["Detail1"],
                            formatter: "jQuery.sap.formatMessage"
                        },
                        viewLevel: 1
                    },
                    detail2: {
                        viewName: "Detail2",
                        controlAggregation: "detailPages",
                        title: {
                            parts: ["Detail2"],
                            formatter: "jQuery.sap.formatMessage"
                        },
                        viewLevel: 2
                    }
                }
            }
        },

        init : function () {

            UIComponent.prototype.init.apply(this, arguments);

            // Parse the current url and display the targets of the route that matches the hash
            this.getRouter().initialize();

        }

    });
});