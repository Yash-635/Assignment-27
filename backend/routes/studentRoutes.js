const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Course = require('../models/Course');

// POST /students/student -> create student
router.post('/student', async (req, res) => {
  try {
    const { name } = req.body;
    const student = new Student({ name });
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /students/course -> create course
router.post('/course', async (req, res) => {
  try {
    const { title } = req.body;
    const course = new Course({ title });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /students/enroll -> enroll student in course
router.post('/enroll', async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    
    // Add course to student
    await Student.findByIdAndUpdate(studentId, {
      $addToSet: { courses: courseId }
    });
    
    // Add student to course
    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { students: studentId }
    });
    
    res.json({ message: 'Enrollment successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /students -> fetch students with courses (use populate)
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().populate('courses');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /students/courses -> fetch all courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find().populate('students');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /students/:studentId -> fetch single student with courses
router.get('/:studentId', async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId).populate('courses');
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /students/:studentId -> update student
router.put('/:studentId', async (req, res) => {
  try {
    const { name } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.studentId,
      { name },
      { new: true }
    ).populate('courses');
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /students/:studentId -> delete student and unenroll from courses
router.delete('/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    // Remove student from all courses
    await Course.updateMany(
      { students: studentId },
      { $pull: { students: studentId } }
    );
    // Delete the student
    const deletedStudent = await Student.findByIdAndDelete(studentId);
    res.json({ message: 'Student deleted and unenrolled from courses', deletedStudent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /students/:studentId/courses/:courseId -> unenroll from course
router.delete('/:studentId/courses/:courseId', async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    
    // Remove course from student
    await Student.findByIdAndUpdate(studentId, {
      $pull: { courses: courseId }
    });
    
    // Remove student from course
    await Course.findByIdAndUpdate(courseId, {
      $pull: { students: studentId }
    });
    
    res.json({ message: 'Student unenrolled from course' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /students/courses/:courseId -> update course
router.put('/courses/:courseId', async (req, res) => {
  try {
    const { title } = req.body;
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.courseId,
      { title },
      { new: true }
    ).populate('students');
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /students/courses/:courseId -> delete course
router.delete('/courses/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    // Remove course from all students
    await Student.updateMany(
      { courses: courseId },
      { $pull: { courses: courseId } }
    );
    // Delete the course
    const deletedCourse = await Course.findByIdAndDelete(courseId);
    res.json({ message: 'Course deleted', deletedCourse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
