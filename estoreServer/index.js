const express = require('express');
const productCategories= require('./Routes/productCategories');
const app = express();

app.use("/productCategories", productCategories);
const PORT = 5000;

const server = app.listen(PORT, () => {
    console.log("App is running on port", PORT);
})