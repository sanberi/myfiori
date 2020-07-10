/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("ui.s2p.mm.purchorder.approve.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

sap.ca.scfld.md.ConfigurationBase.extend("ui.s2p.mm.purchorder.approve.Configuration", {

	oServiceParams: {
        serviceList: [
            {
                name: "GBAPP_POAPPROVAL",
                masterCollection: "WorkflowTaskCollection",
                serviceUrl: "/sap/opu/odata/SAP/GBAPP_POAPPROVAL;mo/",
                isDefault: true,
                mockedDataSource: "/ui.s2p.mm.purchorder.approve/model/metadata.xml"
            }
        ]
    },
    
    getServiceParams: function() {
        return this.oServiceParams;
    },

    /**
     * @inherit
     */
    getServiceList: function() {
        return this.oServiceParams.serviceList;
    },

    getMasterKeyAttributes: function() {
        return ["WorkitemID"];
    }

});
