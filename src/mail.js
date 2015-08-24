'use strict';

import nodemailer from 'nodemailer';

import { smtp, admins } from '../config';

var mailTo
if (typeof admins === 'undefined') {
  mailTo = ['ebower@michigan.com'];
} else {
  mailTo = admins;
}

var transporter;
if (smtp && smtp.service) {
	transporter = nodemailer.createTransport(smtp);
}

var mailOptions = {
  from: 'Dashbeat <ebower@michigan.com>',
  subject: 'Dashbeat Error Alert',
  to: mailTo.join()
};

module.exports = { transporter, mailOptions };
