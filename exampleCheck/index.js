const express = require("express");
const bodyParser = require("body-parser");
const sgMail = require("@sendgrid/mail");
const fs = require("fs");

// assumes we're running on same host as backend, in practice change this to the backend's hostname
const HOSTNAME = fs.readFileSync("/etc/hostname", "utf-8").trim();

let config;
try {
    config = require("../config.js");
} catch (e) {
    console.warn("Falling back to example config! Only do this for testing purposes.");
    config = require("../config.example.js");
}

sgMail.setApiKey(config.sgKey);

const app = express();

// Example check script
app.post("/sg", bodyParser.text({type: "*/*"}), async (req, res) => {
    console.log("inbound from SG");
    res.status(204).send();
    // lazy way to extract json
    let sentJson = req.body.match(/Content-Disposition: form-data; name="text"(\n|\r)*(.*)/);
    if (sentJson) {
        sentJson = sentJson[2];
    } else {
        return console.log("regex fail", req.body);
    }
    let json;
    try {
        json = JSON.parse(sentJson);
    } catch (e) {
        console.log("failed to parse", sentJson);
        return;
    }
    console.log("got json", sentJson);
    const msg = {
        to: `emon@${HOSTNAME}`,
        from: "emon-send@sg.upbuddy.smitop.com", // Use the email address or domain you verified with Sendgrid
        subject: "Emon response",
        text: "<=mailcheck=>" + JSON.stringify({
            responseTime: Date.now(),
            orig: json,
        }) + "<=mailcheck=>",
    };
    const sendResult = await sgMail.send(msg);
    console.log("sendResult", sendResult);
});

app.listen(8082);
