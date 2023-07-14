const mongoose= require('mongoose');

const categorySchema=new mongoose.Schema({
    category:{
        type:String,
        unique:true,
        required:true
    },
    parentcategoryid:{
        type:Number,
        required:true,
        default:0
    }
})

const Category=mongoose.model('Category',categorySchema);
module.exports= Category