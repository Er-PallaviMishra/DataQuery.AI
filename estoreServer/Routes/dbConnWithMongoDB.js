const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const api = express.Router();
const productController=require('../controllers/ProductController');
const CategoryController=require('../controllers/CategoryController');

dotenv.config({ path: './config.env' });
const bodyParser= require('body-parser');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);
mongoose.connect(DB, {
    useNewUrlParser: true
}).then(con => {
    console.log('DB connection Successful');
});

api.post('/addCategory',CategoryController.addCategory);
api.get('/getCategories',CategoryController.getCategories);
api.get('/getCategoryById',CategoryController.getCategoryById);
api.delete('/deleteCategory',CategoryController.deleteCategory);


api.get('/getProducts',productController.getProducts);
api.get('/getProductById',productController.getProductById);
api.post('/addProduct',productController.addProduct);
api.delete('/deleteProduct',productController.deleteProduct);


module.exports = api;