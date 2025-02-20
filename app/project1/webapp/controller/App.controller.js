sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/m/MessageToast"
], function (Controller, ODataModel, MessageToast) {
    "use strict";

    return Controller.extend("project1.controller.App", {
        
        onInit: function () {
            var oModel = new ODataModel({
                serviceUrl: "https://port4004-workspaces-ws-x5xhk.us10.trial.applicationstudio.cloud.sap/odata/v4/catalog/",
                synchronizationMode: "None"
            });

            this.getView().setModel(oModel, "Books");
            this._oTable = this.byId("table3"); 
        },

        onOpenAddDialog: function () {
            var oView = this.getView();
        
            // **Clear previous values before opening the form**
            oView.byId("idBookId").setValue("");
            oView.byId("idBookTitle").setValue("");
            oView.byId("idBookAuthor").setValue("");
            oView.byId("idBookPrice").setValue("");
            oView.byId("idBookStock").setValue("");
        
            oView.byId("OpenDialog").open();
        },

        onCancelDialog: function (oEvent) {
            oEvent.getSource().getParent().close();
        },
        onConfirmDialog: function () {
            var oButton = this.getView().byId("confirmCreate");
        
            if (oButton.getText() === "Add") {
                this.onCreate();
            } else {
                this.onUpdate();
            }
        },        
        onCreate: function () {
            var oView = this.getView();
            var oModel = oView.getModel("Books");
        
            // **Retrieve book ID and validate**
            var bookId = oView.byId("idBookId").getValue();
            if (!bookId) {
                MessageToast.show("Book ID cannot be blank");
                return;
            }
        
            var oNewBook = {
                "ID": parseInt(bookId, 10),
                "title": oView.byId("idBookTitle").getValue().trim(),
                "author": oView.byId("idBookAuthor").getValue().trim(),
                "price": parseFloat(oView.byId("idBookPrice").getValue()), 
                "stock": parseInt(oView.byId("idBookStock").getValue(), 10) 
            };

            console.log("New Book Data:", JSON.stringify(oNewBook));

    
            var oListBinding = this._oTable.getBinding("items");

            if (!oListBinding) {
                MessageToast.show("Error: Table binding is missing!");
                console.error("Table binding not found.");
                return;
            }

      
            var oContext = oListBinding.create(oNewBook);
            console.log("Created Context:", oContext);

            if (!oContext) {
                MessageToast.show("Error creating book. Please check the data.");
                return;
            }

            oView.byId("OpenDialog").close();

           
            oContext.created()
                .then(() => {
                    MessageToast.show("Book added successfully");
                    oModel.refresh(); 
                })
                .catch((error) => {
                    if (error && error.message) { 
                        MessageToast.show("Error adding book: " + error.message);
                        console.error("Create failed:", error);
                    }
                });
        },        
        onDelete: function(){
            var oSelected = this.byId("table3").getSelectedItem();
            if(oSelected){
                var Selected = oSelected.getBindingContext("Books").getObject().soNumber;
            
                oSelected.getBindingContext("Books").delete("$auto").then(function () {
                MessageToast.show("SuccessFully Deleted");
                }.bind(this), function (oError) {
                    MessageToast.show("Deletion Error: ",oError);
                });
            } else {
                MessageToast.show("Please Select a Row to Delete");
            }
            
        },
        onEdit: function () {
            var oTable = this.getView().byId("table3");
            var oSelectedItem = oTable.getSelectedItem();
        
            if (!oSelectedItem) {
                sap.m.MessageToast.show("Please select a book to edit.");
                return;
            }
        
            var oContext = oSelectedItem.getBindingContext("Books");
            var oBook = oContext.getObject();
        
            var oDialog = this.getView().byId("OpenDialog");
            this.getView().byId("idBookId").setValue(oBook.ID);
            this.getView().byId("idBookTitle").setValue(oBook.title);
            this.getView().byId("idBookAuthor").setValue(oBook.author);
            this.getView().byId("idBookPrice").setValue(oBook.price);
            this.getView().byId("idBookStock").setValue(oBook.stock);
        
            this.getView().byId("confirmCreate").setText("Update");
        
            // Store the selected context for update
            this._oEditContext = oContext;
        
            oDialog.open();
        },
        onUpdate: function () {
            var oView = this.getView();
            var oModel = oView.getModel("Books");
        
            if (!this._oEditContext) {
                sap.m.MessageToast.show("No book selected for update.");
                return;
            }
        
            var oUpdatedBook = {
                "title": oView.byId("idBookTitle").getValue().trim(),
                "author": oView.byId("idBookAuthor").getValue().trim(),
                "price": parseFloat(oView.byId("idBookPrice").getValue()), 
                "stock": parseInt(oView.byId("idBookStock").getValue(), 10)
            };
        
            console.log("Updated Book Data:", JSON.stringify(oUpdatedBook));
        
            // Update properties in the existing context
            this._oEditContext.setProperty("title", oUpdatedBook.title);
            this._oEditContext.setProperty("author", oUpdatedBook.author);
            this._oEditContext.setProperty("price", oUpdatedBook.price);
            this._oEditContext.setProperty("stock", oUpdatedBook.stock);
        
            // Submit changes to backend
            oModel.submitBatch("Books")
                .then(() => {
                    sap.m.MessageToast.show("Book updated successfully");
        
                    // Refresh table binding
                    this._oTable.getBinding("items").refresh();
                })
                .catch((error) => {
                    sap.m.MessageToast.show("Error updating book: " + (error.message || "Unknown error"));
                    console.error("Update failed:", error);
                });
        
            // Close the dialog
            oView.byId("OpenDialog").close();
        
            // Clear edit context
            this._oEditContext = null;
        }
        
        
        
    });
});
