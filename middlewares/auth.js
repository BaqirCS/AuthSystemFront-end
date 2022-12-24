const jwt = require('jsonwebtoken');
const CustomError = require('../utils/CustomError');

const GenerateToken = async (payload) => {
  return await jwt.sign(payload, process.env.JWT_SECRETE, {
    expiresIn: '1d',
  });
};

const isAuthenticated = (req, res, next) => {
  const header = req.headers;
  if (!header) {
    return next(
      new CustomError('Bad authentication, please log in first', 401)
    );
  }

  const token = header.authorization;
  if (!token || !token.startsWith('Bearer ')) {
    return next(
      new CustomError('Bad authentication, please log in first', 401)
    );
  }
  const tokenValue = token.split(' ')[1];
  try {
    const decode = jwt.decode(tokenValue);
    req.user = {
      userId: decode.userId,
      name: decode.name,
      email: decode.email,
      status: decode.status,
    };
    next();
  } catch (error) {
    next(error);
  }
};
const isAdmin = (req, res, next) => {
  if (req.user.status === 'admin') {
    next();
  } else {
    return next(
      new CustomError(
        'Authorization Error, you are not allowed to do admin operation'
      ),
      401
    );
  }
};

module.exports = { GenerateToken, isAuthenticated, isAdmin };
