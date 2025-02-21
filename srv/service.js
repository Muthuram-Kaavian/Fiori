const cds = require('@sap/cds');
const fs = require('fs');
const path = require('path');

const CSV_FILE = path.join(__dirname, '../db/data/my-Books.csv');

module.exports = cds.service.impl(async function () {
    this.on('addBook', async (req) => {
        const newBook = req.data.book; // Get book data from UI

        try {
            // Convert book object to CSV format
            const newLine = `${newBook.ID};${newBook.title};${newBook.author};${newBook.price};${newBook.stock}\n`;

            // If the CSV file doesn't exist, create it with headers
            if (!fs.existsSync(CSV_FILE)) {
                fs.writeFileSync(CSV_FILE, 'ID;title;author;price;stock\n');
            }

            // Append new book entry to CSV
            fs.appendFileSync(CSV_FILE, newLine);

            return newBook; // Return the book object to UI for local storage
        } catch (err) {
            console.error("Error writing to CSV:", err);
            req.error(500, "Failed to save data");
        }
    });
});
