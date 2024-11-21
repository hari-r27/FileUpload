const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const bodyParser = require("body-parser");
const File = require("./Models/filemodel");

const app = express();

const upload = multer(); 

app.use(bodyParser.json());

mongoose
    .connect("mongodb://localhost:27017/filedb", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
    app.post("/upload", upload.single("file"), async (req, res) => {
        try {
            const file = req.file;
    
            if (!file) {
                return res.status(400).send("No file uploaded.");
            }
    
            // Save file to MongoDB
            const newFile = new File({
                name: file.originalname,
                type: file.mimetype,
                data: file.buffer,
            });
    
            await newFile.save();
            res.send("File uploaded and saved in the database!");
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error.");
        }
    });

    app.listen(5000, () => console.log("Server running on http://localhost:5000"));
