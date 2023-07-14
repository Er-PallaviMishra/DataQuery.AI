const Product = require('../models/Product');

exports.addProduct = (req, res) => {
    try {
        const response = req.body;
        Product.create(response).then((response) => {
            res.status(201).json({
                status: 'success',
                message: "Data saved in db.",
                data: response
            })
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }

};

exports.getProducts = (req, res) => {
    try {
        Product.find({}).then((response) => {
            res.status(200).json(response)
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.getProductById = (req, res) => {
    try {
        const id = req.query.id;
        console.log("id", id);
        Product.findById(id).then((response) => {
            res.status(200).json({
                status: 'fetched successfully',
                data: response
            })
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}


exports.deleteProduct = (req, res) => {
    try{
        Product.findByIdAndDelete(req.query.id).then((response)=>{
            res.status(200).json({
                status: 'deleted successfully'
            })
        })
    }catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    } 
};