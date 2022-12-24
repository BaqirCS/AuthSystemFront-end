const User = require('../models/user.model');
const CustomError = require('../utils/CustomError');
const crypto = require('crypto');
const checkValidPassword = require('../utils/CheckPassword');
const { sendForgotPassword } = require('../email');
const forgotPass = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new CustomError('Email is required', 401);
    }
    const user = await User.findOne({ email });
    if (user) {
      const sentemail = 'baqiresfandiari1996@gmail.com';
      const passwordForgotString = crypto.randomBytes(70).toString('hex');
      const tenMinutes = 1000 * 60 * 10;
      const passwordForgotDate = new Date(Date.now() + tenMinutes);
      user.passwordForgotString = passwordForgotString;
      user.passwordForgotDate = passwordForgotDate;
      await user.save();
      await sendForgotPassword(user);
      return res.json(
        'reset Link hass been sent to your gmail account, please check your gmail'
      );
    }
    res.json(
      'reset Link hass been sent to your gmail account, please check your gmail'
    );
  } catch (error) {
    next(error);
  }
};

const resetPass = async (req, res, next) => {
  try {
    const { password, email, token } = req.body;
    if (!email) {
      throw new CustomError('configuration Error', 401);
    }
    if (!token) {
      throw new CustomError('configuration Error', 401);
    }
    if (!password) {
      throw new CustomError('new password is required', 401);
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError('No User is found', 404);
    }
    const now = new Date();
    if (user.passwordForgotDate.getTime() < now.getTime()) {
      throw new CustomError('Token is Expired, please start over', 400);
      // user.passwordForgotDate = null;
      // user.passwordForgotString = null;
    }
    if (user.passwordForgotString !== token) {
      throw new CustomError('Token is Wrong, please start over', 400);
    }
    const passwordCheck = checkValidPassword(password);
    if (!passwordCheck) {
      throw new CustomError('password format is wrong', 400);
    }
    user.password = password;
    await user.save();
    res.json('password has successfully updated!!!');
  } catch (error) {
    next(error);
  }
};
module.exports = { forgotPass, resetPass };
