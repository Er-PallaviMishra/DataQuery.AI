const express = require('express');
const app = express.Router();
const mysql = require('mysql');

const pool = mysql.createPool({
    host: "localhost",
    database:"estore",
    user: "root",
    password: "",
    port: 3306,
    multipleStatements: true
})

const getCategories=(req, res) => {

    let categoryData;

    pool.query("select * from categories", (error, categories) => {
        if (error) {
            categoryData = error;
            res.status(500).send(categoryData);
        } else {
            categoryData = categories,
                res.status(200).send(categoryData);
        }
    })
};




const getProducts=(req, res) => {
    let productdata;

    pool.query("select * from products", (error, products) => {
        if (error) {
            productdata = error;
            res.status(500).send(productdata);
        } else {
            productdata = products,
                res.status(200).send(productdata);
        }
    })
}
app.get("/getCategories", getCategories);
app.get("/getProducts", getProducts);





module.exports = app;