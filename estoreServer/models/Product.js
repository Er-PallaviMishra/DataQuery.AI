const mongoose = require('mongoose');

const productSchema= new mongoose.Schema({
    product_name:{
        type:String,
        required:true,
         unique:true
    },
    description:{
        type:String,
        required:true,
    },
    product_img:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
        default:10
    },
    category_id:{
        type:Number,
        required:true,
    },
});

const Product=mongoose.model('Product',productSchema);

module.exports=Product

