const express = require("express");
const bodyParser = require("body-parser");

const app = express();

let config;
try {
    config = require("../config.js");
} catch (e) {
    console.warn("Falling back to example config! Only do this for testing purposes.");
    config = require("../config.example.js");
}

// Example check script
app.post("/sg", bodyParser.text(), (req, res) => {
    console.log("inbound from SG", req.body);
    res.status(204).send();
});

app.listen(8082);
