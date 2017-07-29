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

const env = process.env.NODE_ENV || 'development';
const dbconfig = require('./config/config')[env];

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
 * Connect to MongoDB.
 */

/**
 * Connect to mysql
 */
var connection = mysql.createConnection(dbconfig.mysql);
connection.connect((err)=> { if(err) { throw err}});

 /**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/**
 * Website routes
 */
//test api
app.get('/api', function(req, res) {
	res.json({data: "success"});
});

// Experience routes
app.get('/api/experience', function(req, res) {
	connection.query('SELECT id, programs_id from resorts', function (error, results, fields) {
	   if (error) throw error;
	   console.log()
	   res.json({data: results})
	});
});

app.get('/api/experience/:resort_id', experience.getExperiences);


/**
 * Booking routes
 */


 /**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env')); 
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;