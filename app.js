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
const expressStatusMonitor = require('express-status-monitor');
const Promise = require('bluebird');

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
app.use(expressStatusMonitor());

/**
 * Website routes
 */
//test api
app.get('/api', (req, res) => {
	res.json({data: "success"});
});

// get experiences
app.get('/api/experience/:resort_id', experience.getExperiences);


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
