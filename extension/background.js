
var contentScript = null

chrome.browserAction.onClicked.addListener(tab => {

});

function getDesktopShareStreamId() {
    chrome.tabs.getSelected(null, function(tab) {
        chrome.desktopCapture.chooseDesktopMedia(['screen', 'window', 'tab', 'audio'], tab, function(streamId, options) {
            console.log('Stream ID', streamId);
            contentScript.postMessage({
                type: 'CREATE_STREAM',
                streamId
            });
        });
    });
    runContentScript();
}

function emitJoinId(id) {
    chrome.tabs.getSelected(null, function(tab) {
        contentScript.postMessage({
            type: 'EMIT_JOIN_ID',
            id: id
        })
    })
    // runJoinContentScript();
}

function runContentScript() {
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.executeScript(tab.id, { file: 'content-script.js' }, () => {
            console.log('injected');
        });
    });
}

function runJoinContentScript() {
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.executeScript(tab.id, { file: 'join-content-script.js' }, () => {
            console.log('injected');
        });
    });
}

function createConnection() {
    const uid = getRandomUID();
}

chrome.runtime.onConnect.addListener(port => {
    contentScript = port;
})

function getRandomUID() {
    return (Math.random() + '').replace('.', '').slice(0, 6);
}

