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