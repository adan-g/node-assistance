const nodemailer = require('nodemailer');
const juice = ('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');
const ejs = require('ejs')
const fs = require('fs');


async function main() {

let transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user, 
      pass: emailConfig.password,
    },
});


const generateHTML = (file, options = {}) => {
  let templateString = fs.readFileSync(`${__dirname}/../views/emails/${file}.ejs`, 'utf-8');
  return html = ejs.render(templateString, options);
}


exports.send = async(options) => {
  let info = await transporter.sendMail({
      from: 'Assistance <no-reply@assistance.com>', 
      to: options.user.email, 
      subject: options.subject,
      html: generateHTML(options.file, options)
  });
}

}


main().catch(console.error);