/**
 * GET experiences
 */
const mysql = require('mysql');
const query = require('../../config/db').query;
const Promise = require('bluebird');


//getting stay programs array
function formatProgramIds(args) {
	var finalProgramGrpArrString = "";
	for(var key in args) {
	    if(/^Group/.test(key)) {
	    	var programsGrpArrStr = args[key];
	    	finalProgramGrpArrString = finalProgramGrpArrString.concat(programsGrpArrStr);			    	
	    }
	}

	//convert comma separated string to array	
	var groupArray = (finalProgramGrpArrString.replace(/,\s*$/, '')).split(",").map(function(item) {
	   return parseInt(item, 10);
    });

    //removing duplicate item in array, same program in different group
	groupArray = groupArray.filter((elem, index, self) => {
	    return index == self.indexOf(elem);
	});
	return groupArray;
}


var getProgramIdArray = function(id) {
	var params = [id];
	//program id from program groups in resort table
	var qry = 'SELECT id, Resort_Name, programs_id from resorts where id = ?';
	return query(mysql.format(qry, params)).then(function (results) {
	    if(results.length) {		
			var programArr = (results[0].programs_id.replace(/,\s*$/, '')).split(",").map((item) => {
			   return parseInt(item, 10);
		    });
			return {"resort_name": results[0].Resort_Name, "programsArr": programArr};
		} else {
			return null;
		}
	});
}

var getProgramArrayQry = function(id) {

	var params = [id];
	var qry = 'SELECT id, Program_Title, Group1, Group2, Group3, Group4, Group5 from stayprograms where id = ?';
	return query(mysql.format(qry, params)).then(function(results) {
		return results;
	})
}

var getProgramArray = function(arr) {
	var programs = [];
	//arr.forEach(function(id, index, array) {
	return Promise.map(arr, function(id) {
		return getProgramArrayQry(id).then(function(results) {								
			return results;							
		})
	}).each(function(result) {
		var progItem = {
			"id": result[0].id, 
			"program_title": result[0].Program_Title,
			"activities": formatProgramIds(result[0])
		};	
		programs.push(progItem);
	}).then(function(result) {
		return programs;
	})
}


module.exports = (req, res) => {
	if(req.params.resort_id) {
        return getProgramIdArray(req.params.resort_id).then(function (result) {	        	
			var finalObject = {};
			console.log(result);
			if(result === null) {
				res.json({
					data: {
						error: "true",
						errorMessage: "no result found"
					}
				});
			} else {
				finalObject.resort_name = result.resort_name;

				getProgramArray(result.programsArr).then(function(x) {
					finalObject.programs = x;
					res.json({data: finalObject});
				});
			}			
		});
	} else {
		res.json({
			data: {
				error: "true",
				errorMessage: "Please specify resort id"
			}
		});
	}
}

