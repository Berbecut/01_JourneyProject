﻿$("#signup").click(function () {
    $("#first").fadeOut("fast", function () {
        $("#second").fadeIn("fast");
    });
});

$(function () {
    $("form[name='login']").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
            }
        },
        messages: {
            email: "Please enter a valid email address",
            password: {
                required: "Please enter password",
            }
        },
        submitHandler: function (form) {
            form.submit();
        }
    });
});