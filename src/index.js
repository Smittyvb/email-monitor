const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();

let config;
try {
    config = require("../config.js");
} catch (e) {
    console.warn("Falling back to example config! Only do this for testing purposes.");
    config = require("../config.example.js");
}

let checks;
try {
    checks = require("../checks.json");
} catch (e) {
    checks = [];
}

console.log("Started email-monitor backend");

app.get("/", (req, res) => {
    const text = 
`\
email-monitor
=============

Current checks:
${
    config.checks.map(check => 
`\
To: ${check.to}, inteval: every ${check.interval} milliseconds${
    checks.filter(sentCheck => sentCheck.to === check.to).map(sentCheck =>
`\
  Check at ${sentCheck.time}: ${sentCheck.status}`)}`)}`;
    res.text(text);
});

async function sendCheck(check) {
    console.log("pretending to send check...");
    checks.push({
        ...check,
        time: check.time,
    });
    fs.writeFileSync("../checks.json", JSON.stringify(checks));
}

setInterval(() => {
    config.checks.forEach(check => {
        const matching = checks.filter(sentCheck => sendCheck.to === check).sort((a, b) => a.time - b.time).reverse();
        if (matching.length === 0) {
            sendCheck(check);
        } else {
            const gap = Date.now() - matching[0].time;
            if (gap > check.interval) sendCheck(check);
        }
    });
}, 10000);
