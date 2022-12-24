const router = require('express').Router();
const { isAuthenticated, isAdmin } = require('../middlewares/auth');

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
  getCurrentUser,
} = require('../controllers/user.controller');
const { forgotPass, resetPass } = require('../controllers/sendEmailController');

router.route('/').get(isAuthenticated, getAllUsers).post(createUser);
router.route('/sendMail').post(forgotPass);
router.route('/resetpass').post(resetPass);
router.route('/currentUser').get(isAuthenticated, getCurrentUser);
router.route('/login').post(login);

router
  .route('/:id')
  .get(isAuthenticated, getUserById)
  .delete(isAuthenticated, deleteUser)
  .patch(isAuthenticated, updateUser);

module.exports = router;
