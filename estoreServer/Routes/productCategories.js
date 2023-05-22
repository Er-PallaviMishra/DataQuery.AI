const express = require('express');
const productCategories = express.Router();
const mysql = require('mysql');

const pool = mysql.createPool({
    host: "localhost",
    database:"estore",
    user: "root",
    password: "",
    port: 3306,
    multipleStatements: true
})

productCategories.get("/", (req, res) => {
    let categoryData;

    pool.query("select * from categories",(error,categories)=>{
        if(error){
            categoryData=error;
            res.status(500).send(categoryData);
        }else{
            categoryData=categories,
            res.status(200).send(categoryData);
        }
    })
})

module.exports= productCategories;