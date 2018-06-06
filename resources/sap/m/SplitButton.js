/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./library','sap/ui/core/Control','./Button','./ButtonRenderer','sap/ui/core/EnabledPropagator','sap/ui/core/IconPool','sap/ui/core/library','sap/ui/Device','sap/ui/core/InvisibleText','./SplitButtonRenderer'],function(l,C,B,a,E,I,c,D,b,S){"use strict";var T=c.TextDirection;var d=l.ButtonType;var e=C.extend("sap.m.SplitButton",{metadata:{library:"sap.m",properties:{text:{type:"string",group:"Misc",defaultValue:null},type:{type:"sap.m.ButtonType",group:"Appearance",defaultValue:d.Default},width:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null},enabled:{type:"boolean",group:"Behavior",defaultValue:true},icon:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:null},activeIcon:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},iconDensityAware:{type:"boolean",group:"Misc",defaultValue:true},textDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:T.Inherit}},aggregations:{_textButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"},_arrowButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{press:{},arrowPress:{}}}});E.call(e.prototype);e.prototype.exit=function(){if(this._oInvisibleTooltipInfoLabel){this._oInvisibleTooltipInfoLabel.destroy();this._oInvisibleTooltipInfoLabel=null;}};e.prototype.onAfterRendering=function(){var $=this._getTextButton().$(),f=this._getArrowButton().$();$.attr("tabindex","-1");f.attr("tabindex","-1");$.removeAttr("title");f.removeAttr("title");$.removeAttr("aria-describedby");f.removeAttr("aria-describedby");};e.prototype._handleAction=function(i){if(i){this.fireArrowPress();}else{this.firePress();}};e.prototype.setArrowState=function(i){var A=this.getAggregation("_arrowButton");if(!A){return;}if(i){A.$().addClass('sapMSBActive');}else{A.$().removeClass('sapMSBActive');}};e.prototype._getTextButton=function(){var o=this.getAggregation("_textButton");if(!o){o=new B({width:'100%',icon:this.getIcon(),text:this.getText(),press:this._handleAction.bind(this,false)}).addStyleClass('sapMSBText');if(D.browser.msie){o.addStyleClass('sapMSBTextIE');}this.setAggregation("_textButton",o);}return o;};e.prototype._getArrowButton=function(){var o=this.getAggregation("_arrowButton");if(!o){o=new B({icon:"sap-icon://slim-arrow-down",press:this._handleAction.bind(this,true)}).addStyleClass("sapMSBArrow");this.setAggregation("_arrowButton",o);}return o;};e.prototype.setTooltip=function(t){var s;C.prototype.setTooltip.apply(this,arguments);s=this.getTooltip_AsString();this.getTooltipInfoLabel(s);return this;};e.prototype.setProperty=function(p,v,s){if(p==="type"&&(v===d.Up||v===d.Back||v===d.Unstyled)){return this;}var r=C.prototype.setProperty.apply(this,arguments);if(p==="activeIcon"||p==="iconDensityAware"||p==="textDirection"){B.prototype.setProperty.apply(this._getTextButton(),arguments);}else if(p==="text"||p==="type"||p==="icon"){var f="set"+_(p);B.prototype[f].call(this._getTextButton(),v);if(p==="type"){B.prototype[f].call(this._getArrowButton(),v);}}return r;};function _(t){return t.charAt(0).toUpperCase()+t.slice(1);}e.prototype.onsapenter=function(o){this._getTextButton().firePress();};e.prototype.onsapspace=function(o){this._getTextButton().firePress();};e.prototype.onsapup=function(o){this._getArrowButton().firePress();};e.prototype.onsapdown=function(o){this._getArrowButton().firePress();};e.prototype.onsapupmodifiers=function(o){this._getArrowButton().firePress();};e.prototype.onsapdownmodifiers=function(o){this._getArrowButton().firePress();};e.prototype.onsapshow=function(o){this._getArrowButton().firePress();o.preventDefault();};e.prototype.getButtonTypeAriaLabelId=function(){var s=this._getTextButton().getType();return a.getButtonTypeAriaLabelId(s);};e.prototype.getTooltipInfoLabel=function(t){if(!this._oInvisibleTooltipInfoLabel){this._oInvisibleTooltipInfoLabel=new b();this._oInvisibleTooltipInfoLabel.toStatic();}this._oInvisibleTooltipInfoLabel.setText(t);return this._oInvisibleTooltipInfoLabel;};e.prototype.getTitleAttributeValue=function(){var t=this.getTooltip_AsString(),i=I.getIconInfo(this.getIcon()),r;if(t||(i&&i.text&&!this.getText())){r=t||i.text;}return r;};return e;});
