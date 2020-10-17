const fs = require("fs");
const nodemailer = require("nodemailer");

const HAR_USER = "emon";
const HAR_PW = fs.readFileSync(__dirname + "/../harakapw.txt", "utf-8").trim();
const HOSTNAME = fs.readFileSync("/etc/hostname", "utf-8").trim();

async function sendOutbound(toEmail, subject, body) {
    let transporter = nodemailer.createTransport({
        host: "localhost",
        port: 25,
        secure: false,
        auth: {
            user: HAR_USER,
            pass: HAR_PW,
        },
    });
    let info = await transporter.sendMail({
        from: `"Email monitor" <emon@${HOSTNAME}>`, // sender address
        to: toEmail, // list of receivers
        subject: subject, // Subject line
        text: body, // plain text body
        html: body, // html body
    });

    console.log("Message sent: %s", info.messageId);

}

module.exports = sendOutbound;
