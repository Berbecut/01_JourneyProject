app.controller("userConnectedController", function ($scope, $http, $location) {
    $scope.userPageControllerValue = "my connected page";

    //Inserted by Florin
    $http.get("/api/partialJourneys").then(function (response) { // partialJourneys from here is part of expression: GetpartialJourneys from api controller: JourneysController.cs ..see....public async Task<ActionResult<IEnumerable<Journey>>> GetpartialJourneys()
        $scope.journeys = response.data;
    })

    $scope.addUnsavedJourney = function (id) {
        $location.path("/newJourney/" + id);
    }
});