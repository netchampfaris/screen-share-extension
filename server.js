const express = require('express');//Importing Express
const app = express();//Getting App From Express
const https = require('https');
const fs = require('fs');
const port = 8080;
var privateKey = fs.readFileSync( 'key.pem' );
var certificate = fs.readFileSync( 'cert.pem' );

const server = https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(port);

var io = require('socket.io').listen(server);
//Routing Request : http://localhost:port/
sdpData = {};
app.get('/', function (request, response) {
    //Telling Browser That The File Provided Is A HTML File
    response.writeHead(200, { "Content-Type": "text/html" });
    //Passing HTML To Browser
    response.write("The Server Is <strong>Working</strong>!");
    //Ending Response
    response.end();
})
io.sockets.on("connection", function (socket) {
	console.log('connected!');
	socket.on("payload_from_share", (data) => {
		data = getJson(data);
		sdpData[data.id] = {
			sdp: data.sdp
		};
		socket.on('join_request:' + id, () => {
			socket.emit('sdp_for:'+ id, {
				sdp : sdpData[id].sdp
			});
		});
		socket.on('join_sdp:'+id, (data) => {
			socket.emit('sdp_for_join:'+id, data);
		});
	})
})
//For Tracking When User Disconnects:
io.sockets.on("disconnect", function (socket) {
	//var socket is the socket for the client who has disconnected.
})
