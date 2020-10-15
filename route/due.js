const express = require('express');
const Router = express.Router();
const dueController = require('../controller/due');
const { protect } = require('../middleware/auth');

Router.get('/get-student-dept-dues/:id', protect, dueController.getDueByRegNo);
Router.post(
  '/create-student-dept-due',
  protect,
  dueController.createStudentDue
);
Router.delete(
  '/delete-student-by-dept-reg-no',
  protect,
  dueController.deleteStudentByRegAndDept
);
Router.put('/clear-student-due/:id', protect, dueController.clearStudentDue);

module.exports = Router;
