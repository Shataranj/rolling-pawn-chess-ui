(function ($) {
    "use strict";
    $('#sign-up-button').on('click', function () {
        fetch('/config')
            .then(res => res.json())
            .then(({apiURL}) =>
                fetch(apiURL + "/register", {
                    method: "post",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_email: $("#email").val(),
                        user_id: $("#user-id").val(),
                        user_password: $("#password").val(),
                        board_id: $('#board-id').val()
                    })
                }))
            .then(res => res.json())
            .then(() => window.location.href = window.location.origin + "/home");
    })
})(jQuery);