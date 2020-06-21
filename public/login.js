(function ($) {
    "use strict";
    $('#login-button').on('click', function () {
        fetch('/config')
            .then(res => res.json())
            .then(({apiURL}) =>
                fetch(apiURL + "/login", {
                    method: "post",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_email: $("#email").val(),
                        user_password: $("#password").val(),
                    })
                }))
            .then(res => res.json())
            .then(({token}) =>{
                window.localStorage.setItem("token", token);
                return window.location.href = window.location.origin + "/home"});
    })
})(jQuery);