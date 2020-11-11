app.controller("reportController", function ($scope, $http, $window) {
    $scope.reportPageControllerValue = "my report page";



    // Bellow function is for picklist in report.html
    //Getting Vehicle List
    //$http GET function
    $http({
        method: 'GET',
        url: '/api/Vehicles'

    }).then(function successCallback(response) {

        $scope.vehicles = response.data;

    }, function errorCallback(response) {

        alert("Error. Try Again!");

    });



    // Use for Validation field  We will set as false from the start, in order to not appear 
    $scope.$watch('selectVehicle', function () {
        if ($scope.selectVehicle != '') {
            $scope.startSelectError = false;
        }
    });
    $scope.$watch('dateStartReport', function () {
        if ($scope.dateStartReport != '') {
            $scope.startError = false;
        }
    });
    $scope.$watch('dateEndReport', function () {
        if ($scope.dateEndReport != '') {
            $scope.endError = false;
        }
    });


    //create report
    $scope.createReport = function () {

        //validation fill fields
        if ($scope.selectVehicle == 0 || $scope.selectVehicle == null || $scope.selectVehicle == '') {
            $scope.startSelectError = true;
        }
        else
            if ($scope.dateStartReport == 0 || $scope.dateStartReport == null || $scope.dateStartReport == '') {
            $scope.startError = true;
        }
        else if ($scope.dateEndReport == 0 || $scope.dateEndReport == null || $scope.dateEndReport == '')
        {
            $scope.endError = true;
        }
        else {

            let post =
            {
                LicensePlate: $scope.selectVehicle, // LicensePlate is property from class Report.cs // selectVehicle is ng model from report.html
                DateTimeStart: $scope.dateStartReport.toISOString(), // DateTime is a property from class postJourney.cs // dateTime is ng model from newJourney.html
                DateTimeStop: $scope.dateEndReport.toISOString() // DateTime is a property from class postJourney.cs // dateTime is ng model from newJourney.html
            }

            $http.post("/api/report", post).then(function (response) {
                $scope.data = response.data;
                $scope.labels = ["0-20km", "21-50km", "51-200km"];

                $scope.options = {
                    legend: {
                        display: true,
                        position: "bottom"
                    },
                    tooltipEvents: [],
                    showTooltips: true,
                    tooltipCaretSize: 0,
                    onAnimationComplete: function () {
                        this.showTooltip(this.segments, true);
                    },
                };

            })
        }
    }

    //create report
    $scope.createPdf = function () {

        //validation fill fields
        if ($scope.selectVehicle == 0 || $scope.selectVehicle == null || $scope.selectVehicle == '') {
            $scope.startSelectError = true;
        }
        else if ($scope.dateStartReport == 0 || $scope.dateStartReport == null || $scope.dateStartReport == '') {
            $scope.startError = true;
        }
        else if ($scope.dateEndReport == 0 || $scope.dateEndReport == null || $scope.dateEndReport == '') {
            $scope.endError = true;
        }
        else {

            // start post
            let post =
            {
                LicensePlate: $scope.selectVehicle, // LicensePlate is property from class postJourney.cs // selectVehicle is ng model from report.html
                DateTimeStart: $scope.dateStartReport.toISOString(), // DateTime is a property from class postJourney.cs // dateTime is ng model from newJourney.html
                DateTimeStop: $scope.dateEndReport.toISOString() // DateTime is a property from class postJourney.cs // dateTime is ng model from newJourney.html

            }

            $http.post("/api/pdf", post).then(function (response) {
                $window.open('/MyPages/pdf/' + $scope.selectVehicle + '.pdf', '_blank');
            })
        }
    }
});