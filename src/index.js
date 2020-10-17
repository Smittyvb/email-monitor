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
To: ${check.to}, inteval: every ${check.interval} milliseconds\n${
    checks.filter(sentCheck => sentCheck.to === check.to).map(sentCheck =>
`\
  Check at ${sentCheck.at}: ${sentCheck.status}
`).join("")}`)}`;
    res.contentType("text/plain")
    res.send(text);
});

async function sendCheck(check) {
    console.log("pretending to send check...");
    checks.push({
        ...check,
        at: Date.now(),
        status: "sent"
    });
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
        fs.writeFileSync("../checks.json", JSON.stringify(checks));
    });
    const quarDirs = fs.readdirSync("/var/spool/haraka/quarantine").filter(dir => dir !== "tmp");
    quarDirs.forEach(quarDir => {
        const emails = fs.readdirSync("/var/spool/haraka/quarantine/" + quarDir);
        emails.forEach(emailPath => {
            const email = fs.readFileSync(`/var/spool/haraka/quarantine/${quarDir}/${emailPath}`, "utf-8");
            console.log("got email", email);
            fs.unlinkSync(`/var/spool/haraka/quarantine/${quarDir}/${emailPath}`);
        })
    });
}, 10000);


app.listen(8080);