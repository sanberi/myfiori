/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");sap.ca.scfld.md.controller.BaseDetailController.extend("ui.s2p.mm.purchorder.approve.view.ItemServiceLine",{sOrigin:"",sWorkitemID:"",sPoNumber:"",sItemNumber:"",sSrvLine:"",onInit:function(){this.getView().getModel().setSizeLimit(1000000);this.oView=this.getView();if(!this.oApplication){this.oApplication=sap.ca.scfld.md.app.Application.getImpl();this.oConfiguration=this.oApplication.oConfiguration;this.oConnectionManager=this.oApplication.getConnectionManager();this.resourceBundle=this.oApplication.getResourceBundle();this.oDataModel=this.oApplicationFacade.getODataModel()}this.oRouter.attachRouteMatched(function(e){if(e.getParameter("name")==="itemServiceLine"){this.sOrigin=e.getParameter("arguments").SAP__Origin;this.sWorkitemID=e.getParameter("arguments").WorkitemID;this.sPoNumber=e.getParameter("arguments").PoNumber;this.sItemNumber=e.getParameter("arguments").ItemNumber;this.sSrvLine=e.getParameter("arguments").ServiceLineNumber;var i="/ServiceLineCollection("+"SAP__Origin='"+this.sOrigin+"',PoNumber='"+this.sPoNumber+"',ItemNumber='"+this.sItemNumber+"',ServiceLineNumber='"+e.getParameter("arguments").ServiceLineNumber+"')";this.getView().setBindingContext(new sap.ui.model.Context(this.getView().getModel(),i));this.setLocalHeaderFooterOptions()}},this);if(this.extHookOnInit){this.extHookOnInit()}},setLocalHeaderFooterOptions:function(){var t=this;var i=this._itemDetailCollection(this.sOrigin,this.sItemNumber,this.sPoNumber);var s=this._serviceLineCollection(this.sOrigin,this.sPoNumber,this.sItemNumber,this.sSrvLine);var S=this.oDataModel.getProperty("/"+i+'/ServiceLines');if(typeof S==="undefined"){this.navBack();return}var l=S.length;var c=S.indexOf(s);var v=this.oRouter.getView("ui.s2p.mm.purchorder.approve.view.S4");var C=v.getController();var L={onBack:function(){t.navBack()},oUpDownOptions:{iPosition:c,iCount:l,fSetPosition:function(n){if((n>=0)&&(n<l)){var p=S[n];var a=t.oDataModel.getProperty('/'+p).ServiceLineNumber;t.oRouter.navTo("itemServiceLine",{SAP__Origin:t.sOrigin,WorkitemID:t.sWorkitemID,PoNumber:t.sPoNumber,ItemNumber:t.sItemNumber,ServiceLineNumber:a},true)}},sI18NDetailTitle:"view.ItemServiceLine.title",oParent:C}};if(this.extHookSetHeaderFooterOptions){L=this.extHookSetHeaderFooterOptions(L)}this.setHeaderFooterOptions(L)},_refresh:function(c,e,d){},navBack:function(){if(this.sOrigin!==""&&this.sWorkitemID!==""){this.oRouter.navTo("itemDetails",{SAP__Origin:this.sOrigin,WorkitemID:this.sWorkitemID,PoNumber:this.sPoNumber,ItemNumber:this.sItemNumber},true)}},_headerDetailCollection:function(o,p){var r="HeaderDetailCollection(SAP__Origin='"+o+"',PoNumber='"+p+"')";return r},_itemDetailCollection:function(o,i,p){var r="ItemDetailCollection(SAP__Origin='"+o+"',ItemNumber='"+i+"',PoNumber='"+p+"')";return r},_serviceLineCollection:function(o,p,i,s){var r="ServiceLineCollection(SAP__Origin='"+o+"',PoNumber='"+p+"',ItemNumber='"+i+"',ServiceLineNumber='"+s+"')";return r}});