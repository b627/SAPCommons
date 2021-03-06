/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/fl/changeHandler/BaseTreeModifier",
	"sap/ui/fl/Utils"
], function (
	BaseTreeModifier,
	Utils
) {

	"use strict";

	var JsControlTreeModifier = {

		targets: "jsControlTree",

		setVisible: function (oControl, bVisible) {
			if (oControl.setVisible) {
				this.unbindProperty(oControl, "visible");
				oControl.setVisible(bVisible);
			} else {
				throw new Error("Provided control instance has no setVisible method");
			}
		},

		getVisible: function (oControl) {
			if (oControl.getVisible) {
				return oControl.getVisible();
			} else {
				throw new Error("Provided control instance has no getVisible method");
			}
		},

		setStashed: function (oControl, bStashed) {
			if (oControl.setStashed) {
				if (oControl.setVisible) {
					oControl.setVisible(!bStashed);
				}
				oControl.setStashed(bStashed);
			} else {
				throw new Error("Provided control instance has no setStashed method");
			}
		},

		getStashed: function (oControl) {
			if (oControl.getStashed) {
				return oControl.getStashed();
			} else {
				throw new Error("Provided control instance has no getStashed method");
			}
		},

		bindProperty: function (oControl, sPropertyName, vBindingInfos) {
			oControl.bindProperty(sPropertyName, vBindingInfos);
		},

		/**
		 * Unbind a property
		 * The value should not be reset to default when unbinding (bSuppressReset = true)
		 * @param  {sap.ui.core.Control} oControl  The control containing the property
		 * @param  {string} sPropertyName  The property to be unbound
		 */
		unbindProperty: function (oControl, sPropertyName) {
			if (oControl) {
				oControl.unbindProperty(sPropertyName, /*bSuppressReset = */true);
			}
		},

		setProperty: function (oControl, sPropertyName, oPropertyValue) {
			var oMetadata = oControl.getMetadata().getPropertyLikeSetting(sPropertyName);
			this.unbindProperty(oControl, sPropertyName);

			if (oMetadata) {
				var sPropertySetter = oMetadata._sMutator;
				oControl[sPropertySetter](oPropertyValue);
			}
		},

		getProperty: function (oControl, sPropertyName) {
			var oMetadata = oControl.getMetadata().getPropertyLikeSetting(sPropertyName);
			if (oMetadata) {
				var sPropertyGetter = oMetadata._sGetter;
				return oControl[sPropertyGetter]();
			}
		},

		setPropertyBinding: function (oControl, sPropertyName, oPropertyBinding) {
			this.unbindProperty(oControl, sPropertyName);
			var mSettings = {};
			mSettings[sPropertyName] = oPropertyBinding;
			oControl.applySettings(mSettings);
		},

		getPropertyBinding: function (oControl, sPropertyName) {
			return oControl.getBindingInfo(sPropertyName);

		},

		createControl: function (sClassName, oAppComponent, oView, oSelector, mSettings) {
			if (this.bySelector(oSelector, oAppComponent)) {
				throw new Error("Can't create a control with duplicated id " + oSelector);
			}

			jQuery.sap.require(sClassName); //ensure class is there
			var ClassObject = jQuery.sap.getObject(sClassName);
			var sId = this.getControlIdBySelector(oSelector, oAppComponent);
			return new ClassObject(sId, mSettings);
		},

		/** SUBSTITUTION UNTIL SmartForm has adopted to the bySelector
		 *
		 * @param {sap.ui.core.ID} sId
		 * @returns {*|Node}
		 */
		byId: function (sId) {
			return this._byId(sId);
		},

		/**
		 * Returns the control for the given id. Undefined if control cannot be found.
		 *
		 * @param {sap.ui.core.ID} sId Control id
		 * @returns {sap.ui.core.Element} Control
		 * @private
		 */
		_byId: function (sId) {
			return sap.ui.getCore().byId(sId);
		},

		getId: function (oControl) {
			return oControl.getId();
		},

		getParent: function (oControl) {
			return oControl.getParent();
		},

		getControlType: function (oControl) {
			return Utils.getControlType(oControl);
		},

		getAllAggregations: function (oParent) {
			return oParent.getMetadata().getAllAggregations();
		},

		/**
		 * Returns the aggregation
		 *
		 * @param {sap.ui.core.Control}
		 *          oParent The control which has the aggregation
		 * @param {string}
		 *          sName Aggregation name
		 *
		 * @return {sap.ui.core.Control[]} Returns the aggregation
		 */
		getAggregation: function (oParent, sName) {
			var oAggregation = this.findAggregation(oParent, sName);
			if (oAggregation) {
				return oParent[oAggregation._sGetter]();
			}
		},

		/**
		 * Adds an additional item of the aggregation or changes it in case it is not a multiple one
		 *
		 * @param {sap.ui.core.Control}
		 *          oParent - the control for which the changes should be fetched
		 * @param {string}
		 *          sName - aggregation name
		 * @param {object}
		 *          oObject - aggregated object to be set
		 * @param {int}
		 *          iIndex <optional> - index to which it should be added/inserted
		 */
		insertAggregation: function (oParent, sName, oObject, iIndex) {
			var oAggregation = this.findAggregation(oParent, sName);
			if (oAggregation) {
				if (oAggregation.multiple) {
					var iInsertIndex = iIndex || 0;
					oParent[oAggregation._sInsertMutator](oObject, iInsertIndex);
				} else {
					oParent[oAggregation._sMutator](oObject);
				}
			}
		},

		/**
		 * Removes the object from the aggregation of the given control
		 *
		 * @param {sap.ui.core.Control}
		 *          oControl - the parent control for which the changes should be fetched
		 * @param {string}
		 *          sName - aggregation name
		 * @param {object}
		 *          oObject - aggregated object to be set
		 */
		removeAggregation: function (oControl, sName, oObject) {
			var oAggregation = this.findAggregation(oControl, sName);
			if (oAggregation) {
				oControl[oAggregation._sRemoveMutator](oObject);
			}
		},

		removeAllAggregation: function (oControl, sName) {
			var oAggregation = this.findAggregation(oControl, sName);
			if (oAggregation) {
				oControl[oAggregation._sRemoveAllMutator]();
			}
		},

		getBindingTemplate: function (oControl, sAggregationName) {
			var oBinding = oControl.getBindingInfo(sAggregationName);
			return oBinding && oBinding.template;
		},

		updateAggregation: function (oControl, sAggregationName) {
			var oAggregation = this.findAggregation(oControl, sAggregationName);
			if (oAggregation) {
				oControl[oAggregation._sDestructor]();
				oControl.updateAggregation(sAggregationName);
			}
		},

		findIndexInParentAggregation: function(oControl) {
			var oParent = this.getParent(oControl),
				aControlsInAggregation;

			if (!oParent) {
				return -1;
			}

			// we need all controls in the aggregation
			aControlsInAggregation = this.getAggregation(oParent, this.getParentAggregationName(oControl));

			// if aControls is an array:
			if (Array.isArray(aControlsInAggregation)) {
				// then the aggregtion is multiple and we can find the index of
				// oControl in the array
				return aControlsInAggregation.indexOf(oControl);
			} else {
				// if aControlsInAggregation is not an array, then the aggregation is
				// of type 0..1 and aControlsInAggregation is the oControl provided
				// to the function initially, so its index is 0
				return 0;
			}
		},

		getParentAggregationName: function (oControl) {
			return oControl.sParentAggregationName;
		},

		/**
		 * checks the metadata of the given control and returns the aggregation matching the name
		 *
		 * @param {sap.ui.core.Control} oControl control whose aggregation is to be found
		 * @param {string} sAggregationName name of the aggregation
		 * @returns {object} Returns the instance of the aggregation or undefined
		 */
		findAggregation: function(oControl, sAggregationName) {
			if (oControl) {
				if (oControl.getMetadata) {
					var oMetadata = oControl.getMetadata();
					var oAggregations = oMetadata.getAllAggregations();
					if (oAggregations) {
						return oAggregations[sAggregationName];
					}
				}
			}
		},

		/**
		 * Validates if the control has the correct type for the aggregation.
		 *
		 * @param {sap.ui.core.Control} oControl control whose type is to be checked
		 * @param {object} oAggregationMetadata metadata of the aggregation
		 * @param {sap.ui.core.Control} oParent parent of the control
		 * @param {string} sFragment path to the fragment that contains the control, whose type is to be checked
		 * @returns {boolean} Returns true if the type matches
		 */
		validateType: function(oControl, oAggregationMetadata, oParent, sFragment) {
			var sTypeOrInterface = oAggregationMetadata.type;

			// if aggregation is not multiple and already has element inside, then it is not valid for element
			if (oAggregationMetadata.multiple === false && this.getAggregation(oParent, oAggregationMetadata.name) &&
					this.getAggregation(oParent, oAggregationMetadata.name).length > 0) {
				return false;
			}
			return Utils.isInstanceOf(oControl, sTypeOrInterface) || Utils.hasInterface(oControl, sTypeOrInterface);
		},

		/**
		 * Instantiates a fragment and turns the result into an array of controls
		 *
		 * @param {string} sFragment path to the fragment
		 * @param {string} sChangeId id of the current change
		 * @param {sap.ui.core.mvc.View} oView view for the fragment
		 * @param {sap.ui.core.mvc.Controller} oController controller for the fragment
		 * @returns {array} Returns an array with the controls of the fragment
		 */
		instantiateFragment: function(sFragment, sChangeId, oView, oController) {
			var aNewControls;
			if (oView) {
				aNewControls = sap.ui.xmlfragment({
					fragmentContent: sFragment,
					sId: oView.getId() + "--" + sChangeId
				}, oController);
			} else {
				aNewControls = sap.ui.xmlfragment({
					fragmentContent: sFragment,
					sId: sChangeId
				});
			}

			if (!Array.isArray(aNewControls)) {
				aNewControls = [aNewControls];
			}
			return aNewControls;
		},

		getChangeHandlerModulePath: function(oControl) {
			if (typeof oControl === "object" && typeof oControl.data === "function"
					&& oControl.data("sap-ui-custom-settings") && oControl.data("sap-ui-custom-settings")["sap.ui.fl"]){
				return oControl.data("sap-ui-custom-settings")["sap.ui.fl"].flexibility;
			} else {
				return undefined;
			}
		}
	};

	return jQuery.sap.extend(
		true /* deep extend */,
		{} /* target object, to avoid changing of original modifier */,
		BaseTreeModifier,
		JsControlTreeModifier
	);
},
/* bExport= */true);
