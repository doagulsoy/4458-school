const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sql = require("mssql");
const getConnection = require("../../connection/config");
const secretKey = process.env.secretKey;

const app = express();
app.use(express.json()); // To parse JSON request bodies
app.use(cors()); // To enable Cross-Origin Resource Sharing


//get all students from database
app.get("/getStudents", async (req, res) => {
  try {
    const connection = await getConnection();
    const request = new sql.Request(connection);

    const result = await request.query("SELECT * FROM dbo.Student");
    //cast id to string
    result.recordset.forEach((student) => {
      student.id = student.id.toString();
    });
    const students = result.recordset;
    return res.send(students);
  } catch (err) {
    console.error("Error while fetching students:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to get a student by ID
app.get("/:id", async (req, res) => {
  try {
    const connection = await getConnection(); // Ensure you have a valid connection
    const request = new sql.Request(connection); // Create a new request with the connection

    request.input("id", sql.NVARCHAR(25), req.params.id); // Explicitly define the parameter

    const result = await request.query("SELECT * FROM dbo.Student WHERE id = @id");
    
    if (result.recordset.length === 0) {
      return res.status(404).send("Student not found");
    }

    res.send(result.recordset); // Return the recordset
  } catch (err) {
    console.error("Error while fetching student:", err);
    return res.status(500).send("Internal Server Error");
  }
});

// Endpoint to add a new student
app.post("/add", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address } = req.body;

    if (!firstName || !lastName || !email) {
      // Check if required fields are provided
      return res.status(400).send("Missing required fields");
    }

    const connection = await getConnection(); // Ensure you have a valid connection
    const request = new sql.Request(connection); // Create a new request with the connection

    // Define parameters for the INSERT query
    request.input("firstName", sql.NVARCHAR(50), firstName);
    request.input("lastName", sql.NVARCHAR(50), lastName);
    request.input("email", sql.NVARCHAR(100), email);
    request.input("phone", sql.NVARCHAR(20), phone || null); // Default to null if not provided
    request.input("address", sql.NVARCHAR(255), address || null); // Default to null if not provided

    await request.query(`
      INSERT INTO dbo.Student (firstName, lastName, email, phone, address)
      VALUES (@firstName, @lastName, @email, @phone, @address)
    `);

    res.status(200).send("Student added successfully");
  } catch (err) {
    console.error("Error while adding student:", err);
    return res.status(500).send("Internal Server Error");
  }
});

// Endpoint to add a new course
app.post("/addCourse", async (req, res) => {
  try {
    const { name, description, credits } = req.body;
    const connection = await getConnection(); // Ensure you have a valid connection
    const request = new sql.Request(connection); // Create a new request with the connection

    request.input("name", sql.NVARCHAR(100), name);
    request.input("description", sql.NVARCHAR(255), description);
    request.input("credits", sql.INT, credits);

    await request.query(`
      INSERT INTO dbo.Course (name, description, credits)
      VALUES (@name, @description, @credits)
    `);

    res.status(200).send("Course added successfully");
  } catch (err) {
    console.error("Error while adding course:", err);
    return res.status(500).send("Internal Server Error");
  }
});

// Endpoint to fetch all courses
// Endpoint to fetch all courses
app.get("/courses", async (req, res) => {
  try {
    const connection = await getConnection();
    const request = new sql.Request(connection);

    const result = await request.query("SELECT * FROM dbo.Course"); 
    //cast id to string
    result.recordset.forEach((course) => {
      course.id = course.id.toString();
    });
    const courses = result.recordset;
    return res.send(courses);
  } catch (err) {
    console.error("Error while fetching courses:", err);
    res.status(500).send("Internal Server Error");
  }
});



// Endpoint to add a new instructor
app.post("/addInstructor", async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    const connection = await getConnection(); // Ensure you have a valid connection
    const request = new sql.Request(connection); // Create a new request with the connection

    request.input("firstName", sql.NVARCHAR(50), firstName);
    request.input("lastName", sql.NVARCHAR(50), lastName);
    request.input("email", sql.NVARCHAR(100), email);
    request.input("phone", sql.NVARCHAR(20), phone);

    await request.query(`
      INSERT INTO dbo.Instructor (firstName, lastName, email, phone)
      VALUES (@firstName, @lastName, @email, @phone)
    `);

    res.status(200).send("Instructor added successfully");
  } catch (err) {
    console.error("Error while adding instructor:", err);
    return res.status(500).send("Internal Server Error");
  }
});

// Endpoint to register a student to a course
app.post("/register", async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    const connection = await getConnection(); // Ensure you have a valid connection
    const request = new sql.Request(connection); // Create a new request with the connection

    request.input("studentId", sql.NVARCHAR(25), studentId);
    request.input("courseId", sql.NVARCHAR(25), courseId);

    await request.query(`
      INSERT INTO dbo.Registration (studentId, courseId)
      VALUES (@studentId, @courseId)
    `);

    res.status(200).send("Student registered successfully");
  } catch (err) {
    console.error("Error while registering student:", err);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = app;
