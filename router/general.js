const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// Tâche 1 - Get all books (async/await)
public_users.get('/', async (req, res) => {
  try {
    const response = await new Promise((resolve) => resolve(books));
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Tâche 2 - Get book by ISBN (Promise)
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) resolve(book);
    else reject("Book not found");
  })
    .then(book => res.status(200).json(book))
    .catch(err => res.status(404).json({ message: err }));
});

// Tâche 3 - Get books by author (async/await)
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

// Tâche 4 - Get books by title (async/await)
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

// Tâche 5 - Get book reviews
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book)
    return res.status(404).json({ message: "Book not found" });
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;