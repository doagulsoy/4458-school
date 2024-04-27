const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const secretKey = process.env.secretKey;

const sql = require("mssql");
const { get } = require("http");

app.get("/:id", async (req, res) => {
  try {
    const request = new sql.Request();
    const result = await request.query(
      `SELECT * FROM [dbo].[student] WHERE id = @id`,
      { id: req.params.id }
    );
    res.send(result.recordset);
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
});

app.post("/add", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address } = req.body;
    const request = new sql.Request();
    const result = await request.query(
      `INSERT INTO [dbo].[student] (firstName, lastName, email, phone, address) VALUES (@firstName, @lastName, @email, @phone, @address)
      `,
      { firstName, lastName, email, phone, address }
    );
    res.status(200).send("Student added successfully");
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
});


app.post("/addCourse", async (req, res) => {
  try {
    const { name, description, credits } = req.body;
    const request = new sql.Request();
    const result = await request.query(
      `INSERT INTO [dbo].[course] (name, description, credits) VALUES (@name, @description, @credits)
      `,
      { name, description, credits }
    );
    res.status(200).send("Course added successfully");
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
});

app.get("/courses", async (req, res) => {
  try {
    const request = new sql.Request();
    const result = await request.query(`SELECT * FROM [dbo].[course]`);
    res.send(result.recordset);
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
});

app.post("/addInstructor", async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    const request = new sql.Request();
    const result = await request.query(
      `INSERT INTO [dbo].[instructor] (firstName, lastName, email, phone) VALUES (@firstName, @lastName, @email, @phone)
      `,
      { firstName, lastName, email, phone }
    );
    res.status(200).send("Instructor added successfully");
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
});

app.post("/register", async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    const request = new sql.Request();
    const result = await request.query(
      `INSERT INTO [dbo].[registration] (studentId, courseId) VALUES (@studentId, @courseId)
      `,
      { studentId, courseId }
    );
    res.status(200).send("Student registered successfully");
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = app;
