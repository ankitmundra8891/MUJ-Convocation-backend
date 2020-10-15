const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserAfterLogin,
  updatePassword,
  forgotPassword,
  resetPassword,
  updateDetails,
  addCommunicationData,
} = require('../controller/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getUser', protect, getUserAfterLogin);
router.post('/add-communication-data', protect, addCommunicationData);
router.put('/updateDetails', protect, updateDetails);
router.put('/updatePassword', protect, updatePassword);
router.post('/forgotPassword', forgotPassword);
router.put('/resetPassword/:resetToken', resetPassword);
router.get('/logout', logoutUser);

module.exports = router;
