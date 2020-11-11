app.controller("newJourneyController", function ($scope, $http, $location, $routeParams) {
    $scope.newJourneyPageControllerValue = "my new journey page";

    $scope.dateTime = new Date();

    let id = $routeParams.id;

    $scope.id = id;

    if (!$scope.id) {
        $scope.id = 0;
    }

    $http.get("api/Journeys/" + id).then(function (response) {

        let Journey = response.data;

        $scope.dateTime = new Date(Journey.dateTime);

        $scope.start = Journey.meterStart; 
        $scope.stop = Journey.meterStop;

        $scope.Citystart = Journey.locationStart.city; // Citystart is property from postJourney.cs
        $scope.Startaddress = Journey.locationStart.streetName; // Startaddress is property from postJourney.cs
        $scope.Startno = Journey.locationStart.streetNumber;

        $scope.Citystop = Journey.locationStop.city;
        $scope.Endaddress = Journey.locationStop.streetName;
        $scope.Endno = Journey.locationStop.streetNumber;

        $scope.case = Journey.case;
        $scope.Notes = Journey.note;

        $scope.selectVehicle = Journey.vehicle.licensePlate;

    })


    // We will set as false from the start, in order to not appear Error message
    $scope.$watch('start', function () {
        if ($scope.start != '') {
            $scope.startError = false;
        }
    });

    $scope.$watch('stop', function () {
        if ($scope.stop != '') {
            $scope.stopError = false;
        }
    });

    $scope.$watch('stop - start', function () {
        if ($scope.stop < $scope.start) {
            $scope.stopErrorNegative = false;
        }
    });

    $scope.$watch('Citystart', function () {
        if ($scope.Citystart != '') {
            $scope.startCityError = false;
        }
    });

    $scope.$watch('Startaddress', function () {
        if ($scope.Startaddress != '') {
            $scope.startAddressError = false;
        }
    });

    $scope.$watch('Startno', function () {
        if ($scope.Startno != '') {
            $scope.startNumberError = false;
        }
    });

    $scope.$watch('Citystop', function () {
        if ($scope.Citystop != '') {
            $scope.stopCityError = false;
        }
    });

    $scope.$watch('Endaddress', function () {
        if ($scope.Endaddress != '') {
            $scope.stopAddressError = false;
        }
    });

    $scope.$watch('Endno', function () {
        if ($scope.Endno != '') {
            $scope.stopNumberError = false;
        }
    });

    $scope.$watch('case', function () {
        if ($scope.case != '') {
            $scope.caseError = false;
        }
    });

    $scope.$watch('selectVehicle', function () {
        if ($scope.selectVehicle != '') {
            $scope.selectVehicleError = false;

            $http.get("/api/partialJourneys").then(function (response) { // partialJourneys from here is part of expression: GetpartialJourneys from api controller: JourneysController.cs ..see....public async Task<ActionResult<IEnumerable<Journey>>> GetpartialJourneys()
                $scope.journeys = response.data;
                angular.forEach(response.data, function (item) {
                    if (item.vehicle.licensePlate == $scope.selectVehicle) {
                        $scope.selectVehicleError = true;
                    }
                    console.log(item.vehicle.licensePlate);
                })
            })
        }
    });

    //save partial journey / the journey will remain opened
    $scope.savePartialJourney = function () {

        if ($scope.start == 0 || $scope.start == null || $scope.start == '') {
            $scope.startError = true;
        }
        else if ($scope.Citystart == null || $scope.Citystart == '') {
            $scope.startCityError = true;
        }
        else if ($scope.Startaddress == null || $scope.Startaddress == '') {
            $scope.startAddressError = true;
        }
        else if ($scope.Startno == null || $scope.Startno == '') {
            $scope.startNumberError = true;
        }
        else {

            let post =
            {
                LicensePlate: $scope.selectVehicle, // LicensePlate is property from class postJourney.cs // selectVehicle is ng model from newJourney.html
                DateTime: $scope.dateTime.toISOString(), // DateTime is a property from class postJourney.cs // dateTime is ng model from newJourney.html
                MeterStart: $scope.start,
                CityStart: $scope.Citystart,
                StartAddress: $scope.Startaddress,
                StartNo: $scope.Startno
            }

            $http.post("/api/Journeys", post).then(function (response) {
                $scope.journey = response.data;
                $location.path('/userConnected'); // after click savePartialJourney, you will redirect to /userConnected page

            })

            $http.get("/api/Journeys").then(function (response) {
                $scope.journey = response.data;
            })
        }
    }



    //Linus inserted ...is ok...save all data from journey
    $scope.saveJourney = function () {

        if ($scope.start == 0 || $scope.start == null || $scope.start == '') {
            $scope.startError = true;
        }
        else if ($scope.stop == 0 || $scope.stop == null || $scope.stop == '') {
            $scope.stopError = true;
        }
        else if ($scope.stop < $scope.start) {
            $scope.stopErrorNegative = true;
        }
        else if ($scope.Citystart == null || $scope.Citystart == '') {
            $scope.startCityError = true;
        }
        else if ($scope.Startaddress == null || $scope.Startaddress == '') {
            $scope.startAddressError = true;
        }
        else if ($scope.Startno == null || $scope.Startno == '') {
            $scope.startNumberError = true;
        }
        else if ($scope.Citystop == null || $scope.Citystop == '') {
            $scope.stopCityError = true;
        }
        else if ($scope.Endaddress == null || $scope.Endaddress == '') {
            $scope.stopAddressError = true;
        }
        else if ($scope.Endno == null || $scope.Endno == '') {
            $scope.stopNumberError = true;
        }
        else if ($scope.case == null || $scope.case == '') {
            $scope.caseError = true;
        }
        else {

            let post =
            {
                LicensePlate: $scope.selectVehicle,
                DateTime: $scope.dateTime,
                MeterStart: $scope.start,
                MeterStop: $scope.stop,
                TotalLength: $scope.stop - $scope.start,

                CityStart: $scope.Citystart,
                CityStop: $scope.Citystop,

                StartAddress: $scope.Startaddress,
                EndAddress: $scope.Endaddress,

                StartNo: $scope.Startno,
                EndNo: $scope.Endno,

                Case: $scope.case,
                Note: $scope.Notes

            }


            if ($scope.id == "" || typeof $scope.id === 'undefined') {

                $http.post("/api/Journeys", post).then(function (response) {
                    $scope.journey = response.data;
                    $location.path('/userConnected'); // after click saveJourney, you will redirect to /userConnected page

                })

            }
            else {
                $http.put("/api/Journeys/" + $scope.id, post).then(function (response) {
                    $scope.journey = response.data;
                    $location.path('/userConnected'); // after click saveJourney, you will redirect to /userConnected page

                })
            }

        }

        $http.get("/api/Journeys").then(function (response) {
            $scope.journey = response.data;
        })
    }

    //Getting Vehicle List
    //$http GET function
    $http({
        method: 'GET',
        url: '/api/Vehicles'

    }).then(function successCallback(response) {

        $scope.vehicles = response.data;

        // a function that select from vehicle the item that is "active" in checkbox in manageVehicle.html
        angular.forEach($scope.vehicles, function (item) {

            if (item.active) {
                $scope.selectVehicle = item.licensePlate;
            }
        })


    }, function errorCallback(response) {
        alert("Error. Try Again!");
    });



    // find Start Address for GeoLocation
    $scope.findStartAddress = function () {

        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(function (position) {

                $scope.latitude = position.coords.latitude;
                $scope.longitude = position.coords.longitude;
                $scope.$apply();


                var geocoder = new google.maps.Geocoder;

                var latlng = {
                    lat: parseFloat($scope.latitude),
                    lng: parseFloat($scope.longitude)
                };

                geocoder.geocode({ 'location': latlng }, function (result, status) {

                    console.log(status);
                    console.log(result);

                    if (result[0]) {

                        result[0].address_components.forEach(function (item) {

                            if (item.types[0] == "street_number") {
                                $scope.Startno = item.long_name;
                                $scope.$apply();
                            }
                            if (item.types[0] == "route") {
                                $scope.Startaddress = item.long_name;
                                $scope.$apply();
                            }
                            if (item.types[0] == "postal_town") {
                                $scope.Citystart = item.long_name;
                                $scope.$apply();
                            }
                        })
                    }
                });

                console.log(position);

            }, function () {

                $scope.latitude = 57.396426;
                $scope.longitude = 14.673131;

            });
        }
        else {
            $scope.latitude = 57.396426;
            $scope.longitude = 14.673131;
        }
    };

    // find Stop Address for GeoLocation
    $scope.findStopAddress = function () {

        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(function (position) {

                $scope.latitude = position.coords.latitude;
                $scope.longitude = position.coords.longitude;
                $scope.$apply();


                var geocoder = new google.maps.Geocoder;

                var latlng = {
                    lat: parseFloat($scope.latitude),
                    lng: parseFloat($scope.longitude)
                };

                geocoder.geocode({ 'location': latlng }, function (result, status) {

                    console.log(status);
                    console.log(result);

                    if (result[0]) {

                        result[0].address_components.forEach(function (item) {

                            if (item.types[0] == "street_number") { // is taken from browser
                                $scope.Endno = item.long_name; //Endno is from newJourney.html, long_name is from browser
                                $scope.$apply();
                            }
                            if (item.types[0] == "route") {
                                $scope.Endaddress = item.long_name;
                                $scope.$apply();
                            }
                            if (item.types[0] == "postal_town") {
                                $scope.Citystop = item.long_name;
                                $scope.$apply();
                            }
                        })
                    }
                });
                console.log(position);

            }, function () {

                $scope.latitude = 57.396426;
                $scope.longitude = 14.673131;
            });
        }
        else {
            $scope.latitude = 57.396426;
            $scope.longitude = 14.673131;
        }
    };
});