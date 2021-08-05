const db = require("../../utils/database");
const { buildBooksDatabase } = require("../../utils/mockData");

function Book() {
  function createTable() {
    const sql = `
      DROP TABLE IF EXISTS books;

      CREATE TABLE IF NOT EXISTS books (
        id              SERIAL        PRIMARY KEY,
        title           VARCHAR(255)   NOT NULL,
        type            VARCHAR(255)   NOT NULL,
        author          VARCHAR(255)   NOT NULL,
        topic           VARCHAR(255)   NOT NULL,
        publicationdate DATE           NOT NULL
      );
    `;

    db.query(sql)
      .then(result => console.log("[DB] Book table ready."))
      .catch(console.error);
  }

  // Fake data (seeding)
  function mockData() {
    const createBook = `
      INSERT INTO books
        (title, type, author, topic, publicationdate)
      VALUES
        ($1, $2, $3, $4, $5)
    `;

    const books = buildBooksDatabase();

    books.forEach(book => {
      db.query(createBook, Object.values(book)).catch(console.error);
    });
  }

  // Model queries
  function getAllBooks(callback) {
    const getAll = `
      SELECT * FROM books;
    `;
    db.query(getAll)
      .then(result => callback(result.rows))
      .catch(console.error);
  }

  function getOneById(bookId, callback) {
    const getOneById = `
      SELECT *
      FROM books
      WHERE id = $1;
    `;

    db.query(getOneById, [bookId])
      .then(result => callback(result.rows[0]))
      .catch(console.error);
  }

  function createOneBook(newBook, callback) {
    const { title, type, author, topic, publicationdate } = newBook;

    const sql = `
      INSERT INTO books
        (title, type, author, topic, publicationdate)
      VALUES
        ($1, $2, $3, $4, $5 )
    `;

    db.client(sql, [title, type, author, topic, publicationdate])
      .then(result => {
        callback(result.rows[0]);
      })
      .catch();
  }

  function updateById(bookId, updatedBook, callback) {
    const { title, type, author, topic, publicationdate } = updatedBook;

    const sql = `
      UPDATE books
      SET 
        title = $1,
        type = $2,
        author = $3,
        topic = $4,
        publicationdate = $5
      WHERE id = $6
      RETURNING *;
      `;
    db.query(sql, [title, type, author, topic, publicationdate, bookId])
      .then(result => {
        callback(result.rows[0]);
      })
      .catch(error => callback(null, error));
  }

  createTable();
  mockData();

  return { getAllBooks, getOneById, createOneBook, updateById };
}

module.exports = Book;
