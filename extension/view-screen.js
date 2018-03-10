window.peerConnection = null;
window.socket = null;
window.serverURL = 'https://192.168.29.59:8080/';

(async () => {
    await connectSocket()
    console.log('view shared screen', window.shareID);

    socket.emit('join_request', shareID);
    socket.on('sdp_for:' + shareID, async sdp => {
        peerConnection = createPeerConnection();
        peerConnection.onaddstream = function(e) {
            console.log(e);
            document.querySelector('video').srcObject = e.stream;
        }

        await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp))
        description = await peerConnection.createAnswer()
        peerConnection.setLocalDescription(description);

        socket.emit('join_sdp', JSON.stringify({
            id: shareID,
            joinDescription: description
        }));
    });

    function createPeerConnection() {
        let peerConnectionConfig = {'iceServers': [{'url': 'stun:stun.services.mozilla.com'}, {'url': 'stun:stun.l.google.com:19302'}]};
        return new RTCPeerConnection(peerConnectionConfig);
    }

    function connectSocket() {
        // return Promise.resolve();
        return new Promise(resolve => {
            socket = io(window.serverURL, {
                query: {
                    type: 'join'
                }
            });
            socket.on('connect', resolve);
        });
    }

})()

