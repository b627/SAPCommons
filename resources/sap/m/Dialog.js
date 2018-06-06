/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./Bar','./InstanceManager','./AssociativeOverflowToolbar','./ToolbarSpacer','./library','sap/ui/core/Control','sap/ui/core/IconPool','sap/ui/core/Popup','sap/ui/core/delegate/ScrollEnablement','sap/ui/core/RenderManager','sap/ui/core/InvisibleText','sap/ui/core/ResizeHandler','sap/ui/Device','sap/ui/base/ManagedObject','sap/ui/core/library','./DialogRenderer','jquery.sap.mobile'],function(q,B,I,A,T,l,C,a,P,S,R,b,c,D,M,d,f){"use strict";var O=d.OpenState;var g=l.DialogType;var V=d.ValueState;var h=C.extend("sap.m.Dialog",{metadata:{interfaces:["sap.ui.core.PopupInterface"],library:"sap.m",properties:{icon:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:null},title:{type:"string",group:"Appearance",defaultValue:null},showHeader:{type:"boolean",group:"Appearance",defaultValue:true},type:{type:"sap.m.DialogType",group:"Appearance",defaultValue:g.Standard},state:{type:"sap.ui.core.ValueState",group:"Appearance",defaultValue:V.None},stretchOnPhone:{type:"boolean",group:"Appearance",defaultValue:false,deprecated:true},stretch:{type:"boolean",group:"Appearance",defaultValue:false},contentWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},contentHeight:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},horizontalScrolling:{type:"boolean",group:"Behavior",defaultValue:true},verticalScrolling:{type:"boolean",group:"Behavior",defaultValue:true},resizable:{type:"boolean",group:"Behavior",defaultValue:false},draggable:{type:"boolean",group:"Behavior",defaultValue:false},escapeHandler:{type:"any",group:"Behavior",defaultValue:null}},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"},subHeader:{type:"sap.m.IBar",multiple:false},customHeader:{type:"sap.m.IBar",multiple:false},beginButton:{type:"sap.m.Button",multiple:false},endButton:{type:"sap.m.Button",multiple:false},buttons:{type:"sap.m.Button",multiple:true,singularName:"button"},_header:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_title:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_icon:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_toolbar:{type:"sap.m.OverflowToolbar",multiple:false,visibility:"hidden"},_valueState:{type:"sap.ui.core.InvisibleText",multiple:false,visibility:"hidden"}},associations:{leftButton:{type:"sap.m.Button",multiple:false,deprecated:true},rightButton:{type:"sap.m.Button",multiple:false,deprecated:true},initialFocus:{type:"sap.ui.core.Control",multiple:false},ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{beforeOpen:{},afterOpen:{},beforeClose:{parameters:{origin:{type:"sap.m.Button"}}},afterClose:{parameters:{origin:{type:"sap.m.Button"}}}},designtime:"sap/m/designtime/Dialog.designtime"}});h._bPaddingByDefault=(sap.ui.getCore().getConfiguration().getCompatibilityVersion("sapMDialogWithPadding").compareTo("1.16")<0);h._mIcons={};h._mIcons[V.Success]=a.getIconURI("message-success");h._mIcons[V.Warning]=a.getIconURI("message-warning");h._mIcons[V.Error]=a.getIconURI("message-error");h.prototype.init=function(){var t=this;this._externalIcon=undefined;this._oManuallySetSize=null;this._oManuallySetPosition=null;this._bRTL=sap.ui.getCore().getConfiguration().getRTL();this._scrollContentList=["NavContainer","Page","ScrollContainer","SplitContainer","MultiInput"];this.oPopup=new P();this.oPopup.setShadow(true);this.oPopup.setNavigationMode("SCOPE");if(q.device.is.iphone&&!this._bMessageType){this.oPopup.setModal(true,"sapMDialogTransparentBlk");}else{this.oPopup.setModal(true,"sapMDialogBlockLayerInit");}this.oPopup.setAnimations(q.proxy(this._openAnimation,this),q.proxy(this._closeAnimation,this));this.oPopup._applyPosition=function(p,F){var s;var e;t._setDimensions();t._adjustScrollingPane();p.at={};if(t._oManuallySetPosition){p.at.left=t._oManuallySetPosition.x;p.at.top=t._oManuallySetPosition.y;}else{if(window.scrollY===undefined){s=window.pageYOffset;}else{s=window.scrollY;}if(s<0){s=0;}p.at.top='calc(50% + '+s+'px)';if(t._bRTL){p.at.left='auto';}else{if(window.scrollX===undefined){e=window.pageXOffset;}else{e=window.scrollX;}if(e<0){e=0;}p.at.left='calc(50% + '+e+'px)';}}t._deregisterContentResizeHandler();P.prototype._applyPosition.call(this,p);t._registerContentResizeHandler();};if(h._bPaddingByDefault){this.addStyleClass("sapUiPopupWithPadding");}};h.prototype.onBeforeRendering=function(){if(this._hasSingleScrollableContent()){this.setProperty("verticalScrolling",false);this.setProperty("horizontalScrolling",false);q.sap.log.info("VerticalScrolling and horizontalScrolling in sap.m.Dialog with ID "+this.getId()+" has been disabled because there's scrollable content inside");}else if(!this._oScroller){this._oScroller=new S(this,this.getId()+"-scroll",{horizontal:this.getHorizontalScrolling(),vertical:this.getVerticalScrolling()});}this._createToolbarButtons();if(sap.ui.getCore().getConfiguration().getAccessibility()&&this.getState()!=V.None){var v=new b({text:this.getValueStateString(this.getState())});this.setAggregation("_valueState",v);this.addAriaLabelledBy(v.getId());}};h.prototype.onAfterRendering=function(){this._$scrollPane=this.$("scroll");this._$content=this.$("cont");this._$dialog=this.$();if(this.isOpen()){this._setInitialFocus();}if(this.getType()===g.Message||(D.system.phone&&!this.getStretch())){this.$("footer").removeClass("sapContrast sapContrastPlus");}};h.prototype.exit=function(){I.removeDialogInstance(this);this._deregisterContentResizeHandler();this._deregisterResizeHandler();if(this.oPopup){this.oPopup.detachOpened(this._handleOpened,this);this.oPopup.detachClosed(this._handleClosed,this);this.oPopup.destroy();this.oPopup=null;}if(this._oScroller){this._oScroller.destroy();this._oScroller=null;}if(this._header){this._header.destroy();this._header=null;}if(this._headerTitle){this._headerTitle.destroy();this._headerTitle=null;}if(this._iconImage){this._iconImage.destroy();this._iconImage=null;}if(this._toolbarSpacer){this._toolbarSpacer.destroy();this._toolbarSpacer=null;}};h.prototype.open=function(){var p=this.oPopup;p.setInitialFocusId(this.getId());var o=p.getOpenState();switch(o){case O.OPEN:case O.OPENING:return this;case O.CLOSING:this._bOpenAfterClose=true;break;default:}this._oCloseTrigger=null;this.fireBeforeOpen();p.attachOpened(this._handleOpened,this);p.setContent(this);p.open();this._registerResizeHandler();I.addDialogInstance(this);return this;};h.prototype.close=function(){this._bOpenAfterClose=false;this.$().removeClass('sapDialogDisableTransition');this._deregisterResizeHandler();var p=this.oPopup;var e=this.oPopup.getOpenState();if(!(e===O.CLOSED||e===O.CLOSING)){l.closeKeyboard();this.fireBeforeClose({origin:this._oCloseTrigger});p.attachClosed(this._handleClosed,this);this._bDisableRepositioning=false;this._oManuallySetPosition=null;this._oManuallySetSize=null;p.close();this._deregisterContentResizeHandler();}return this;};h.prototype.isOpen=function(){return this.oPopup&&this.oPopup.isOpen();};h.prototype._handleOpened=function(){this.oPopup.detachOpened(this._handleOpened,this);this._setInitialFocus();this.fireAfterOpen();};h.prototype._handleClosed=function(){if(!this.oPopup){return;}this.oPopup.detachClosed(this._handleClosed,this);if(this.getDomRef()){R.preserveContent(this.getDomRef());this.$().remove();}I.removeDialogInstance(this);this.fireAfterClose({origin:this._oCloseTrigger});if(this._bOpenAfterClose){this._bOpenAfterClose=false;this.open();}};h.prototype.onfocusin=function(e){var s=e.target;if(s.id===this.getId()+"-firstfe"){var L=this.$("footer").lastFocusableDomRef()||this.$("cont").lastFocusableDomRef()||(this.getSubHeader()&&this.getSubHeader().$().firstFocusableDomRef())||(this._getAnyHeader()&&this._getAnyHeader().$().lastFocusableDomRef());if(L){q.sap.focus(L);}}else if(s.id===this.getId()+"-lastfe"){var F=(this._getAnyHeader()&&this._getAnyHeader().$().firstFocusableDomRef())||(this.getSubHeader()&&this.getSubHeader().$().firstFocusableDomRef())||this.$("cont").firstFocusableDomRef()||this.$("footer").firstFocusableDomRef();if(F){q.sap.focus(F);}}};h.prototype._getPromiseWrapper=function(){var t=this;return{reject:function(){t.currentPromise.reject();},resolve:function(){t.currentPromise.resolve();}};};h.prototype.onsapescape=function(e){var E=this.getEscapeHandler(),p={},t=this;if(e.originalEvent&&e.originalEvent._sapui_handledByControl){return;}if(typeof E==='function'){new window.Promise(function(r,i){p.resolve=r;p.reject=i;t.currentPromise=p;E(t._getPromiseWrapper());}).then(function(r){t.close();}).catch(function(){q.sap.log.info("Disallow dialog closing");});}else{this.close();}e.stopPropagation();};h.prototype._openAnimation=function(r,i,o){r.addClass("sapMDialogOpen");r.css("display","block");setTimeout(o,300);};h.prototype._closeAnimation=function(r,i,e){r.removeClass("sapMDialogOpen");setTimeout(e,300);};h.prototype._setDimensions=function(){var $=this.$(),s=this.getStretch(),e=this.getStretchOnPhone()&&D.system.phone,m=this._bMessageType,o={};if(!s){if(!this._oManuallySetSize){o.width=this.getContentWidth()||undefined;o.height=this.getContentHeight()||undefined;}else{o.width=this._oManuallySetSize.width;o.height=this._oManuallySetSize.height;}}if(o.width=='auto'){o.width=undefined;}if(o.height=='auto'){o.height=undefined;}if((s&&!m)||(e)){this.$().addClass('sapMDialogStretched');}$.css(o);if(!s&&!this._oManuallySetSize&&!this._bDisableRepositioning){this._applyCustomTranslate();}if(window.navigator.userAgent.toLowerCase().indexOf("chrome")!==-1&&this.getStretch()){$.find('> footer').css({bottom:'0.001px'});}};h.prototype._adjustScrollingPane=function(){if(this._oScroller){this._oScroller.refresh();}};h.prototype._reposition=function(){};h.prototype._repositionAfterOpen=function(){};h.prototype._reapplyPosition=function(){this._adjustScrollingPane();};h.prototype._onResize=function(){var $=this.$(),e=this.$('cont'),i=e[0].clientWidth,k,s=this.getContentHeight(),m=this.getContentWidth(),n,o=Math.floor(window.innerWidth*0.9),p=2,r=D.browser;if(this._oManuallySetSize){e.css({width:'auto'});return;}if(!s||s=='auto'){k=e.scrollTop();e.css({height:'auto'});n=parseFloat($.height())+p;e.height(Math.round(n));e.scrollTop(k);}if((r.internet_explorer||r.edge)&&(!m||m=='auto')&&!this.getStretch()&&i<e[0].scrollWidth&&e.width()<o){var v=e.width()-i;e.css({width:Math.min(e.width()+v,o)+"px"});}if(!this.getStretch()&&!this._oManuallySetSize&&!this._bDisableRepositioning){this._applyCustomTranslate();}if(D.browser.chrome){var F=this.$("footer");F.css("height","auto");setTimeout(function(){F.css("height","");},10);}};h.prototype._applyCustomTranslate=function(){var $=this.$(),t,s,i=$.innerWidth(),e=$.innerHeight();if(D.system.desktop&&(i%2!==0||e%2!==0)){if(!this._bRTL){t='-'+Math.floor(i/2)+"px";}else{t=Math.floor(i/2)+"px";}s='-'+Math.floor(e/2)+"px";$.css('transform','translate('+t+','+s+') scale(1)');}else{$.css('transform','');}};h.prototype._createHeader=function(){if(!this._header){this._header=new B(this.getId()+"-header");this._header._setRootAccessibilityRole("heading");this.setAggregation("_header",this._header,false);}};h.prototype._hasSingleScrollableContent=function(){var e=this.getContent(),i;while(e.length===1&&e[0]instanceof sap.ui.core.mvc.View){e=e[0].getContent();}if(e.length===1){for(i=0;i<this._scrollContentList.length;i++){if(e[0]instanceof l[this._scrollContentList[i]]){return true;}}}return false;};h.prototype._initBlockLayerAnimation=function(){this.oPopup._hideBlockLayer=function(){var $=q("#sap-ui-blocklayer-popup");$.removeClass("sapMDialogTransparentBlk");P.prototype._hideBlockLayer.call(this);};};h.prototype._clearBlockLayerAnimation=function(){if(q.device.is.iphone&&!this._bMessageType){delete this.oPopup._showBlockLayer;this.oPopup._hideBlockLayer=function(){var $=q("#sap-ui-blocklayer-popup");$.removeClass("sapMDialogTransparentBlk");P.prototype._hideBlockLayer.call(this);};}};h.prototype._getFocusId=function(){return this.getInitialFocus()||this._getFirstFocusableContentSubHeader()||this._getFirstFocusableContentElementId()||this._getFirstVisibleButtonId()||this.getId();};h.prototype._getFirstVisibleButtonId=function(){var o=this.getBeginButton(),e=this.getEndButton(),k=this.getButtons(),s="";if(o&&o.getVisible()){s=o.getId();}else if(e&&e.getVisible()){s=e.getId();}else if(k&&k.length>0){for(var i=0;i<k.length;i++){if(k[i].getVisible()){s=k[i].getId();break;}}}return s;};h.prototype._getFirstFocusableContentSubHeader=function(){var $=this.$().find('.sapMDialogSubHeader');var r;var F=$.firstFocusableDomRef();if(F){r=F.id;}return r;};h.prototype._getFirstFocusableContentElementId=function(){var r="";var $=this.$("cont");var F=$.firstFocusableDomRef();if(F){r=F.id;}return r;};h.prototype._setInitialFocus=function(){var F=this._getFocusId();var o=sap.ui.getCore().byId(F);var e;if(o){if(o.getVisible&&!o.getVisible()){this.focus();return;}e=o.getFocusDomRef();}e=e||q.sap.domById(F);if(!e){this.setInitialFocus("");e=sap.ui.getCore().byId(this._getFocusId());}if(!this.getInitialFocus()){this.setAssociation('initialFocus',e?e.id:this.getId(),true);}if(D.system.desktop||(e&&!/input|textarea|select/i.test(e.tagName))){q.sap.focus(e);}else{this.focus();}};h.prototype.getScrollDelegate=function(){return this._oScroller;};h.prototype._composeAggreNameInHeader=function(p){var H;if(p==="Begin"){H="contentLeft";}else if(p==="End"){H="contentRight";}else{H="content"+p;}return H;};h.prototype._isToolbarEmpty=function(){var e=this._oToolbar.getContent().filter(function(i){return i.getMetadata().getName()!=='sap.m.ToolbarSpacer';});return e.length===0;};h.prototype._setButton=function(o,p,s){return this;};h.prototype._getButton=function(p){var s=p.toLowerCase()+"Button",e="_o"+this._firstLetterUpperCase(p)+"Button";if(D.system.phone){return this.getAggregation(s,null,true);}else{return this[e];}};h.prototype._getButtonFromHeader=function(p){if(this._header){var H=this._composeAggreNameInHeader(this._firstLetterUpperCase(p)),e=this._header.getAggregation(H);return e&&e[0];}else{return null;}};h.prototype._firstLetterUpperCase=function(v){return v.charAt(0).toUpperCase()+v.slice(1);};h.prototype._getAnyHeader=function(){var o=this.getCustomHeader();if(o){return o._setRootAccessibilityRole("heading");}else{var s=this.getShowHeader();if(!s){return null;}this._createHeader();return this._header;}};h.prototype._deregisterResizeHandler=function(){if(this._resizeListenerId){c.deregister(this._resizeListenerId);this._resizeListenerId=null;}D.resize.detachHandler(this._onResize,this);};h.prototype._registerResizeHandler=function(){var _=this.$("scroll");this._resizeListenerId=c.register(_.get(0),q.proxy(this._onResize,this));D.resize.attachHandler(this._onResize,this);this._onResize();};h.prototype._deregisterContentResizeHandler=function(){if(this._sContentResizeListenerId){c.deregister(this._sContentResizeListenerId);this._sContentResizeListenerId=null;}};h.prototype._registerContentResizeHandler=function(){if(!this._sContentResizeListenerId){this._sContentResizeListenerId=c.register(this.getDomRef("scrollCont"),q.proxy(this._onResize,this));}this._onResize();};h.prototype._attachHandler=function(o){var t=this;if(!this._oButtonDelegate){this._oButtonDelegate={ontap:function(){t._oCloseTrigger=this;}};}if(o){o.addDelegate(this._oButtonDelegate,true,o);}};h.prototype._createToolbarButtons=function(){var t=this._getToolbar();var e=this.getButtons();var i=this.getBeginButton();var k=this.getEndButton(),m=this,n=[i,k];n.forEach(function(o){if(o&&m._oButtonDelegate){o.removeDelegate(m._oButtonDelegate);}});t.removeAllContent();if(!("_toolbarSpacer"in this)){this._toolbarSpacer=new T();}t.addContent(this._toolbarSpacer);n.forEach(function(o){m._attachHandler(o);});if(e&&e.length){e.forEach(function(o){t.addContent(o);});}else{if(i){t.addContent(i);}if(k){t.addContent(k);}}};h.prototype._getToolbar=function(){if(!this._oToolbar){this._oToolbar=new A(this.getId()+"-footer").addStyleClass("sapMTBNoBorders");this._oToolbar._isControlsInfoCached=function(){return false;};this.setAggregation("_toolbar",this._oToolbar);}return this._oToolbar;};h.prototype.getValueStateString=function(v){var r=sap.ui.getCore().getLibraryResourceBundle("sap.m");switch(v){case(V.Success):return r.getText("LIST_ITEM_STATE_SUCCESS");case(V.Warning):return r.getText("LIST_ITEM_STATE_WARNING");case(V.Error):return r.getText("LIST_ITEM_STATE_ERROR");default:return"";}};h.prototype.setSubHeader=function(o){this.setAggregation("subHeader",o);if(o){o.setVisible=function(i){this.$().toggleClass('sapMDialogWithSubHeader',i);o.setProperty("visible",i);}.bind(this);}return this;};h.prototype.setLeftButton=function(v){if(!(v instanceof sap.m.Button)){v=sap.ui.getCore().byId(v);}this.setBeginButton(v);return this.setAssociation("leftButton",v);};h.prototype.setRightButton=function(v){if(!(v instanceof sap.m.Button)){v=sap.ui.getCore().byId(v);}this.setEndButton(v);return this.setAssociation("rightButton",v);};h.prototype.getLeftButton=function(){var o=this.getBeginButton();return o?o.getId():null;};h.prototype.getRightButton=function(){var e=this.getEndButton();return e?e.getId():null;};h.prototype.getAggregation=function(s,o,p){var e=C.prototype.getAggregation.apply(this,Array.prototype.slice.call(arguments,0,2));if(s==='buttons'&&e.length===0){this.getBeginButton()&&e.push(this.getBeginButton());this.getEndButton()&&e.push(this.getEndButton());}return e;};h.prototype.getAriaLabelledBy=function(){var e=this._getAnyHeader(),i=this.getAssociation("ariaLabelledBy",[]).slice();var s=this.getSubHeader();if(s){i.unshift(s.getId());}if(e){i.unshift(e.getId());}return i;};h.prototype.setTitle=function(t){this.setProperty("title",t,true);if(this._headerTitle){this._headerTitle.setText(t);}else{this._headerTitle=new sap.m.Title(this.getId()+"-title",{text:t,level:"H1"}).addStyleClass("sapMDialogTitle");this._createHeader();this._header.addContentMiddle(this._headerTitle);}return this;};h.prototype.setState=function(s){var F={},$=this.$(),n;F[s]=true;this.setProperty("state",s,true);for(n in f._mStateClasses){$.toggleClass(f._mStateClasses[n],!!F[n]);}this.setIcon(h._mIcons[s],true);return this;};h.prototype.setIcon=function(i,e){if(!e){this._externalIcon=i;}else{if(this._externalIcon){i=this._externalIcon;}}if(i){if(i!==this.getIcon()){if(this._iconImage){this._iconImage.setSrc(i);}else{this._iconImage=a.createControlByURI({id:this.getId()+"-icon",src:i,useIconTooltip:false},sap.m.Image).addStyleClass("sapMDialogIcon");this._createHeader();this._header.insertAggregation("contentMiddle",this._iconImage,0);}}}else{var s=this.getState();if(!e&&s!==V.None){if(this._iconImage){this._iconImage.setSrc(h._mIcons[s]);}}else{if(this._iconImage){this._iconImage.destroy();this._iconImage=null;}}}this.setProperty("icon",i,true);return this;};h.prototype.setType=function(t){var o=this.getType();if(o===t){return this;}this._bMessageType=(t===g.Message);return this.setProperty("type",t,false);};h.prototype.setStretch=function(s){this._bStretchSet=true;return this.setProperty("stretch",s);};h.prototype.setStretchOnPhone=function(s){if(this._bStretchSet){q.sap.log.warning("sap.m.Dialog: stretchOnPhone property is deprecated. Setting stretchOnPhone property is ignored when there's already stretch property set.");return this;}this.setProperty("stretchOnPhone",s);return this.setProperty("stretch",s&&D.system.phone);};h.prototype.setVerticalScrolling=function(v){var o=this.getVerticalScrolling(),H=this._hasSingleScrollableContent();if(H){q.sap.log.warning("sap.m.Dialog: property verticalScrolling automatically reset to false. See documentation.");v=false;}if(o===v){return this;}this.$().toggleClass("sapMDialogVerScrollDisabled",!v);this.setProperty("verticalScrolling",v);if(this._oScroller){this._oScroller.setVertical(v);}return this;};h.prototype.setHorizontalScrolling=function(v){var o=this.getHorizontalScrolling(),H=this._hasSingleScrollableContent();if(H){q.sap.log.warning("sap.m.Dialog: property horizontalScrolling automatically reset to false. See documentation.");v=false;}if(o===v){return this;}this.$().toggleClass("sapMDialogHorScrollDisabled",!v);this.setProperty("horizontalScrolling",v);if(this._oScroller){this._oScroller.setHorizontal(v);}return this;};h.prototype.setInitialFocus=function(i){return this.setAssociation("initialFocus",i,true);};h.prototype.forceInvalidate=C.prototype.invalidate;h.prototype.invalidate=function(o){if(this.isOpen()){this.forceInvalidate(o);}};function j(e){var $=q(e);var o=$.control(0);if(!o||o.getMetadata().getInterfaces().indexOf("sap.m.IBar")>-1){return true;}return $.hasClass('sapMDialogTitle');}if(D.system.desktop){h.prototype.ondblclick=function(e){if(j(e.target)){this._bDisableRepositioning=false;this._oManuallySetPosition=null;this._oManuallySetSize=null;this.oPopup&&this.oPopup._applyPosition(this.oPopup._oLastPosition,true);this._$dialog.removeClass('sapMDialogTouched');}};h.prototype.onmousedown=function(e){if(e.which===3){return;}if(this.getStretch()||(!this.getDraggable()&&!this.getResizable())){return;}var t;var i=this;var $=q(document);var k=q(e.target);var r=k.hasClass('sapMDialogResizeHandler')&&this.getResizable();var m=function(z){t=t?clearTimeout(t):setTimeout(function(){z();},0);};var w=window.innerWidth;var n=window.innerHeight;var o={x:e.pageX,y:e.pageY,width:i._$dialog.width(),height:i._$dialog.height(),outerHeight:i._$dialog.outerHeight(),offset:{x:e.offsetX?e.offsetX:e.originalEvent.layerX,y:e.offsetY?e.offsetY:e.originalEvent.layerY},position:{x:i._$dialog.offset().left,y:i._$dialog.offset().top}};function p(){var z=i.$(),E=i.$('cont'),F,G;$.off("mouseup mousemove");if(r){i._$dialog.removeClass('sapMDialogResizing');F=parseInt(z[0].style.height,10)||parseInt(z.height(),10);G=parseInt(z.css("border-top-width"),10)+parseInt(z.css("border-bottom-width"),10);E.height(F+G);}}if((j(e.target)&&this.getDraggable())||r){i._bDisableRepositioning=true;i._$dialog.addClass('sapDialogDisableTransition');i._$dialog.addClass('sapMDialogTouched');i._oManuallySetPosition={x:o.position.x,y:o.position.y};i._$dialog.css({left:Math.min(Math.max(0,i._oManuallySetPosition.x),w-o.width),top:Math.min(Math.max(0,i._oManuallySetPosition.y),n-o.height),width:o.width,height:o.height,transform:""});}if(j(e.target)&&this.getDraggable()){$.on("mousemove",function(z){if(z.buttons===0){p();return;}m(function(){i._bDisableRepositioning=true;i._oManuallySetPosition={x:z.pageX-e.pageX+o.position.x,y:z.pageY-e.pageY+o.position.y};i._$dialog.css({left:Math.min(Math.max(0,i._oManuallySetPosition.x),w-o.width),top:Math.min(Math.max(0,i._oManuallySetPosition.y),n-o.outerHeight),transform:""});});});}else if(r){i._$dialog.addClass('sapMDialogResizing');var s={};var u=parseInt(i._$dialog.css('min-width'),10);var v=o.x+o.width-u;var x=k.width()-e.offsetX;var y=k.height()-e.offsetY;$.on("mousemove",function(z){m(function(){i._bDisableRepositioning=true;i.$('cont').height('').width('');if(z.pageY+y>n){z.pageY=n-y;}if(z.pageX+x>w){z.pageX=w-x;}i._oManuallySetSize={width:o.width+z.pageX-o.x,height:o.height+z.pageY-o.y};if(i._bRTL){s.left=Math.min(Math.max(z.pageX,0),v);s.transform="";i._oManuallySetSize.width=o.width+o.x-Math.max(z.pageX,0);}s.width=i._oManuallySetSize.width;s.height=i._oManuallySetSize.height;i._$dialog.css(s);});});}else{return;}$.on("mouseup",p);e.preventDefault();e.stopPropagation();};}h.prototype._applyContextualSettings=function(){M.prototype._applyContextualSettings.call(this,M._defaultContextualSettings);};return h;});
