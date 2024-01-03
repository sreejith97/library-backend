const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());

const makeConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      port: 3306,
      password: "Sreejith*166",
      database: "library",
    });

    console.log("connected");
    return connection;
  } catch (error) {
    console.log("error in connecting to the database", error);
    throw error;
  }
};

app.use(express.json());

// 1. API to create a author

app.post("/create-author", async (req, res) => {
  try {
    const connection = await makeConnection();
    const { authorName, birthYear, nationality } = req.body;

    const insertQuery =
      "INSERT INTO AUTHORS (authorName, birthYear, nationality) VALUE(?, ? ,?)";

    const [result] = await connection.execute(insertQuery, [
      authorName,
      birthYear,
      nationality,
    ]);
    connection.end();
    res.json({
      message: "Auhtor created Sucessfull",
      authorId: result.insertId,
    });
  } catch (error) {
    console.log("Error in creating new Author", error);
    res.status(500).json({ error: "Internl Err in adding new author" });
  }
});

// 2. API to get all the authors

app.get("/get-all-authors", async (req, res) => {
  try {
    const connection = await makeConnection();
    const getQuery = "SELECT * FROM AUTHORS";
    const [results] = await connection.execute(getQuery);
    connection.end();
    res.json(results);
  } catch (error) {
    console.log("Error in reading data", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/get-all-books", async (req, res) => {
  try {
    const connection = await makeConnection();
    const getQuery = "SELECT * FROM books";
    const [results] = await connection.execute(getQuery);
    connection.end();
    res.json(results);
  } catch (error) {
    console.log("Error in reading data", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 3. API to create Book

app.post("/create-book", async (req, res) => {
  try {
    const connection = await makeConnection();
    const { title, ISBN, publicationYear, authorId } = req.body;
    const createQuery =
      "INSERT INTO books (title, ISBN, publicationYear, authorId) VALUES (?,?,?,?)";
    const [result] = await connection.execute(createQuery, [
      title,
      ISBN,
      publicationYear,
      authorId,
    ]);

    connection.end();
    res.json({
      message: "sucessfully added new book details",
      bookId: result.insertId,
    });
  } catch (error) {
    console.log("Error in creating new Book details", error);
    res.status(500).json({ error: "Internl Err in adding book" });
  }
});

app.listen(port, () => {
  console.log(`Server  is runnig on the port: ${port}`);
});
