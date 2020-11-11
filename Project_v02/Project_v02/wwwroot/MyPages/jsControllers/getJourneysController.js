app.controller("getJourneysController", function ($scope, $http, $location, $rootScope) {
    $scope.getJourneyControllerValue = "my get journey page";

    //Inserted by Florin for get Journey 
    // Also implement Autorize code: { headers: { 'Authorization': 'Bearer ' + $rootScope.token } } // $rootScope.token is from loginController.js, row 47
    //see [Authorize] in JourneysController.cs row 26
    $http.get("/api/Journeys", { headers: { 'Authorization': 'Bearer ' + $rootScope.token } }).then(function (response) { // partialJourneys from here is part of expression: GetpartialJourneys from api controller: JourneysController.cs ..see....public async Task<ActionResult<IEnumerable<Journey>>> GetpartialJourneys()
        $scope.journeys = response.data;
    })




    // Update function below is from file getJourneys.html and open journey in order to update it
    $scope.addSavedJourney = function (id) {

        // add journey which is partial saved journey
        $http.get("/api/Journeys" + id, { headers: { 'Authorization': 'Bearer ' + $rootScope.token } }).then(function (response) {
            $scope.journey = response.data;
        })

        // redirect to newJourney page which use 'newJourneyController', see line 14: $http.get("api/Journeys/" + id).then(function (response) {
        $location.path("/newJourney/" + id);
    }





    //Inserted by Florin - ok: Delete Journey
    $scope.deleteJourney = function (journey) {

        //$http DELETE function
        $http({

            method: 'DELETE',
            url: '/api/Journeys/' + journey.id

        }).then(function successCallback(response) {

            alert("Journeys has deleted Successfully");
            var index = $scope.journeys.indexOf(journey);
            $scope.journeys.splice(index, 1);

        }, function errorCallback(response) {

            alert("Error while deleting journey. Try Again!");

        });
    };

});