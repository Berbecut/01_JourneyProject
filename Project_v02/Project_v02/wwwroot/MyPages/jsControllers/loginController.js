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