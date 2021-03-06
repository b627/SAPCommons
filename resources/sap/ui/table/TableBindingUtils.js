/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";return{TableUtils:null,metadataLoaded:function(t){var b=t.getBinding("rows");var m=b!=null?b.getModel():null;var r=null;var R=null;var p=new Promise(function(a,c){r=a;R=c;});if(m==null){R();return p;}if(m.metadataLoaded!=null){m.metadataLoaded().then(function(){r();});}else if(m.attachMetadataLoaded!=null){if(m.oMetadata!=null&&m.oMetadata.isLoaded()){r();}else{m.attachMetadataLoaded(function(){r();});}}return p;}};},true);
