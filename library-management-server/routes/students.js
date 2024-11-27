const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// Lấy danh sách sinh viên
router.get("/", async (req, res) => {
  const students = await Student.find({});
  res.json(students);
});

// Thêm sinh viên mới
router.post("/", async (req, res) => {
  const student = await Student.create(req.body);
  res.status(201).json(student);
});

module.exports = router;
