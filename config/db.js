const mysql = require('mysql');
const Promise = require('bluebird');
const env = process.env.NODE_ENV || 'development';
const dbconfig = require('./config')[env];
let using = Promise.using;
Promise.promisifyAll(require('mysql/lib/Connection').prototype);
Promise.promisifyAll(require('mysql/lib/Pool').prototype);

let pool = mysql.createPool(dbconfig.mysql);

let getConnection = function () {
 return pool.getConnectionAsync().disposer(function (connection) {
 return connection.destroy();
 });
};

var query = function (command) {
 return using(getConnection(), function (connection) {
 return connection.queryAsync(command);
 });
};

module.exports = {
 query: query
};

//var pool = mysql.createPool(dbconfig.mysql);
//pool.connect((err)=> { if(err) { throw err}});

//module.exports.connect = connection;



