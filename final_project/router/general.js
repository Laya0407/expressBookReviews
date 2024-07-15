const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!isValid(username)) {
    users.push({ username, password });
    res.status(200).json({ message: "User registered successfully" });
  } else {
    res.status(400).json({ message: "Username already exists" });
  }
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const { author } = req.params;
    const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase().includes(author.toLowerCase()));
    if (filteredBooks.length > 0) {
      res.status(200).json({ booksbyauthor: filteredBooks });
    } else {
      res.status(404).json({ message: "No books found by this author" });
    }
  });

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
    const { title } = req.params;
    const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
    if (filteredBooks.length > 0) {
      res.status(200).json({ booksbytitle: filteredBooks });
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
  });
  

// Get book review
public_users.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  if (book) {
    res.status(200).json(book.reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Registration
public_users.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    users.push({ username, password });
    res.status(200).json({ message: "User registered successfully" });
  } else {
    res.status(400).json({ message: "Username already exists" });
  }
});


module.exports.general = public_users;
