/**
 * GET activity
 */
const mysql = require('mysql');
const query = require('../../config/db').query;
const Promise = require('bluebird');

var getActivityById = function(id) {
	var params = [id];

	//program id from program groups in resort table
	var qry = 'SELECT id, Activity_Name, About_Activity_Description, gallery_id, Min_Time, Max_Time  from activities where id = ?';
	return query(mysql.format(qry, params)).then(function (results) {
		return results[0];
	});
}

module.exports = (req, res) => {
	getActivityById(req.params.activity_id).then(function(results) {
		res.json({data: results});
	})
}