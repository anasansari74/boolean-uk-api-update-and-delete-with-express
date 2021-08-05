// const db = require("../../utils/database");

// function createOne(req, res) {
//   const createOne = `
//     INSERT INTO books
//       (name, type, author, topic, publicationDate)
//     VALUES
//       ($1, $2, $3, $4, $5)
//     RETURNING *;
//   `;

//   db.query(createOne, Object.values(req.body))
//     .then((result) => res.json({ data: result.rows[0] }))
//     .catch(console.error);
// }

const Books = require("./model");

const { getAllBooks, getOneById, createOneBook, updateById } = Books();

function getAll(req, res) {
  books = req.body;

  getAllBooks(result => {
    res.json({ data: result });
  });
}

function getOne(req, res) {
  const idToGet = req.params.id;

  getOneById(idToGet, result => {
    res.json({ data: result });
  });
}

function createOne(req, res) {
  const newBook = req.body;
  createOneBook(newBook, newBook => {
    res.json({ newBook });
  });

  res.json({ newBook: "shiny new book" });
}

function patchById(req, res) {
  const bookId = req.params.id;
  const keysToUpdate = req.body;

  getOneById(bookId, book => {
    if (!book) {
      return res.json({ msg: `can't find book with id ${bookId}` });
    }

    const patchBook = { ...book, ...keysToUpdate };

    updateById(bookId, patchBook, (updatedBook, error) => {
      if (error) {
        return res.status(500).json({ msg: `SQL error: ${error}` });
      }

      res.json({ data: updatedBook });
    });
  });
}

module.exports = {
  getAll,
  getOne,
  createOne,
  patchById,
};
