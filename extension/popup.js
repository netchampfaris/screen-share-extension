const share = document.getElementById('share');
const join = document.getElementById('join');
let startConnection = document.getElementById('start-connection')
let joinConnection = document.getElementById('join-connection')
let fileshare = document.getElementById('fileshare')

share.addEventListener('click', () => {
    const bg = chrome.extension.getBackgroundPage();
    bg.getDesktopShareStreamId()
});

join.addEventListener('click', () => {
    const shareId = document.querySelector('#shareid').value;
    w = window.open('view-screen.html');
    w.shareID = shareId;
})

fileshare.onchange = async function(e) {
    const input = e.target;
    const bg = chrome.extension.getBackgroundPage();

    const base64 = await getBase64(input.files[0]);

    console.log(base64)
    bg.sendFile(base64)
}

function getBase64(file) {
    return new Promise(resolve => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          console.log(reader.result);
          resolve(reader.result);
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
    })
}
