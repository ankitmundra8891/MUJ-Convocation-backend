const express = require('express');
const Router = express.Router();
const dueController = require('../controller/due');

Router.get('/get-student-dept-dues/:id',dueController.getDueByRegNo);
Router.post('/create-student-dept-due',dueController.createStudentDue);
Router.delete('/delete-student-by-dept-reg-no',dueController.deleteStudentByRegAndDept);
Router.put('/clear-student-due/:id',dueController.clearStudentDue);

module.exports= Router;