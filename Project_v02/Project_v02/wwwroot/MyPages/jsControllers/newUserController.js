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