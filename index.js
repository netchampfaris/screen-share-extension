function startScreenStream(streamId) {
    navigator.mediaDevices.getUserMedia({
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: streamId,
                // maxWidth: window.screen.width,
                // maxHeight: window.screen.height
            }
        }
    })
    .then(stream => {
        const video = document.querySelector('video');
        video.srcObject = stream;
        video.play();
    });
}

window.addEventListener('message', e => {
    console.log(e);
    if (e.data) {
        startScreenStream(e.data);
    }
})