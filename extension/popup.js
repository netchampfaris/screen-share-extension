const share = document.getElementById('share');
const join = document.getElementById('join');

share.addEventListener('click', () => {
    const bg = chrome.extension.getBackgroundPage();
    bg.getDesktopShareStreamId()
});

join.addEventListener('click', () => {
    const shareId = document.querySelector('#shareid').value;
    w = window.open('view-screen.html');
    w.shareID = shareId;
})