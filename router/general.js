const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// Tâche 11 — Get all books (async/await + Axios)
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/all-books`);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(200).json(books);
  }
});

// Route interne pour Axios
public_users.get('/all-books', (req, res) => {
  return res.status(200).json(books);
});

// Tâche 12 — Get by ISBN (Promise + Axios)
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  axios.get(`${BASE_URL}/book-isbn/${isbn}`)
    .then(response => res.status(200).json(response.data))
    .catch(() => {
      const book = books[isbn];
      if (book) return res.status(200).json(book);
      return res.status(404).json({ message: "Book not found" });
    });
});

// Route interne ISBN
public_users.get('/book-isbn/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (book) return res.status(200).json(book);
  return res.status(404).json({ message: "Book not found" });
});

// Tâche 13 — Get by Author (async/await + Axios)
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const result = Object.values(books).filter(
      b => b.author.toLowerCase() === author.toLowerCase()
    );
    if (result.length === 0)
      return res.status(404).json({ message: "No books found for this author" });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Error" });
  }
});

// Tâche 14 — Get by Title (async/await + Axios)
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const result = Object.values(books).filter(
      b => b.title.toLowerCase().includes(title.toLowerCase())
    );
    if (result.length === 0)
      return res.status(404).json({ message: "No books found for this title" });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Error" });
  }
});

// Get book reviews
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book)
    return res.status(404).json({ message: "Book not found" });
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;