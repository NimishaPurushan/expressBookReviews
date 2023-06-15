const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user)=>{
  return user.username === username
});
if(userswithsamename.length > 0){
  return true;
} else {
  return false;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
  return (user.username === username && user.password === password)
});
if(validusers.length > 0){
  return true;
} else {
  return false;
}
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).json({"message":"Successfully login", "token":accessToken});
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let book = books[isbn];

  if (book) {
    // Initialize the 'reviews' property as an empty object if it doesn't exist
    if (!book.reviews) {
      book.reviews = {};
    }

    // Update the review for the specified user
    const { username } = req.session.authorization;
    book.reviews[username] = req.body;

    res.status(200).json({ message: "Review updated successfully" });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Delete a book 
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let book = books[isbn];

  if (book) {
    // Initialize the 'reviews' property as an empty object if it doesn't exist
    if (!book.reviews) {
      book.reviews = {};
    }

    console.log(req.session.authorization);
    // Update the review for the specified user
    const { username } = req.session.authorization;

    // Delete the review for the current username
    delete book.reviews[username];

    res.status(200).json({ message: "Review deleted successfully" });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
