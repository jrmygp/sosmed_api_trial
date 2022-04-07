const nodemailer = require("nodemailer")

const transport = nodemailer.createTransport({
    auth: {
        user: "jeremyPWD17@gmail.com",
        pass: "jeremy7410821"
    },
    host: "smtp.gmail.com",
})

const mailer = async ({
    subject,
    to,
    text,
    html
}) => {
    await transport.sendMail({
        subject: subject || "Test subject",
        to: to || "fat.snorlax17@gmail.com",
        text: text || "Test nodemailer mashokkk",
        html: html || "<h1>This is sent from Jay's API</h1>",
    })
}

module.exports = mailer