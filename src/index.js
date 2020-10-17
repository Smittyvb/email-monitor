const express = require("express");
const bodyParser = require("body-parser");

const app = express();

let config;
try {
    config = require("../config.json");
} catch (e) {
    console.warn("Falling back to example config! Only do this for testing purposes.");
    config = require("../config.example.json");
}

console.log("Started email-monitor backend");

app.get("/", (req, res) => {
    res.send("Soon you will see some stats here or whatever");
});

app.post("/nfsn", bodyParser.text(), (req, res) => {
    console.log("NFSN body", req.body);
});
