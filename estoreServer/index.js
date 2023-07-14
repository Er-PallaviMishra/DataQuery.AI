const express = require('express');
const app = express();
const cors = require('cors');

// const product= require('./Routes/products');
const product = require('./Routes/dbConnWithMongoDB');
const bodyParser = require('body-parser');


const corsOpts = {
    origin: '*',
  
    methods: [
      'GET',
      'POST',
      'DELETE'
    ],
  
    allowedHeaders: [
      'Content-Type',
    ],
  };
  app.use(cors(corsOpts));
app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));
app.use("/product", product);
const PORT = 5000;

const server = app.listen(PORT, () => {
    console.log("App is running on port", PORT);
})