let start = document.getElementById('start')
let join = document.getElementById('join')

let peerConnection = null
let shareId = '1234'
let socket =  null

start.addEventListener('click', async e => {
    await connectSocket()
    stream = await getStream()
    peerConnection = createPeerConnection()
    peerConnection.addStream(stream)

    let desc = await peerConnection.createOffer()
    peerConnection.setLocalDescription(desc)

    // peerConnection.onicecandidate = function(e) {
    //     console.log('share', e);
    // }

    socket.emit('payload_from_share', JSON.stringify({
        id: shareId,
        shareDescription: desc
    }))

    socket.on("sdp_for_join:" + shareId, desc => {
        peerConnection.setRemoteDescription(new RTCSessionDescription(desc))
    })

    socket.on("addCandidate:" + shareId, candidate => {
        console.log('adding candidate', candidate)
        peerConnection.addIceCandidate(candidate)
    })
})

join.addEventListener('click', async e => {
    await connectSocket()
    peerConnection = createPeerConnection()
    peerConnection.onaddstream = e => {
        console.log('on add stream', e)
        const video = document.getElementById('remoteVideo')
        video.srcObject = e.stream;
        video.play();

    }

    peerConnection.onicecandidate = function(e) {
        console.log('join', e);
        socket.emit('joinCandidateData', JSON.stringify({
            id: shareId,
            candidate: e.candidate
        }))
    }

    socket.emit('join_request', shareId)

    socket.on('sdp_for:' + shareId, async sdp => {

        await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp))
        let description = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(description)

        socket.emit('join_sdp', JSON.stringify({
            id: shareId,
            joinDescription: description
        }));
    });
})

function getStream() {
    return navigator.mediaDevices.getUserMedia({ video: true })
}

function createPeerConnection() {
    let peerConnectionConfig = {'iceServers': [{'url': 'stun:stun.services.mozilla.com'}, {'url': 'stun:stun.l.google.com:19302'}]}
    return new RTCPeerConnection(peerConnectionConfig)
}

function connectSocket() {
    return new Promise(resolve => {
        socket = io('https://192.168.43.145:8080/')
        socket.on('connect', resolve)
    })
}
