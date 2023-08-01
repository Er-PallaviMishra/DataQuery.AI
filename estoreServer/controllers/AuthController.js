const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const sendMail = require('../utils/emails');
const catchAsync = require('../utils/catchAsync');


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_TOKEN, { expiresIn: process.env.JWT_EXPIRES_IN });
}



const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true    
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.signup = catchAsync(async (req, res) => {

    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        passwordResetToken: "token",
        passwordResetExpires: Date.now() + 10 * 60 * 1000
    });
    createSendToken(user, 201, res);
})

exports.login = catchAsync(async (req, res, next) => {

    const { email, password } = req.body;

    // checks if email and password exists
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    // check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(res.send(new AppError("Incorrect email or password", 401)));
    }

    // if everything OK, send token to client    
    createSendToken(user, 200, res);
})


exports.protect = catchAsync(async (req, res, next) => {
    let token;

    //Getting token and check if it's there
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new AppError("Please login to get access.", 401));
    }

    //verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_TOKEN);

    //check if user still exists

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(new AppError("User belonging to this token does no longer exists", 401));
    }

    //check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password, Please log in again', 401));
    }

    //Grant access to protected route
    req.user = currentUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError("You do not the permisision to perform this action", 403));
        }
        next();
    }
};

exports.forgotPassword = catchAsync(async (req, res, next) => {

    // Get user based on Posted request
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError("There is no user with email address", 404));
    }
    // Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    user.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    console.log("resetToken00", resetToken);
    await user.save();

    // send it to the user's email
    const resetURL = `${req.protocol}://${req.get('host')}/product/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit request with new password and passwordConfirm to:${resetURL}.\n if you didn't forget your password,please ignore this email!`;

    try {
        const data = await sendMail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });

        // console.log("reset token", data);

        res.status(200).json({
            status: 'success',
            message: `Token sent to email!${resetToken}`
        })
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email', 500));
    }

})


exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1)Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    // const hashedToken=req.params.token;

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        // passwordResetExpires: { $gt: Date.now() }
    });
    console.log(user);

    // 2)If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400))
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordChangedAt = Date.now();
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    //3) Update changedPasswordAt property for the user
    //4) Log the user in,send JWT
    createSendToken(user, 200, res);
})

exports.updatePassword = catchAsync(async (req, res, next) => {
    // Get user from collection
    const user = await User.findById(req.user.id).select('+password');
    // Check if posted current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError("Your old password is wrong", 401));
    }
    //if so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    //Log user in , send JWT
    createSendToken(user, 200, res);

})

