require("dotenv").config();
const verifyToken = require("./middleware/verifyToken");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const db = require("./db/db");
const { users, todos } = require("./db/schema");

const { eq } = require("drizzle-orm");

const app = express();

app.use(cors());
app.use(express.json());

const SECRET = "REDACTED_JWT_SECRET";
app.get("/todos", verifyToken, async (req, res) => {

  const userTodos = await db
    .select()
    .from(todos)
    .where(eq(todos.userId, req.user.userId));

  res.json(userTodos);

});