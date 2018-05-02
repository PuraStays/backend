/**
 * GET experiences
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

/**
 * Utilities
 * Comma separated string id to id of array
 * Input-> 1, 2, 3, 4,
 * Output-> [1, 2, 3, 4]
 */
function stringToArray(str) {
	var arr = (str.replace(/,\s*$/, '')).split(",").map(function(item) {
        return parseInt(item, 10);
    });
	return arr;
}

/**
 * Combine group to a single array with with unique programs among all programs group
 */
function combineGroup(groups) {
	var finalString = "";
    for(var key in groups[0]) {    	
        if(/^Group/.test(key)) {
            var programsGrpArrStr = groups[0][key];
            finalString = finalString.concat(programsGrpArrStr);
        }
    }

    //convert comma separated string to array       
    var groupArray = (finalString.replace(/,\s*$/, '')).split(",").map(function(item) {
       return parseInt(item, 10);
    });
    
	//removing duplicate item in array, same program in different group
    groupArray = groupArray.filter((elem, index, self) => {
        return index == self.indexOf(elem);
    });
	return groupArray;
}


/**
 * format programs group to unique array
 */

function formatProgramArrayGroup(arr) {	
	var programsArr = [];
	var program_grp_ids;
	arr.forEach(function(item, index) {
		var program = {};
		program.program_title = item[0].Program_Title;
		program.program_id = item[0].id;
		program.description = item[0].Program_Details;
		program.program_grp_ids = combineGroup(item);
		getActivitiesId(program.program_grp_ids).then(function(results) {
			program.activities_id = results[0][0].activities_id;		
		});		
		programsArr.push(program);		
	});
	return programsArr;
}

/**
 * Select from resorts table to get array of programs id
 */
function getResort(id) {
    var deferred = q.defer();
    getConnection().then(function(connection) {
    	var qry = 'SELECT id, Resort_Name, programs_id FROM resorts where id='+id;
        connection.query(qry, function (error, results) {
            if (error) {                    
                deferred.reject(error);
            }
            if(results.length == 0) {
            	deferred.resolve({
            		"data": "null"
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

/**
 * Select from stayprograms table to get programs details and returns stayprogramsgroups
 */
function getProgramsId(arr) {	
	var promises = [];
	arr.forEach(function(id) {
		var deferred = q.defer();
		getConnection().then(function(connection) {
			var qry = 'SELECT id, Program_Title, Program_Details, Group1, Group2, Group3, Group4, Group5 from stayprograms where id='+id;
			connection.query(qry, function (error, results) {
	            if (error) {                    
	                deferred.reject(error);
	            }
	            deferred.resolve(results);	            
	        });
	        connection.end();
		}).fail(function (err) {
			console.log(JSON.stringify(err));
			deferred.reject(err);		
		})
		promises.push(deferred.promise);
	})
	return q.all(promises);
}

/**
 * select activity id from stayprogramsgroups
 */
function getActivityId(id) {	
	var deferred = q.defer();
	getConnection().then(function(connection) {
		var qry = 'SELECT activities_id from stayprogramsgroups where id='+id;
		connection.query(qry, function (error, results) {
            if (error) {                    
                deferred.reject(error);
            }
            deferred.resolve(results);	            
        });
        connection.end();
	}).fail(function (err) {
		console.log(JSON.stringify(err));
		deferred.reject(err);		
	})
	return deferred.promise;
}


/**
 * get activities id
 */
function getActivitiesId(arr) {
	var promises = [];
	arr.forEach(function(id) {
		var deferred = q.defer();
		getConnection().then(function(connection) {
			var qry = 'SELECT activities_id from stayprogramsgroups where id='+id;
			connection.query(qry, function (error, results) {
	            if (error) {                    
	                deferred.reject(error);
	            }
	            deferred.resolve(results);	            
	        });
	        connection.end();
		}).fail(function (err) {
			console.log(JSON.stringify(err));
			deferred.reject(err);		
		})
		promises.push(deferred.promise);
	})
	return q.all(promises);
}

function addingActivityId(obj) {
	var promises = [];
	var programsArr = obj.programs;
	programsArr.forEach(function(item, index) {		
		var deferred = q.defer();
		getActivitiesId(item.program_grp_ids).then(function(results) {
			obj.programs[index].activities_id = stringToArray(results[0][0].activities_id);
			deferred.resolve(obj.programs);
		})
		promises.push(deferred.promise);
	})
	return q.all(promises);
}


module.exports = (req, res) => {
	var finalResult = {};
	var programs_ids;
	var programs = [];
    if(req.params.resort_id) {    	
        getResort(req.params.resort_id).then(function(results) {
        	console.log("data",results.data);
	        if(!!results.data) {
	        	res.json({data: "there is no any resort"})		        	
	        } else {
	        	finalResult.id = results[0].id;
	        	finalResult.resort_name = results[0].Resort_Name;
	        	programs_ids = stringToArray(results[0].programs_id); 
	        	var activityArr = [];

	        	getProgramsId(programs_ids).then(function(results) {        		        		        		
	        		finalResult.programs = formatProgramArrayGroup(results);        		
	        	}).then(function() {
	        		addingActivityId(finalResult).then(function(results) {        			
	        			var data = results[0].map(function(item) { 
						    delete item.program_grp_ids; 
						    return item; 
						});
	        			finalResult.programs = data;
					res.setHeader("Content-Type", "application/json");
					res.header("Access-Control-Allow-Origin", "*");
					res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	        			res.status(200).json({data: finalResult});
	        		})
	        	})
	        }
        })
    } else {
        res.json({
            data: {
                error: "true",
                errorMessage: "Please specify resort id"
            }
        });
    }
}
