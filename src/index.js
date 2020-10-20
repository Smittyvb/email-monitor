const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const mailparser = require("mailparser");
const sendOutbound = require("./sendOutbound");

const app = express();

let config;
try {
    config = require("../config.js");
} catch (e) {
    console.log("Falling back to example config! Only do this for testing purposes.");
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
    [...checks.filter(sentCheck => sentCheck.to === check.to)].reverse().map(sentCheck =>
`\
  Check at ${new Date(sentCheck.at).toLocaleString("en-CA")}: ${sentCheck.status}
`).join("")}`)}`;
    res.contentType("text/plain")
    res.send(text);
});

async function sendCheck(check) {
    const toSend = {
        ...check,
        at: Date.now(),
        status: "pending"
    };
    checks.push(toSend);
    await sendOutbound(check.to, "email-monitor check", JSON.stringify(toSend));
}

async function handleInbound(email) {
    const parsedEmail = await mailparser.simpleParser(email, {
        skipTextToHtml: true,
        skipTextLinks: true,
    });
    console.log(parsedEmail.text);
    const firstMatch = parsedEmail.text.match(/<=mailcheck=>(.*)<=mailcheck=>/s);
    if (firstMatch) {
        const contents = firstMatch[1];
        let json;
        try {
            json = JSON.parse(contents);
        } catch (e) {
            console.log("got invalid JSON", json);
            return;
        }
        if (!json.orig) return console.log("no orig");
        const checksIdxData = checks
            .map((check, idx) => ({ ...check, idx }))
            .filter(check => (check.to === json.orig.to) && (check.at === json.orig.at))[0];
        if (!checksIdxData) return console.log("ignoring check with invalid orig");
        checks[checksIdxData.idx].status = "good";
        checks[checksIdxData.idx].roundTripDuration = Date.now() - json.orig.to;
        checks[checksIdxData.idx].received = json;
    } else {
        console.log("couldn't find <=mailcheck=>");
    }
}

setInterval(() => {
    config.checks.forEach(check => {
        const matching = checks.filter(sentCheck => sentCheck.to === check.to).sort((a, b) => a.time - b.time).reverse();
        if (matching.length === 0) {
            console.log("checking since never checked");
            sendCheck(check);
        } else {
            const gap = Date.now() - matching[0].at;
            console.log("check", gap, check.interval);
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
            handleInbound(email);
            fs.unlinkSync(`/var/spool/haraka/quarantine/${quarDir}/${emailPath}`);
        })
    });
}, 10000);

app.listen(80);
