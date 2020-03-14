/**
 * Module dependencies.
 */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const dotenv = require('dotenv').load();
const mongoose = require('mongoose');
const mysql = require('mysql');
const passport = require('passport');
//const expressStatusMonitor = require('express-status-monitor');
const Promise = require('bluebird');
const nodemailer = require('nodemailer');

/**
 * Connect to MongoDB.
 */

/**
 * Connect to mysql
 */
//const mysqlDb = require('./config/db');

/**
 * Route controller
 */
const experience = require('./controllers/experience');

 /**
 * API keys and Passport configuration.
 */

 /**
 * Create Express server.
 */
const app = express();


 /**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//app.use(expressStatusMonitor());

/**
 * Website routes
 */
//test api
app.get('/api', (req, res) => {
	res.json({data: "success"});
});

// get experiences
app.get('/api/experience/:resort_id', experience.getExperiences);
app.get('/api/activity/:activity_id', experience.getActivity);


//request a callback endpoint
app.post('/api/web/request_callback', (req, res) => {
  var user = {
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile
  };
  nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
	 service: 'gmail',
	 auth: {
	        user: 'ranjanui@gmail.com',
	        pass: 'ranjansapna'
	    }
	});

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"ranjanui 👻" <ranjanui@gmail.com>', // sender address
        to: 'info@purastays.com', // list of receivers
        cc: 'amit.mahajan@purastays.com',
        bcc: 'kumar.ranjan89@gmail.com',
        subject: 'New Enquiry from www.purastays.com ✔', // Subject line
        text: 'plain text message', // plain text body
        html: `
        	<!DOCTYPE html>
			<html>
			<head>
				<title>Purastays</title>
			</head>
			<body>
			<table style="width: 600px; width: 600px" border="0">
				<tr>
					<td>
						<div>
							<div>
								<div style="padding: 50px 50px 20px; background-color: #eca72e; text-align: center;">
									<img src="http://www.purastays.com/mailer/1/emailer-envelope.png" alt="purastays">
									<div>
										<p style="font-size: 32px; font-weight: lighter; color: #fff; line-height: 45px; margin:10px 0 0">Congratulations!!!</p>
										<p style="font-size: 22px; font-weight: lighter; color: #fff; line-height: 32px; margin:0">You have got a New customer Enquiry from</p>
										<a style="font-size: 20px; line-height: 26px; color: #fff;" href="http://www.purastays.com" target="_blank">www.purastays.com</a>
									</div>
								</div>
								
							</div>
							<div style="border:1px solid #ededed; padding: 40px; font-size: 16px; line-height: 24px; color: #2f3c42;">
								<p style="font-size: 16px; line-height: 24px; color: #2f3c42;">Hi Team,</p>
								<p style="font-size: 16px; line-height: 24px; color: #2f3c42;">You have got a new enquiry from website www.purastays.com, please find the enquiry details below:</p>
								<table style="width: 100%; border-collapse: collapse; margin: 30px 0 40px;">
									<tr style="border: 1px solid #ededed">
										<td style="padding: 5px 10px;border-right: 1px solid #ededed;font-size: 16px; line-height: 24px; color: #2f3c42;">Name</td>
										<td style="padding: 5px 10px;font-size: 16px; line-height: 24px; color: #2f3c42;">${user.name}</td>
									</tr>
									<tr style="border: 1px solid #ededed">
										<td style="padding: 5px 10px;border-right: 1px solid #ededed;font-size: 16px; line-height: 24px; color: #2f3c42;">Email id</td>
										<td style="padding: 5px 10px;font-size: 16px; line-height: 24px; color: #2f3c42; text-decoration: none">${user.email}</td>
									</tr>
									<tr style="border: 1px solid #ededed">
										<td style="padding: 5px 10px;border-right: 1px solid #ededed;font-size: 16px; line-height: 24px; color: #2f3c42;">Mobile</td>
										<td style="padding: 5px 10px;font-size: 16px; line-height: 24px; color: #2f3c42;">${user.mobile}</td>
									</tr>
								</table>
							</div>
							<div style="background: #2f3c42; height: 10px;"></div>
						</div>
					</td>
				</tr>
			</table>	
			</body>
			</html>
        `
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        res.json({
          status: true,
          message: "your query succssfully submitted"
       });
    });
});
});

/**
 * Booking routes
 */


 /**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.white('✓'), app.get('port'), chalk.red(app.get('env'))); 
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
