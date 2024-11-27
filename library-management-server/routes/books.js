const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// Lấy danh sách sách
router.get("/", async (req, res) => {
  const books = await Book.find({});
  res.json(books);
});

// Thêm sách mới
router.post("/", async (req, res) => {
  const book = await Book.create(req.body);
  res.status(201).json(book);
});

module.exports = router;
