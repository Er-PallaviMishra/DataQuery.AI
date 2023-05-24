const express = require('express');
const productCategories= require('./Routes/products');
const app = express();
const cors= require('cors');

app.use(cors());

app.use("/product", productCategories);
const PORT = 5000;

const server = app.listen(PORT, () => {
    console.log("App is running on port", PORT);
})