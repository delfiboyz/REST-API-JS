// server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing JSON
app.use(bodyParser.json());

// Data dummy sebagai “database” sederhana
let books = [
  { id: 1, title: 'Clean Code', author: 'Robert C. Martin' },
  { id: 2, title: 'You Don’t Know JS', author: 'Kyle Simpson' }
];

// GET /books → list semua buku
app.get('/books', (req, res) => {
  res.json(books);
});

// GET /books/:id → ambil buku berdasarkan ID
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === Number(req.params.id));
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  res.json(book);
});

// POST /books → tambah buku baru
app.post('/books', (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }
  const newBook = {
    id: books.length ? books[books.length - 1].id + 1 : 1,
    title,
    author
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT /books/:id → update buku
app.put('/books/:id', (req, res) => {
  const idx = books.findIndex(b => b.id === Number(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }
  const { title, author } = req.body;
  if (!title && !author) {
    return res.status(400).json({ message: 'At least one of title or author must be provided' });
  }
  // Merge update
  books[idx] = { ...books[idx], ...req.body };
  res.json(books[idx]);
});

// DELETE /books/:id → hapus buku
app.delete('/books/:id', (req, res) => {
  const idx = books.findIndex(b => b.id === Number(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }
  const removed = books.splice(idx, 1);
  res.json({ message: 'Book deleted', book: removed[0] });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
