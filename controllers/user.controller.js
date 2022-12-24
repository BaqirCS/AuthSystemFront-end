const User = require('../models/user.model');
const CustomError = require('../utils/CustomError');
const mongoose = require('mongoose');
const { GenerateToken } = require('../middlewares/auth');
const checkValidPassword = require('../utils/CheckPassword');

//Create user => POST Met => PUBLIC Acc
const createUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email) {
      throw new CustomError('Email is required', 401);
    }
    if (!name) {
      throw new CustomError('Email is required', 401);
    }
    if (!password) {
      throw new CustomError('Email is required', 401);
    }
    const passwordCheck = checkValidPassword(password);
    if (!passwordCheck) {
      throw new CustomError('password format is wrong', 400);
    }
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      throw new CustomError('user is already existed', 401);
    }
    const user = await User.create(req.body);
    res.status(201).json({ success: 'true' });
  } catch (error) {
    next(error);
  }
};

//Get single user => Get Met => Private Acc + ADMIN Only
const getUserById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      throw new CustomError(`No user with ID: ${req.params.id}`, 404);
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

//Get ALl users => GET Met => Private Acc + ADMIN Only
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

//Update single user => PATCH Met => Private Acc + ADMIN Only
const updateUser = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new CustomError(`No user with ID :${req.params.id}`, 404);
    }
    const { email, name, password, status } = req.body;

    if (email) {
      if (user.email !== email) {
        const existedEmail = await User.findOne({ email });
        if (existedEmail) {
          throw new CustomError('Email Address is already in use', 400);
        } else {
          user.email = email;
        }
      }
    }
    if (name) {
      user.name = name;
    }
    if (password) {
      const match = await user.isPasswordEqual(password);
      if (!match) {
        const valid = checkValidPassword(password);
        if (!valid) {
          throw new CustomError('password format is wrong', 400);
        }
        user.password = password;
      }
    }
    if (status && user.status !== status) {
      user.status = status;
    }
    await user.save();

    const selectUser = {
      name: user.name,
      email: user.email,
      status: user.status,
    };
    res.status(200).json(selectUser);
  } catch (error) {
    next(error);
  }
};

//Delete single user => DELETE Met => Private Acc + ADMIN Only
const deleteUser = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new CustomError(`No user with ID :${req.params.id}`, 404);
    }
    await user.remove();

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

//Login  user => POST Met => PUBLIC
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      throw new CustomError('Email is Required', 401);
    }
    if (!password) {
      throw new CustomError('Password is Required', 401);
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError('Email is not Existed', 404);
    }
    const match = await user.isPasswordEqual(password);
    if (!match) {
      throw new CustomError('Password is wrong', 401);
    }
    if (user.status === 'pending') {
      throw new CustomError(
        'you are not allowd to log in, please contact app administrator',
        401
      );
    }
    const payload = {
      userId: user._id,
      name: user.name,
      email: user.email,
      status: user.status,
    };
    res.status(200).json({
      user: payload,
      token: await GenerateToken(payload),
    });
  } catch (error) {
    next(error);
  }
};

//Get Current user=> GET Met=> private Acc
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
  getCurrentUser,
};
