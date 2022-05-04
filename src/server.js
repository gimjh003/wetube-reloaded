import express from "express"
// const express = require("express");

const PORT = 4000;

const app = express();

const urlLogger = (req, res, next) => {
    console.log(`Path: ${req.path}`);
    next();
  };
  
  const timeLogger = (req, res, next) => {
    const time = new Date();
    console.log(`Time: ${time.getFullYear()}.${time.getMonth()+1}.${time.getDate()}`);
    next();
  };
  
  const securityLogger = (req, res, next) => {
    if(req.protocol==="https") console.log("Secure");
    else console.log("Insecure");
    next();
  };
  
  const protector = (req, res, next) => {
    if (req.path === "/protected") return res.end();
    next();
  };
  
  app.use(urlLogger, timeLogger, securityLogger, protector);
  
  app.get("/", (req, res) => res.send("<h1>Home</h1>"));
  app.get("/protected", (req, res) => res.send("<h1>Protected</h1>"));

const handleListening = () => console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);