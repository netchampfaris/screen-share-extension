var express = require('express');//Importing Express
var app = express();//Getting App From Express
const port = 8080;//Creating A Constant For Providing The Port
var io = require('socket.io').listen(app.listen(port));
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