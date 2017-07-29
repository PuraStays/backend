/**
 * GET experiences
 */

module.exports = (req, res) => {
	//getting resort
	connection.query('SELECT Resort_Name, programs_id from resorts where id='+req.params.resort_id, function (error, results, fields) {
	    if (error) throw error;
	    var responseData = {
	    	"resort_name": results[0].Resort_Name,
	    	"experiences": []
	    }; //json object need to be returned
	    //converting programs id string array to int array 
	    var programs = (results[0].programs_id.replace(/,\s*$/, '')).split(",").map(function(item) {
		   return parseInt(item, 10);
	    });

	    //getting stayprograms group ids
	    var experiencesList = []; //to be add in response
	    programs.forEach((item)=> {		   	
		   	connection.query('SELECT id, Program_Title, Group1, Group2, Group3, Group4, Group5 from stayprograms where id='+item, (error, results) => {
	   	  		var finalProgramGrpArrString = "";

	   	  		experiencesList.push({"experience": results[0].Program_Title});
	   	  		responseData.experiences = experiencesList;
	   	  		
		   	  	for(var key in results[0]) {
				    if(/^Group/.test(key)) {
				    	var programsGrpArrStr = results[0][key];
				    	finalProgramGrpArrString = finalProgramGrpArrString.concat(programsGrpArrStr);			    	
				    }
				}
				//convert comma separated string to array				
				var groupArray = (finalProgramGrpArrString.replace(/,\s*$/, '')).split(",").map(function(item) {
				   return parseInt(item, 10);
			    });

				//removing duplicate item in array, same program in different group
				groupArray = groupArray.filter(function(elem, index, self) {
				    return index == self.indexOf(elem);
				})

				//getting activities ids
			    groupArray.forEach((item) => {
			    	connection.query('SELECT * from stayprogramsgroups where id='+item, (error, results) => {
			    		//console.log(results[0]);
			    		var activityIds = (results[0].activities_id.replace(/,\s*$/, '')).split(",").map(function(item) {
						   return parseInt(item, 10);
					    });
					    responseData.experiences.activities = activities_id;			    
			    	})
			    });
			    res.json({data: responseData});

	   	    })
	   	    console.log(responseData.experiences);
	   });
	   
	});
}