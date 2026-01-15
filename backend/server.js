// backend/server.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const upload = multer({ dest: uploadDir });

// health
app.get("/", (req, res) => res.send("SecureVault backend"));

// upload encrypted file (stores as-is)
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ savedName: req.file.filename, originalName: req.file.originalname });
});

// download by filename (savedName)
app.get("/download/:savedName", (req, res) => {
  const filePath = path.join(uploadDir, req.params.savedName);
  if (!fs.existsSync(filePath)) return res.status(404).send("Not found");
  res.download(filePath, req.params.savedName);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on http://localhost:" + PORT));
