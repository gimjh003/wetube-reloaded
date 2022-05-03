import express from "express"
// const express = require("express");

const PORT = 4000;

const app = express();

app.get("/", (req, res) => res.send("<h1>Hello, World!</h1>"));

const handleListening = () => console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);