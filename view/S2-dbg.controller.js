/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("ui.s2p.mm.purchorder.approve.util.Conversions");
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");

sap.ca.scfld.md.controller.ScfldMasterController.extend("ui.s2p.mm.purchorder.approve.view.S2", {

	onInit: function() {
		this.getView().getModel().setSizeLimit(1000000);
		this.getData();
		var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
		var oComponent = sap.ui.component(sComponentId);
		
		oComponent.oEventBus.subscribe("ui.s2p.mm.purchorder.approve", "selectNextWorkItem", this._selectNextWorkItem, this);
        var oList = this.getList();
        
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "detail") {
				var sBindingContextPath = this.getBindingContextPathFor(oEvent.getParameter("arguments"));
				var oItem = this.findItemByContextPath(sBindingContextPath);
				
				var iIndex = oList.indexOfItem(oItem);
				var iItems = oList.getItems().length;
				if (iItems > 1) {
					var iNextIndex = 0;
					if (iItems === iIndex + 1) {
						iNextIndex = iIndex - 1;
					} else {
						iNextIndex = iIndex + 1;						
					}
					var oNextItem = oList.getItems()[iNextIndex];
					var oCurrentItem = oList.getItems()[iIndex];
					this._sNextDetailPath = oNextItem && oNextItem.getBindingContext(this.sModelName).getPath();
					this._sCurrentDetailPath = oItem && oCurrentItem.getBindingContext(this.sModelName).getPath();
				}
			}
		}, this);

		/**
		 * @ControllerHook S2 (List) / onInit
		 * With this controller method the onInit method of the S2 (List) controller can be enhanced.
		 * @callback sap.ca.scfld.md.controller.ScfldMasterController~extHookOnInit
		 */
		if (this.extHookOnInit) {
			this.extHookOnInit();
		}
		
		oList.attachEvent("updateFinished", function() {
		    
		    	var oCurrentItem = this.findItemByContextPath(this._sCurrentDetailPath);
		    	var oItem = this.findItemByContextPath(this._sNextDetailPath);		    	
		    	
		    	if(!sap.ui.Device.system.phone){
		    		if (oCurrentItem) {
						this.setListItem(oCurrentItem);						
					} 
					else if (oItem){
						this.setListItem(oItem);
					}
					else {
						if (this.getList().getItems().length >= 1) {
							this.selectFirstItem();
						} else {
							this.showEmptyView("DETAIL_TITLE", "NO_ITEMS_AVAILABLE");
						}
					}
		    	}
		}, this);
	},

	/**
	 * @private [_selectNextWorkItem on after approval/reject/forward, to select next row in desktop/phone]
	 */
	_selectNextWorkItem: function(channelId, eventId, data) {
		if (eventId === "selectNextWorkItem") {			
			//perform refresh of master list and select next workitem if the current workitem doesn't exist anymore after the refresh
			//in case of using a phone - navigate to the master list and don't select any workitem
	    	if(sap.ui.Device.system.phone){
	    		//Navigation to s2 view is only necessary for mobile phones because only one view can be displayed there (s2 or s3)
	    		window.history.go(-1);
	    	}
	    	var oList = this.getList();
	    	oList.getBinding('items').refresh();	    	
	    	oList.attachEventOnce("updateFinished", function() {
		    	
		    	if(data.bMessageToast && data.bMessageToast === true && data.sMessage){
		    		sap.m.MessageToast.show(
		    				data.sMessage,
		    				{
		    					duration:3500
		    				}
		    		);		
		    	}		    	
	    	}, this);	
		}
	},

	getData: function() {
		var oList = this.getList();
		var oTemplate = oList.getItems()[0].clone();
		var oSorter = new sap.ui.model.Sorter("WiCreatedAt", true);
		var aFilters = [];

		oList.bindItems("/WorkflowTaskCollection", oTemplate, oSorter, aFilters);
	},

	getHeaderFooterOptions: function() {
		var oLocalHeaderFooterOptions = {
			sI18NMasterTitle: "MASTER_TITLE"
		};

		/**
		 * @ControllerHook  S2 (List) / HeaderFooterOptions
		 * With this controller method the getHeaderFooterOptions method of the S2 (List) controller 
		 * can be enhanced to change the HeaderFooterOptions.
		 * @callback sap.ca.scfld.md.controller.ScfldMasterController~extHookSetHeaderFooterOptions
		 * @param {object} oLocalHeaderFooterOptions
		 * @return {object} oLocalHeaderFooterOptions
		 */
		if (this.extHookSetHeaderFooterOptions) {
			oLocalHeaderFooterOptions = this.extHookSetHeaderFooterOptions(oLocalHeaderFooterOptions);
		}

		return oLocalHeaderFooterOptions;
	},

	_getODataSearchFields : function(){		
		var aODataSearchFields = ["CreatedByName","ForwardedByName","ItemDescriptions","PoNumber","PoNumberFormatted","SearchForText",
		                          "SubstitutingForName", "SupplierID", "SupplierName", "WiCreatedAt", "WorkitemID"];			
		/**
		 * @ControllerHook  S2 (List) / Search
		 * With this controller method the document search can be changed. It is possible to remove or add oData search fields.
		 * @callback sap.ca.scfld.md.controller.ScfldMasterController~extHookModifySearchableODataFieldsForMasterListSearch
		 * @param {object[]} 
		 * 			An array which contains the oData fields which will be searchable. 
		 * @return {object[]}
		 * 			An array which contains the oData fields which will be searchable.
		 */
		if (this.extHookModifySearchableODataFieldsForMasterListSearch) {
			aODataSearchFields = this.extHookModifySearchableODataFieldsForMasterListSearch(aODataSearchFields);
		}
		return aODataSearchFields;
	},
	
	_getTextsFromUIElementsForSearch : function(oItem){		
		var aUITexts = [];
		
		// default = add all UI texts to the array and add all attribute texts to the array
		if(oItem.getIntro()) aUITexts.push(oItem.getIntro());
		if(oItem.getTitle()) aUITexts.push(oItem.getTitle());
		if(oItem.getNumber()) aUITexts.push(oItem.getNumber());
		if(oItem.getNumberUnit()) aUITexts.push(oItem.getNumberUnit());
		if(oItem.getFirstStatus()) aUITexts.push(oItem.getFirstStatus().getText());
		if(oItem.getSecondStatus()) aUITexts.push(oItem.getSecondStatus().getText());
		
		var aAttributes = oItem.getAttributes();
		for ( var j = 0; j < aAttributes.length; j++) {			
			aUITexts.push(aAttributes[j].getText());
		}
		
		/**
		 * @ControllerHook  S2 (List) / Search
		 * With this controller method the document search can be changed. It is possible to define which UI texts are searchable. By default all UI texts are searchable.
		 * @callback sap.ca.scfld.md.controller.ScfldMasterController~extHookDefineSearchableUITextsForMasterListSearch
		 * @param {object} 
		 * 			An object - the List Item
		 * @return {object[]}
		 * 			An array which contains the UI texts which will be searchable.
		 */
		if (this.extHookDefineSearchableUITextsForMasterListSearch) {			
			aUITexts = this.extHookDefineSearchableUITextsForMasterListSearch(oItem);			
		}
		return aUITexts;
	},	
	
	_searchOnODataFields : function(oItem, sFilterPattern){
		var aODataSearchFields = this._getODataSearchFields();		
		
		//oData data
		var oModel = oItem.getBindingContext(this.sModelName).getProperty();
		
		
		for(var iter = 0; iter <= aODataSearchFields.length; iter++ ){			
			var sKey = aODataSearchFields[iter];			
			var sValue = "";	
			if(sKey === "WiCreatedAt"){
				//enable comparing "medium-date-format" with "days-ago-format"
				//searching for e.g. "Yesterday" will match while searching on UI elements
				var oModelDate = oModel[sKey];					
				var formatter = sap.ca.ui.model.format.DateFormat.getDateInstance({style : "medium"}, sap.ui.getCore().getConfiguration().getLocale());
				if (oModelDate !== "") {
					sValue = formatter.format(oModelDate, false);
				}
			}else {
				sValue = oModel[sKey];
			}			
			if (typeof sValue === "string") {
				if (sValue.toLowerCase().indexOf(sFilterPattern) !== -1) {
					return true;
				}
			}
		}	
	},
	
	_searchOnUITexts : function(oItem, sFilterPattern){
		var aUITexts = this._getTextsFromUIElementsForSearch(oItem);
		for(var iter =0; iter<=aUITexts.length; iter++ ){
			if(typeof aUITexts[iter] !== "undefined" && aUITexts[iter] !== ""){			
				if(aUITexts[iter].toLowerCase().indexOf(sFilterPattern) !== -1){
					return true;
				}
			}
		}
	},	
		
	//Overwrite Scfhld. function because of do not using all OData-properties
	applySearchPatternToListItem : function(oItem, sFilterPattern) {
		if (sFilterPattern === "") {return true;}	
		
		//Search on oData fields
		if (this._searchOnODataFields(oItem, sFilterPattern) === true) {return true;}
		
		// if nothing found in unformatted data, check UI elements			
		if (this._searchOnUITexts(oItem, sFilterPattern) === true) {return true;}	
		
		//if there is no match, return false
		return false;
	}	
});