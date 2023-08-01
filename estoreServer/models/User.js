const crypto = require('crypto');
const mongoose = require('mongoose');
const validate = require('validator');
const bcrypt = require('bcryptjs');

// Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'tell us your name'],
    },
    email: {
        type: String,
        require: [true, 'tell us your email'],
        unique: true,
        lowercase: true,
        validate: [validate.isEmail, 'please provide valid email']
    },
    photo: String,
    role: {
        type: String,
        enum: ['admin', 'manager', 'user', 'developer'],
        default: 'user'
    },
    password: {
        type: String,
        require: [true, 'please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        require: [true, 'tell us your name'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not same!'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        select: false,
        default: true
    }
});


userSchema.pre('save', async function (next) {
    //only run this function when password is modified
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
})

userSchema.pre(/^find/, function (next) {
    // This points to the current query
    this.find({ active: { $ne: false } });
    next();
})

// Checkwhile logging password correct or not
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

// Check if password changed after login
userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimeStamp < changedTimestamp;
    }
    //False means not changed
    return false;
}

userSchema.methods.createPasswordResetToken = () => {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

const User = mongoose.model("User", userSchema);

module.exports = User