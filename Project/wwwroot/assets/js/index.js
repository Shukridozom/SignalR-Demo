"use strict";

//var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
var connection

//Disable the send button until connection is established.
document.getElementById("btn-send-message").disabled = true;

//connection.on("ReceiveMessage", function (user, message) {
//    var li = document.createElement("li");
//    document.getElementById("received-messages").appendChild(li);
//    // We can assign user-supplied strings to an element's textContent because it
//    // is not interpreted as markup. If you're assigning in any other way, you 
//    // should be aware of possible script injection concerns.
//    li.textContent = `${user} says ${message}`;
//});

//connection.start().then(function () {
//    document.getElementById("btn-send-message").disabled = false;
//}).catch(function (err) {
//    return console.error(err.toString());
//});

document.getElementById("btn-send-message").addEventListener("click", function (event) {
    var user = document.getElementById("username").value;
    var message = document.getElementById("message").value;
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

document.getElementById("btn-connect").addEventListener("click", function (event) {
    $.ajax({
        type: 'GET',
        url: 'https://localhost:7299/api/login/' + document.getElementById("username").toString(),
        success: function (data) {
            console.log(data)
            //connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

            // Connect, using the token we got.
            connection = new signalR.HubConnectionBuilder()
                .withUrl("/chatHub", { accessTokenFactory: () => data })
                .build();

            connection.on("ReceiveMessage", function (user, message) {
                var li = document.createElement("li");
                document.getElementById("received-messages").appendChild(li);
                // We can assign user-supplied strings to an element's textContent because it
                // is not interpreted as markup. If you're assigning in any other way, you
                // should be aware of possible script injection concerns.
                li.textContent = `${user} says ${message}`;
            });

            connection.start().then(function () {
                document.getElementById("btn-connect").disabled = true;
                document.getElementById("btn-send-message").disabled = false;
            }).catch(function (err) {
                return console.error(err.toString());
            });
        }
    });
    event.preventDefault();
});