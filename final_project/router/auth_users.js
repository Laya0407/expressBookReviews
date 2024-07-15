const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, 'fingerprint_customer', { expiresIn: '1h' });
        req.session.authenticated = true;
        req.session.user = username;
        res.status(200).json({ message: "Login successful", token });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

// Add a book review
// Add or update a book review with Bearer token authentication
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Authorization token not provided" });
    }

    // Verify and decode the token
    jwt.verify(token.replace('Bearer ', ''), 'fingerprint_customer', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const user = decoded.username; // Assuming token payload includes 'username'

        if (books[isbn]) {
            books[isbn].reviews[user] = review;
            res.status(200).json({ message: "Review added/updated successfully" });
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const user = req.session.user;

    jwt.verify(token.replace('Bearer ', ''), 'fingerprint_customer', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const user = decoded.username; // Assuming token payload includes 'username'
        
        if (books[isbn] && books[isbn].reviews[user]) {
            delete books[isbn].reviews[user];
            res.status(200).json({ message: "Review deleted successfully" });
        } else {
            res.status(404).json({ message: "Book not found or review does not exist" });
        }
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
