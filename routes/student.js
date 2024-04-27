const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const secretKey = "secretKey";

const sql = require("mssql");
const { get } = require("http");

app.get("/:id", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send("No token provided");
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secretKey);

    const request = new sql.Request();
    const result = await request.query(
      `SELECT * FROM [dbo].[student] WHERE id = @id`,
      { id: req.params.id }
    );
    res.send(result.recordset);
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).send("Invalid token");
    }
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

app.post("/payTuition", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send("No token provided");
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secretKey);

    const { studentId, termId } = req.body;
    // Implement payment logic and update the database accordingly
    // Example: Record payment for the given student and term

    return res.send({ status: "Successful" }); // Placeholder response
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).send("Invalid token");
    }
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

app.post("/addTuition", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send("No token provided");
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secretKey);

    const { studentId, termId } = req.body;
    // Implement logic to add tuition for the given student and term
    // Example: Update the database with the tuition amount

    return res.send({ status: "Added" }); // Placeholder response
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).send("Invalid token");
    }
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

app.get("/unpaidTuition", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send("No token provided");
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secretKey);

    const request = new sql.Request();
    const result = await request.query(
      `SELECT * FROM [dbo].[student] WHERE unpaid_tuition > 0`
    );
    res.send(result.recordset);
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).send("Invalid token");
    }
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = app;
