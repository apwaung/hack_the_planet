// create the controller and inject Angular's $scope
seedApp.controller('mainController', function($scope, $location, $q, emailService) {
	$scope.recipient = "foo@foo";
	$scope.sender = "bar@bar";
	$scope.subject = "baz";
	$scope.message = "alkdjfal;ksdfjas";
    var csv_concentration = "concentration.csv";
    var csv_mellowness = "mellowness.csv";

    $scope.startRecording = function() {
    	// open file TODO
	    //open($scope.csv_concentration);
	    //open($scope.csv_mellowness);

    	// begin collecting brain-wave data
    }

    $scope.finishRecording = function() {
    	// finish collecting brain-wave data

    	// save files & process data
    	$scope.asyncReadFile("../../output_data/output_concentration_1.csv").then(
    		function(asyncText) {
		    	var concentration = $scope.processEEG(asyncText);
                emailService.setConcentration(concentration);
	    		//close($scope.csv_concentration);
    		}
    	);

        /* TODO MELLOW
    	$scope.asyncReadFile("../../output_data/output_mellowness_1.csv").then(
    		function(asyncText) {
    			var mellowness = $scope.processEEG($scope.csv_mellowness);
                emailService.setMellowness(mellowness);
	    		//close($scope.csv_mellowness);
    		}
    	);
        */

    	// save email
    	emailService.setEmail($scope.recipient, $scope.sender, $scope.subject, $scope.message);
    	// change view
    	$location.path("analysis");
    }

    // Parses a CSV file of EEG readings and computes the average reading
    $scope.processEEG = function(csv) {
    	var readingTotal = 0;
    	var readingsList = csv.split("\n");
    	for (var i = 0; i < readingsList.length; i++) {
    		var line = readingsList[i].split(","); 
            if (line[2] != null) {
                var reading = parseInt(line[2].trim());
                readingTotal += reading;
            }
    	}
    	return readingTotal / readingsList.length;
    }

    $scope.asyncReadFile = function(file) {
    	var result = $q.defer();
	    var rawFile = new XMLHttpRequest();
	    rawFile.open("GET", file, true);
	    rawFile.onreadystatechange = function ()
	    {
	        if(rawFile.readyState === 4)
	        {
	            if(rawFile.status === 200 || rawFile.status == 0)
	            {
	                var allText = rawFile.responseText;
	                result.resolve(allText);
	            }
	        }
	    }
	    rawFile.send(null);
	    return result.promise;
	}
});