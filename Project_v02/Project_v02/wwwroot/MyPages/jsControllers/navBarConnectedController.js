app.controller("navBarConnectedController", function ($scope, $rootScope, $location) {
    $scope.navBarPageControllerValue = "Florin";

    $scope.signOutFunction = function () {
        $rootScope.email = '';
        $location.path('/'); // after click signOutFunction, you will redirect to Login page
    }

});

