const router = require("express").Router()
const Book = require('../model/book')
const checkAuth = require('../middleware/auth')

//get all books
router.get('/', checkAuth, async (req, res) => {
  try {
    const book = await Book.find()
    const bookCount = book.length
    res.status(200).json({ bookCount, book })
  } catch (error) {
    res.status(404).json(error)
  }
})

//get book by id
router.get('/:id', checkAuth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    res.status(200).json(book)
  } catch (error) {
    res.status(404).json(error)
  }
})

//create book
router.post('/', checkAuth, async (req, res) => {
  const newBook = new Book(req.body)
  try {
    const saveBook = await newBook.save()
    res.status(201).json(saveBook)
  } catch (error) {
    res.status(500).json(error)
  }
})

//update book
router.put('/:id', checkAuth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json('Book not found');
    }

    if (book.username !== req.body.username) {
      return res.status(401).json('You are not authorized to update this book');
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      { new: true }
    );

    res.status(200).json('Book has been updated');
  } catch (error) {
    res.status(500).json(error);
  }
});

//delete book
router.delete('/:id', checkAuth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json('Book not found');
    }

    if (book.username !== req.body.username) {
      return res.status(401).json('You are not authorized to delete this book');
    }

    await Book.findByIdAndRemove(req.params.id);
    res.status(200).json('Book has been deleted');
  } catch (error) {
    res.status(500).json(error);
  }
});



module.exports = router