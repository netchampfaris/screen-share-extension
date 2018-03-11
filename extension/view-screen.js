window.peerConnection = null;
window.socket = null;
window.serverURL = 'https://192.168.43.145:8080/';

(async () => {
    await connectSocket()
    console.log('view shared screen', window.shareID);

    peerConnection = createPeerConnection();
    peerConnection.onaddstream = function(e) {
        console.log(e);
        document.querySelector('video').srcObject = e.stream;
    }

    peerConnection.onicecandidate = function(e) {
        console.log('join', e);
        socket.emit('joinCandidateData', {
            id: shareID,
            candidate: e.candidate
        })
    }

    socket.emit('join_request', shareID);
    socket.on('sdp_for:' + shareID, async sdp => {

        await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp))
        description = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(description)

        socket.emit('join_sdp', {
            id: shareID,
            joinDescription: description
        });
    });

    function createPeerConnection() {
        let peerConnectionConfig = {'iceServers': [{'url': 'stun:stun.services.mozilla.com'}, {'url': 'stun:stun.l.google.com:19302'}]};
        return new RTCPeerConnection(peerConnectionConfig);
    }

    function connectSocket() {
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

