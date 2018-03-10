window.contentScriptExecuted = false;

(() => {
    if (window.contentScriptExecuted) {
        return;
    }
    // run this file only once
    window.contentScriptExecuted = true;

    const background = chrome.runtime.connect(chrome.runtime.id);

    background.onMessage.addListener(msg => {
        window.postMessage(msg, '*');

        if (msg.type === 'CREATE_CONNECTION') {
            getScreenStream(msg.streamId)
                .then(stream => {
                    const peerConnection = createPeerConnection();
                    peerConnection.addStream(stream);
                    peerConnection.createOffer((description) => {
                        pc1.setLocalDescription(desc);
                        console.log("Offer from pc1 \n" + desc.sdp);
                        // pc2.setRemoteDescription(desc);
                        // pc2.createAnswer(gotDescription2);
                    });
                });
        }
    });

    function createPeerConnection() {
        let peerConnectionConfig = {'iceServers': [{'url': 'stun:stun.services.mozilla.com'}, {'url': 'stun:stun.l.google.com:19302'}]};
        let peerConnection = new RTCPeerConnection(peerConnectionConfig);
    }

    function getScreenStream(streamId) {
        return navigator.mediaDevices.getUserMedia({
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: streamId,
                    // maxWidth: window.screen.width,
                    // maxHeight: window.screen.height
                }
            }
        });
    }

})()
