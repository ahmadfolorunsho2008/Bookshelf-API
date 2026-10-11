// server.js — Bookshelf API
const express = require("express");

const app = express();
app.use(express.json());

// In-memory data
let books = [
  { id: 1, title: "Things Fall Apart", author: "Yunus Fawaz", read: true },
  { id: 2, title: "Half of a Yellow Sun", author: "Chimamanda Ngozi Adichie", read: false },
  { id: 3, title: "Atomic Habits", author: "Ahmad Folorunso", read: false },
];
let nextId = 4;

// GET /books  
app.get("/books", (req, res) => {
  const { read } = req.query;

  if (read === undefined) {
    return res.json(books);
  }

  // Query values are strings, so compare to "true" / "false"
  if (read !== "true" && read !== "false") {
    return res.status(400).json({ error: 'read must be "true" or "false"' });
  }

  const filtered = books.filter((book) => String(book.read) === read);
  res.json(filtered);
});

// GET /books/:id
app.get("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  res.json(book);
});

// POST /books  (title and author required)
app.post("/books", (req, res) => {
  const { title, author, read } = req.body || {};

  if (!title || !author) {
    return res.status(400).json({ error: "title and author are required" });
  }

  const newBook = { id: nextId++, title, author, read: read === true };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT /books/:id
app.put("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  const { title, author, read } = req.body || {};

  if (!title || !author) {
    return res.status(400).json({ error: "title and author are required" });
  }

  book.title = title;
  book.author = author;
  if (typeof read === "boolean") {
    book.read = read;
  }
  res.json(book);
});

// DELETE /books/:id
app.delete("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = books.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  books.splice(index, 1);
  res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Bookshelf API running on http://localhost:${PORT}`);
});
