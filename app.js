const express = require("express");
const app = express();
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const studentRouter = require("./routes/student");
const getConnection = require("./connection/config");
const bodyParser = require("body-parser");
const PORT = 5001;

let pool = null;

async function dbConnectionMiddleware(req, res, next) {
  try {
    if (pool == null) {
      pool = await getConnection();
      console.log("Database connected!");
    }
    next();
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).send("Internal Server Error");
  }
}

app.get("/", async (req, res) => {
  res.status(200).send("API Server is running!");
});

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(express.json());
app.use(dbConnectionMiddleware);
app.use("/student", studentRouter);


if (process.env.VERCEL == "1") {
} else {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}


module.exports = app;
