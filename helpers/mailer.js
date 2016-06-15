"use strict";
const nodemailer = require('nodemailer');
const EmailTemplate = require('email-templates').EmailTemplate;
const path = require('path');
const q = require('q');

const Mailer = module.exports = {

  send : function(content) {
    // transporter config
    const relayConfig = {
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER ,
        pass: process.env.SMTP_PSW
      }
    };
    // create transporter
    let transporter = nodemailer.createTransport(relayConfig);
    // setup e-mail data with unicode symbols
    let mailOptions = {
      from: 'Flow RSS<oscarchine@sickdevelopers.com>', // sender address
      to: 'oscarchine@gmail.com', // list of receivers
      subject: 'Oscar Weekly Digest', // Subject line
      text: 'Hello world 🐴', // plaintext body
      html: content.html // html body
    };
    // verify connection
    return transporter.verify()
      .then(() => {
        // send mail with defined transport object
        return transporter.sendMail(mailOptions);
      });
  },

  prepareMailTemplate : function(user, flow) {
    let templateDir = path.join(__dirname , '../templates', 'flow-email');
    let userFlowTemplate = new EmailTemplate(templateDir);
    let deferred = q.defer();

    return userFlowTemplate.render(flow);
  }

}
