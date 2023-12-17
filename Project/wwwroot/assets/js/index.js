"use strict";

var connection

//Disable the send button until connection is established.
document.getElementById("btn-send-message").disabled = true;

document.getElementById("btn-send-message").addEventListener("click", function (event) {
    var sendTo = document.getElementById("sendto").value;
    var message = document.getElementById("message").value;
    connection.invoke("SendMessage", sendTo, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

document.getElementById("btn-connect").addEventListener("click", function (event) {
    document.getElementById("btn-connect").disabled = true;
    $.ajax({
        type: 'GET',
        url: 'https://' + window.location.host + '/api/login/' + document.getElementById("username").value,
        success: function (data) {
            console.log(data)
            //connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

            // Connect, using the token we got.
            connection = new signalR.HubConnectionBuilder()
                .withUrl("/chatHub", { accessTokenFactory: () => data })
                .build();

            connection.on("ReceiveMessage", function (sender, message) {
                var p = document.createElement("p");
                p.classList.add('in');
                p.textContent = `${sender}: ${message}`;
                document.getElementById("received-messages").appendChild(p);
                p.scrollIntoView(false);
                setTimeout(() => {
                    p.classList.remove('in');

                }, 10);
                // We can assign user-supplied strings to an element's textContent because it
                // is not interpreted as markup. If you're assigning in any other way, you
                // should be aware of possible script injection concerns.
            });

            connection.start().then(function () {
                document.getElementById("btn-send-message").disabled = false;
            }).catch(function (err) {
                return console.error(err.toString());
            });
        }
    });
    event.preventDefault();
});