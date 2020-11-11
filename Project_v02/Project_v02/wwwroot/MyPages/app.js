var app = angular.module("myApp", ['ngRoute', 'chart.js']);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "/MyPages/Templates/loginStart.html",
            controller: 'loginController'
        })
        .when("/newUser", {
            templateUrl: "/MyPages/Templates/newUser.html",
            controller: 'newUserController'
        })
        .when("/recoverPassword", {
            templateUrl: "/MyPages/Templates/recoverPassword.html",
            controller: 'recoverPasswordController'
        })
        .when("/userConnected", {
            templateUrl: "/MyPages/Templates/userConnected.html",
            controller: 'userConnectedController'
        })
        .when("/newJourney/", {
            templateUrl: "/MyPages/Templates/newJourney.html",
            controller: 'newJourneyController'
        })
        .when("/newJourney/:id", {
            templateUrl: "/MyPages/Templates/newJourney.html",
            controller: 'newJourneyController'
        })
        .when("/getJourneys", {
            templateUrl: "/MyPages/Templates/getJourneys.html",
            controller: 'getJourneysController'
        })
        .when("/manageVehicle", {
            templateUrl: "/MyPages/Templates/manageVehicle.html",
            controller: 'manageVehicleController'
        })
        .when("/report", {
            templateUrl: "/MyPages/Templates/report.html",
            controller: 'reportController'
        })
        .when("/pdf", {
            templateUrl: "MyPages/pdf",
            controller: 'pdfController'
        })
        .when("/chat", {
            templateUrl: "/MyPages/Templates/chat.html",
            controller: 'chatController'
        })
        .otherwise({
            redirectTo: '/'
        });
});
