app.controller("chatController", function ($scope) {
    $scope.chatPageControllerValue = "my chat page";

    $scope.messages = [];
    var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
    connection.start();

    $scope.send = function () {

        var dt = new Date();

        var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();

        connection.invoke("SendMessage", $scope.name, $scope.message, time);
    };

    connection.on("ReceiveMessage", function (name, message, time) {
        var newChatItem = { name: name, message: message, time: time };

        $scope.messages.push(newChatItem);
        $scope.$apply();

    });
});
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
app.controller("loginController", function ($scope, $http, $rootScope, $location) {
    $scope.loginPageControllerValue = "my login page";


    // Created for validation for newUser, so We will set as false from the start, in order to not appear Error message
    $scope.$watch('emailModel', function () {
        if ($scope.emailModel != '') {
            $scope.emptyEmailError = false;
        }
    });

    $scope.$watch('passModel', function () {
        if ($scope.passModel != '') {
            $scope.emptyPasswordError = false;
        }
    });

    $scope.$watch('showMessage', function () {
            $scope.showMessage = true;
    });


    // function button loginUser()
    $scope.loginUser = function () {

        //validation code
        if ($scope.emailModel == null || $scope.emailModel == '') {
            $scope.emptyEmailError = true;
        }
        else if ($scope.passModel == null || $scope.passModel == '') {
            $scope.emptyPasswordError = true;
        }
        else if ($scope.passModel == null || $scope.passModel == '') {
            $scope.showMessage = true;
        }
        else {

            // save info
            let post =
            {
                Email: $scope.emailModel,
                Password: $scope.passModel
            }

            $http.post("/api/Users", post).then(function (response) {
                
                $rootScope.token = response.data.token;
                $rootScope.email = response.data.email;
                $location.path('/userConnected');
            })
        }
    }
});


app.controller('manageVehicleController', ['$scope', '$http', function ($scope, $http) {

    //Buttons Settings
    $scope.submit = true;
    $scope.update = false;
    $scope.cancel = false;
    $scope.vehicleid = true;

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


    //Create New Vehicle
    $scope.createVehicle = function () {

        //$http POST function
        $http({

            method: 'POST',
            url: '/api/Vehicles',
            data: $scope.vehicle

        }).then(function successCallback(response) {

            $scope.vehicles.push(response.data);
            alert("Vehicle has created Successfully");

        }, function errorCallback(response) {

            alert("Error while created vehicle. Try Again!");

        });
    };


    //Update Vehicle
    $scope.updateVehicle = function () {

        //$http PUT function
        $http({

            method: 'PUT',
            url: '/api/Vehicles/' + $scope.vehicle.id,
            data: $scope.vehicle

        }).then(function successCallback(response) {

            // I inserted here this code in order to reload/get again the page at update: Getting Vehicle List
            //$http GET function
            $http({
                method: 'GET',
                url: '/api/Vehicles'

            }).then(function successCallback(response) {

                $scope.vehicles = response.data;

            }, function errorCallback(response) {

                alert("Error. Try Again!");

                });


            // this code was initial here
            alert("Vehicle has updated Successfully")

        }, function errorCallback(response) {

            alert("Error while updating vehicle. Try Again!");

        });
    };


    //Delete Vehicle
    $scope.deleteVehicle = function (vehicle) {

        //$http DELETE function
        $http({

            method: 'DELETE',
            url: '/api/Vehicles/' + vehicle.id

        }).then(function successCallback(response) {

            alert("Vehicle has deleted Successfully");
            var index = $scope.vehicles.indexOf(vehicle);
            $scope.vehicles.splice(index, 1);

        }, function errorCallback(response) {

            alert("Error while deleting vehicle. Try Again!");

        });
    };

    //Set $scope on Edit button click
    $scope.editVehicle = function (vehicle) {

        $scope.vehicle = vehicle;
        $scope.submit = false;
        $scope.update = true;
        $scope.cancel = true;
        $scope.vehicleid = false;

    };


    //cancel Update
    $scope.cancelUpdate = function () {
        $scope.vehicle = null;
        $scope.submit = true;
        $scope.update = false;
        $scope.cancel = false;
        $scope.vehicleid = true;
    };
}]);
app.controller("navBarConnectedController", function ($scope, $rootScope, $location) {
    $scope.navBarPageControllerValue = "Florin";

    $scope.signOutFunction = function () {
        $rootScope.email = '';
        $location.path('/'); // after click signOutFunction, you will redirect to Login page
    }

});


app.controller("navBarController", function ($scope) {
    $scope.navBarPageControllerValue = "Florin";
});

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
app.controller("newUserController", function ($scope, $http, $location) {
    $scope.newUserPageControllerValue = "my new user page F";


    // Created for validation for newUser, so We will set as false from the start, in order to not appear Error message
    $scope.$watch('firstNameModel', function () {
        if ($scope.firstNameModel != '') {
            $scope.firstNameError = false;
        }
    });
    $scope.$watch('lastNameModel', function () {
        if ($scope.lastNameModel != '') {
            $scope.lastNameError = false;
        }
    });
    $scope.$watch('emailModel', function () {
        if ($scope.emailModel != '') {
            $scope.emptyEmailError = false;
        }
    });
    $scope.$watch('passModel', function () {
        if ($scope.passModel != '') {
            $scope.emptyPasswordError = false;
        }
    });



    $scope.saveNewUser = function () {

        if ($scope.firstNameModel == null || $scope.firstNameModel == '') {
            $scope.firstNameError = true;
        }
        else if ($scope.lastNameModel == null || $scope.lastNameModel == '') {
            $scope.lastNameError = true;
        }
        else if ($scope.emailModel == null || $scope.emailModel == '') {
            $scope.emptyEmailError = true;
        }
        else if ($scope.passModel == null || $scope.passModel == '') {
            $scope.emptyPasswordError = true;
        }
        else {

            let PostObject =
            {
                FirstName: $scope.firstNameModel, //"FirstName" is a property from class User.cs and "firstNameModel" is a ng-model from newUser.html
                LastName: $scope.lastNameModel,
                Email: $scope.emailModel,
                Password: $scope.passModel
            }

            $http.post("/register", PostObject).then(function (response) {

                // inserted by Florin
                $scope.errors = response.data.errors;


                if (response.data.succeeded) {
                    $location.path('/');
                    $scope.firstNameModel = "";
                    $scope.lastNameModel = "";
                    $scope.email = "";
                    $scope.password = "";
                }
                console.log(response);
            })


            $http.get("/api/Users").then(function (response) {
                $scope.user = response.data;
            })
        }
    }
});
app.controller("pdfController", function ($scope) {
    $scope.pdfPageControllerValue = "my pdf page";
});
app.controller("recoverPasswordController", function ($scope) {
    $scope.recoverPasswordPageControllerValue = "my recover password page";
});
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