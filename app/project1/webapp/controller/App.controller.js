sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("project1.controller.App", {
        onInit: function () {
            this._oTable = this.byId("Books");
        },

        // Open Create Dialog
        onOpenDialog: function () {
            this.getView().byId("OpenDialog").open();
        },

        // Close Create Dialog
        onCanceldialog: function (oEvent) {
            oEvent.getSource().getParent().close();
        },

        // Create Book
        onNewBook: function () {
            var oModel = this.getView().getModel();
            var oBookId = this.byId("ID").getValue();

            if (!oBookId || isNaN(oBookId)) {
                MessageToast.show("Book ID must be a valid integer");
                return;
            }

            var oData = {
                "ID": parseInt(oBookId, 10),
                "title": this.byId("title").getValue(),
                "author": this.byId("author").getValue(),
                "price": this.byId("price").getValue()
            };

            var oBinding = this._oTable.getBinding("items");
            if (oBinding) {
                oBinding.create(oData);
                MessageToast.show("Book created successfully!");
                this.byId("OpenDialog").close();
                this.refreshModel();
            }
        },

        // Open Edit Dialog with Selected Book Details
        onEditDialog: function () {
            var oTable = this.byId("Books");
            var oSelectedItem = oTable.getSelectedItem();

            if (!oSelectedItem) {
                MessageToast.show("Please select a book to edit.");
                return;
            }

            var oBook = oSelectedItem.getBindingContext().getObject();
            this.byId("ebookId").setValue(oBook.bookId);
            this.byId("etitle").setValue(oBook.title);
            this.byId("eauthor").setValue(oBook.author);
            this.byId("eprice").setValue(oBook.price);

            this.getView().byId("EditDialog").open();
        },

        // Close Edit Dialog
        onCanceleditdialog: function () {
            this.getView().byId("EditDialog").close();
        },

        // Update Book Details
        onUpdateBook: function () {
            var oTable = this.byId("Books");
            var oSelectedItem = oTable.getSelectedItem();

            if (!oSelectedItem) {
                MessageToast.show("No book selected.");
                return;
            }

            var oContext = oSelectedItem.getBindingContext();
            var oModel = this.getView().getModel();

            // Get new values
            var updatedData = {
                "ID": parseInt(this.byId("ebookId").getValue(), 10),
                "title": this.byId("etitle").getValue(),
                "author": this.byId("eauthor").getValue(),
                "price": this.byId("eprice").getValue()
            };

            // Update model
            oContext.setProperty("title", updatedData.title);
            oContext.setProperty("author", updatedData.author);
            oContext.setProperty("price", updatedData.price);

            this.refreshModel();
            MessageToast.show("Book details updated successfully!");
            this.byId("EditDialog").close();
        },

       
        onDelete: function () {
            var oTable = this.byId("Books");
            var oSelectedItem = oTable.getSelectedItem();
        
            if (!oSelectedItem) {
                MessageToast.show("Please select a book to delete.");
                return;
            }
        
            var oContext = oSelectedItem.getBindingContext();
        
            if (!oContext) {
                MessageToast.show("Error: Could not retrieve book data.");
                return;
            }
        
            // Call delete operation on the bound context
            oContext.delete().then(function () {
                MessageToast.show("Book deleted successfully.");
            }).catch(function (oError) {
                MessageToast.show("Error deleting book: " + oError.message);
            });
        
            oTable.removeSelections(true);
        },        
   
        refreshModel: function () {
            var oModel = this.getView().getModel();
            oModel.refresh(true);
        }
    });
});
