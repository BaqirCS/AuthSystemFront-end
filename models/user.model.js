const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name field is required'],
    },
    email: {
      type: String,
      required: [true, 'Email field is required'],
      validate: [isEmail, 'Not a Valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password field is required'],
      minLength: [6, 'Password should not be less than 6 characters'],
    },
    passwordForgotString: {
      type: String,
    },
    passwordForgotDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['admin', 'user', 'pending'],
      default: 'user',
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    next(error);
  }
});
userSchema.methods.isPasswordEqual = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('user', userSchema);
