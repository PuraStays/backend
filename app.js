/**
 * Module dependencies.
 */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const mysql = require('mysql');
const passport = require('passport');

/**
 * Route controller
 */


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
app.get('/', function(req, res) {
	res.json({data: "success"});
});


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