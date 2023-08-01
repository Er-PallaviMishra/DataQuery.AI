const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.addUser = (req, res) => {
    try {
        const response = req.body;
        console.log("user added data:", response)
        User.create(response).then((response) => {
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

exports.getUsers = (req, res) => {
    try {
        User.find({}).then((response) => {
            res.status(200).json(response)
        })
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err
        })
    }
}

exports.getUserById = (req, res) => {
    try {
        const id = req.query.id;
        User.findById(id).then((response) => {
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

exports.deleteUser = (req, res) => {
    try {
        User.findByIdAndDelete(res.body.user_id).then((response) => {
            res.status(200).json({
                status: 'deleted successfully'
            })
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
};

exports.updateMe = (req, res, next) => {
    // Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError("This route is not for password update", 400));
    }
    // Update user document

    res.status(200).json({

    })

}
exports.updateUser=catchAsync(async(req,res,next)=>{
   const updatedUser=await User.FindByIdAndUpdate(req.user.id,filterBody,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        status:"success",
        data:{
            user:updatedUser
        }
    })
})

exports.deleteUser=catchAsync(async(req,res,next)=>{
   await User.FindByIdAndUpdate(req.user.id,{active:false})
    res.status(204).json({
        status:"success",
        data:null
    })
})