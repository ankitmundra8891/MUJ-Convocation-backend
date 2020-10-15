const { validationResult } = require('express-validator');
const Due = require('../model/due');

exports.getDueByRegNo = (req, res, next) => {
  const reg_no = req.params.id;
  const department = req.user.department;
  Due.find({ reg_no: reg_no, department: department })
    .then((result) => {
      if (!result) {
        const error = new Error(
          'Could not find student with registration number'
        );
        error.status = 404;
        throw error;
      }
      res.status(200).json({ message: 'Student Dues are: ', data: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createStudentDue = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const { reg_no, department, amount_due, details } = req.body;
  const due = new Due({
    reg_no,
    department,
    amount_due,
    details,
  });
  due
    .save()
    .then((result) => {
      res
        .status(200)
        .json({ message: 'Student Due created successfully', data: result });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.deleteStudentByRegAndDept = (req, res, next) => {
  const { reg_no } = req.body;
  const department = req.user.department;
  Due.find({ reg_no, department })
    .then((result) => {
      if (!result) {
        const error = new Error('Could not find student.');
        error.status = 404;
        throw error;
      } else {
        // return Due.findByIdAndRemove(result[0]._id);
        return Due.deleteMany({ reg_no, department });
      }
    })
    .then((result) => {
      res.status(200).json({ message: 'Deleted student successfully!' });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.clearStudentDue = (req, res, next) => {
  const id = req.params.id;
  Due.findById(id)
    .then((student) => {
      if (!student) {
        const error = new Error('Could not find student.');
        error.status = 404;
        throw error;
      }
      return Due.findByIdAndRemove(id);
      // student.is_clear = true;
      // return student.save();
    })
    .then((result) => {
      res.status(200).json({
        message: 'Student due cleared successfully!',
        student: result,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};
