const { validationResult } = require('express-validator');
const Student = require('../model/student');

exports.getStudentsData = (req, res, next) => {
  Student.find()
    .then((result) => {
      res.status(200).json({ message: 'Students fetched', data: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getSpecificStudent = (req, res, next) => {
  const reg_no = req.params.id;
  Student.find({ reg_no: reg_no })
    .then((result) => {
      if (!result) {
        const error = new Error('Could not find student');
        error.status = 404;
        throw error;
      }
      res.status(200).json({ message: 'Student fetched', student: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getUnpaidStudents = (req, res, next) => {
  Student.find({ is_paid: false })
    .then((result) => {
      if (!result) {
        const error = new Error('Could not find student');
        error.status = 404;
        throw error;
      }
      res.status(200).json({ message: 'Student fetched', student: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateStudentPaymentStatus = (req, res, next) => {
  const reg_no = req.params.id;
  Student.find({ reg_no: reg_no })
    .then((student) => {
      if (student.length === 0) {
        const error = new Error('Could not find student.');
        error.status = 404;
        throw error;
      }
      student[0].is_paid = true;
      return student[0].save();
    })
    .then((result) => {
      res
        .status(200)
        .send({ message: 'Student paid successfully!', student: result });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.createStudent = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const {
    faculty,
    school,
    programme,
    specialization,
    reg_no,
    student_name,
    gender,
    batch,
    credits,
    cgpa,
    remark,
  } = req.body;
  const student = new Student({
    faculty,
    school,
    programme,
    specialization,
    reg_no,
    student_name,
    gender,
    batch,
    credits,
    cgpa,
    remark,
  });
  student
    .save()
    .then((result) => {
      res
        .status(200)
        .json({ message: 'Student created successfully', data: result });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.updateStudent = (req, res, next) => {
  const reg_no = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const {
    faculty,
    school,
    programme,
    specialization,
    student_name,
    gender,
    batch,
    credits,
    cgpa,
    remark,
  } = req.body;
  Student.find({ reg_no: reg_no })
    .then((student) => {
      if (student.length == 0) {
        const error = new Error('Could not find student.');
        error.status = 404;
        throw error;
      }
      faculty ? (student[0].faculty = faculty) : '';
      school ? (student[0].school = school) : '';
      programme ? (student[0].programme = programme) : '';
      specialization ? (student[0].specialization = specialization) : '';
      student_name ? (student[0].student_name = student_name) : '';
      gender ? (student[0].gender = gender) : '';
      batch ? (student[0].batch = batch) : '';
      credits ? (student[0].credits = credits) : '';
      cgpa ? (student[0].cgpa = cgpa) : '';
      remark ? (student[0].remark = remark) : '';
      return student[0].save();
    })
    .then((result) => {
      res.status(200).send({
        message: 'Student details updated successfully!',
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

exports.createStudents = (req, res, next) => {
  const studentsData = req.body.data;
  Student.insertMany(studentsData)
    .then((students) => {
      res.status(200).json({ message: 'Students added', students: students });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteStudentByRegNo = (req, res, next) => {
  const reg_no = req.params.id;
  Student.find({ reg_no: reg_no })
    .then((student) => {
      if (!student) {
        const error = new Error('Could not find student.');
        error.status = 404;
        throw error;
      } else {
        return Student.findByIdAndRemove(student[0]._id);
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
