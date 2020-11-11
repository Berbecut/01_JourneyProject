

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