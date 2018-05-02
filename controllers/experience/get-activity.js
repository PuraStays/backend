/**
 * GET activity
 */
const mysql = require('mysql');
var q = require('q');

function getConnection() {
    var deferred = q.defer();

    var connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'sanghu',
        password: 'sanghu',
        database: 'purastays'
    });

    connection.connect(function (err) {
        if (err) {
            console.error(err);
            deferred.reject(err);
        }
        //console.log('[CONN] – Connection created with id:'+ connection.threadId);
        deferred.resolve(connection);
    });

    return deferred.promise;
}

function prepareQuery(query, parameters){
    if(!query || !parameters) {
        throw  new Error('query and parameters function parameters should be specified.');
    }
    return mysql.format(query, parameters);
}

// var getActivityById = function(id) {
// 	var params = [id];

// 	//program id from program groups in resort table
// 	var qry = 'SELECT id, Activity_Name, About_Activity_Description, gallery_id, Min_Time, Max_Time  from activities where id = ?';
// 	return query(mysql.format(qry, params)).then(function (results) {
// 		return results[0];
// 	});
// }

function getActivityById(id) {
    var deferred = q.defer();
    getConnection().then(function(connection) {
    	var qry = 'SELECT id, Activity_Name, About_Activity_Description, gallery_id, Min_Time, Max_Time  from activities where id ='+id;
        connection.query(qry, function (error, results) {
            if (error) {                    
                deferred.reject(error);
            }
            if(results.length == 0) {
            	deferred.resolve({
            		"data": null
            	});
            } else {
            	deferred.resolve(results);
            }
        });
        connection.end();
    }).fail(function (err) {
        console.error(JSON.stringify(err));
        deferred.reject(err);
    });
    return deferred.promise;
}

module.exports = (req, res) => {
	if(req.params.activity_id) {
		getActivityById(req.params.activity_id).then(function(results) {
			console.log(results.data)
			if(results.data === null) {
				res.json({data: "no activity found"});				
			} else {		
				res.setHeader("Content-Type", "application/json");
                                res.header("Access-Control-Allow-Origin", "*");
                                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");	
                                res.status(200).json({data: results[0]});
			}
		})
	} else {
		res.json({
			data: {
				error: "true",
				errorMessage: "Please specify activity id"
			}
		});
	}
}
