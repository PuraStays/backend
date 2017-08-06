/**
 * GET experiences
 */

/**
 * Connect to mysql
 */
const mysql = require('mysql');
const query = require('../../config/db').query;


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
	})
	return groupArray;
}


var getProgramIdArray = function(id) {
	var params = [id];

	//program id from program groups in resort table
	var qry = 'SELECT Resort_Name, programs_id from resorts where id = ?';
	return query(mysql.format(qry, params)).then(function (results) {
		var programArr = (results[0].programs_id.replace(/,\s*$/, '')).split(",").map((item) => {
		   return parseInt(item, 10);
	    });	
		return {"resort_name": results[0].Resort_Name, "programsArr": programArr};
	});
}

var getProgramArrayQry = function(id) {
	var params = [id];
	var qry = 'SELECT id, Program_Title, Group1, Group2, Group3, Group4, Group5 from stayprograms where id = ?';
	
	return query(mysql.format(qry, params)).then(function(results) {
		return results;
	})
}


module.exports = (req, res) => {
	return getProgramIdArray(req.params.resort_id).then(function (result) {		
		
		var finalObject = {};
		finalObject.resort_name = result.resort_name;
		var programs = [];	
		console.log(result.programsArr);
		result.programsArr.forEach(function(id, index, array) {
			getProgramArrayQry(id).then(function(results) {
				var progItem = {
					"id": results[0].id, 
					"program_title": results[0].Program_Title
				};
				console.log(progItem);		
				programs.push(progItem);
				if(index == array.length-1) {
					finalObject.programs = programs;
					delete finalObject.programsArr;
					res.json({data: finalObject})
				}			
			})
		})

	});


	

	//getting resort
	/*mysqlDb.connect.query('SELECT Resort_Name, programs_id from resorts where id='+req.params.resort_id, (error, results, fields) => {
	    if (error) throw error;
	    var responseData = {
	    	"resort_name": results[0].Resort_Name,
	    	"experiences": []
	    }; //json object need to be returned
	    //converting programs id string array to int array 
	    var programs = programArray(results[0]);

	    //getting stayprograms group ids
	    var experiencesList = []; //to be add in response
	    programs.forEach((item)=> {		   	
		   	connection.query('SELECT id, Program_Title, Group1, Group2, Group3, Group4, Group5 from stayprograms where id='+item, (error, results) => {
	   	  			   	  		
				//convert comma separated string to array				
				var groupArray = stayProgramsArr(results[0]);
				
				//getting activities ids
			    groupArray.forEach((item) => {
			    	connection.query('SELECT * from stayprogramsgroups where id='+item, (error, results) => {
			    		//console.log(results[0]);
			    		var activityIds = activityArray(results[0]);
			    		console.log(activities_id);			    
			    	})
			    });

			    res.json({data: responseData});
	   	    });
	   });
	   
	});*/
}