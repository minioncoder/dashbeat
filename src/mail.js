'use strict';

import nodemailer from 'nodemailer';

import { smtp, admins } from '../config';

var transporter;
if (smtp && smtp.service) {
	transporter = nodemailer.createTransport(smtp);
}

var mailOptions = {
  from: 'Dashbeat <ebower@michigan.com>',
  subject: 'Dashbeat Error Alert',
  to: 'ebower@michigan.com'
};

module.exports = { transporter, mailOptions };