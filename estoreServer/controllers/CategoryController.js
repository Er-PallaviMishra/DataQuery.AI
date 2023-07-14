const Category = require('../models/Category');

exports.addCategory = (req, res) => {
    try {
        const response = req.body;
        Category.create(response).then((response) => {
            res.status(201).json({
                message: 'created successfully',
                data: response
            })
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err
        });
    }
}

exports.getCategories = (req,res) => {
    try {
        Category.find({}).then((response) => {
            res.status(200).json(response)
        })
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err
        })
    }
}

exports.getCategoryById = (req, res) => {
    try {
        const id = req.query.id;
        Category.findById(id).then((response) => {
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

exports.deleteCategory = (req, res) => {
    try{
        Category.findByIdAndDelete(req.query.id).then((response)=>{
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