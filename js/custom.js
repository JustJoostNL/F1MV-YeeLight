const { ipcRenderer } = require('electron');

ipcRenderer.on('f1mvapi', (event, arg) => {
    alert(arg) // prints "pong"
})


function simulateGreen() {
    M.toast({
        html: 'Green flag event sent',
        displayLength: 2000
    })

    ipcRenderer.send('simulate', 'green')
}

function simulateYellow() {
    M.toast({
        html: 'Yellow flag event sent',
        displayLength: 2000
    })
}

function simulateRed() {
    M.toast({
        html: 'Red flag event sent',
        displayLength: 2000
    })
}

function simulateSC() {
    M.toast({
        html: 'Safety car event sent',
        displayLength: 2000
    })
}

function simulateVSC() {
    M.toast({
        html: 'VSC event sent',
        displayLength: 2000
    })
}

function simulateVSCEnding() {
    M.toast({
        html: 'VSC Ending event sent',
        displayLength: 2000
    })
}

function checkForUpdates() {
    M.toast({
        html: 'Checking for updates..',
        displayLength: 2000
    })
}