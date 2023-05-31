const express = require('express');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/bookstore', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Create book schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  publishedYear: { type: Number }
});

// Create book model
const Book = mongoose.model('Book', bookSchema);

// Create Express app
const app = express();
app.use(express.json());

// GET /books - Retrieve all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /books/:id - Retrieve a specific book by ID
app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /books - Create a new book
app.post('/books', async (req, res) => {
  try {
    const { title, author, description, publishedYear } = req.body;
    const book = new Book({ title, author, description, publishedYear });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: 'Invalid request' });
  }
});

// PUT /books/:id - Update a book by ID
app.put('/books/:id', async (req, res) => {
  try {
    const { title, author, description, publishedYear } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, description, publishedYear },
      { new: true }
    );
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid request' });
  }
});

// DELETE /books/:id - Delete a book by ID
app.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (book) {
      res.json({ message: 'Book deleted successfully' });
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
