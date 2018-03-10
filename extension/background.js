
var _port = null

chrome.browserAction.onClicked.addListener(tab => {
    chrome.tabs.getSelected(null, function(tab) {
        chrome.desktopCapture.chooseDesktopMedia(['screen', 'window', 'tab', 'audio'], tab, function(streamId, options) {
            console.log(streamId, options);
            _port.postMessage(streamId);
        });
	});
    chrome.tabs.executeScript(tab.id, { file: 'content-script.js' }, () => {
        console.log('injected');
    });

});

function createConnection() {
    const uid = getRandomUID();

}

chrome.runtime.onConnect.addListener(port => {
    _port = port;
})

function createRoomOnServer(uid) {
    return fetch({
        url: 'http://localhost:3445/screenshare',
        method: 'POST',
        body: JSON.stringify({
            uid: uid,
        }),
        'Content-Type': 'application/json'
    })
}

function getRandomUID() {
    return (Math.random() + '').replace('.', '').slice(0, 6);
}

