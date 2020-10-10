const express = require('express');
const Router = express.Router();
const studentController = require('../controller/student');

Router.get('/get-all-students', studentController.getStudentsData);
Router.get('/get-specific-student/:id', studentController.getSpecificStudent);
Router.get('/get-unpaid-students',studentController.getUnpaidStudents);
Router.post('/create-student', studentController.createStudent);
Router.post('/create-students', studentController.createStudents);
Router.put('/update-student/:id',studentController.updateStudent);
Router.put('/update-student-payment-status/:id',studentController.updateStudentPaymentStatus);
Router.delete('/delete-student-by-reg-no/:id',studentController.deleteStudentByRegNo);

module.exports = Router;