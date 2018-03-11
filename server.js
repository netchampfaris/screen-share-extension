const express = require('express');//Importing Express
const app = express();//Getting App From Express
const https = require('https');
const fs = require('fs');
const port = 8080;
var privateKey = fs.readFileSync('key.pem');
var certificate = fs.readFileSync('cert.pem');

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

const getJson = data => {
	try {
		return JSON.parse(data);
	} catch (e) {
		return {}
	}
}

io.sockets.on("connection", function (socket) {
	socket.on("payload_from_share", (data) => {
		if (!data.id) return;
		console.log(data);
		const id = data.id;
		sdpData[id] = data.shareDescription;

	});

	socket.on('join_sdp', (data) => {
		if(!data.id) return
		console.log('join_sdp:');
		io.sockets.emit('sdp_for_join:' + data.id, data.joinDescription);
	});

	socket.on('join_request', (data) => {
		if (!data) return;
		if (!sdpData[data]) return
		const id = data;
		// console.log('join_request:' + id);
		socket.emit('sdp_for:' + id, sdpData[id]);
	});

	socket.on('joinCandidateData', data => {
		if (!data.id) return;
		io.sockets.emit('addCandidate:' + data.id, data.candidate)
	})

})
//For Tracking When User Disconnects:
io.sockets.on("disconnect", function (socket) {
	//var socket is the socket for the client who has disconnected.
})
