const { ipcRenderer } = require('electron');
$(function() {
    ipcRenderer.on('f1mvapi', (event, arg) => {
        console.log(arg)
        if (arg == 'online') {
            $('#f1mv').find('.status').removeClass('error').addClass('success')
        }

        if (arg == 'offline') {
            $('#f1mv').find('.status').removeClass('success').addClass('error')
        }
    })

    ipcRenderer.on('joostapi', (event, arg) => {
        console.log(arg)
        if (arg == 'online') {
            $('#joostapi').find('.status').removeClass('error').addClass('success')
        }

        if (arg == 'offline') {
            $('#joostapi').find('.status').removeClass('success').addClass('error')
        }

    })
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

    ipcRenderer.send('simulate', 'yellow')
}

function simulateRed() {
    M.toast({
        html: 'Red flag event sent',
        displayLength: 2000
    })

    ipcRenderer.send('simulate', 'red')
}

function simulateSC() {
    M.toast({
        html: 'Safety car event sent',
        displayLength: 2000
    })

    ipcRenderer.send('simulate', 'sc')
}

function simulateVSC() {
    M.toast({
        html: 'VSC event sent',
        displayLength: 2000
    })

    ipcRenderer.send('simulate', 'vsc')
}

function simulateVSCEnding() {
    M.toast({
        html: 'VSC Ending event sent',
        displayLength: 2000
    })

    ipcRenderer.send('simulate', 'vcsEnding')
}

function checkForUpdates() {
    M.toast({
        html: 'Checking for updates..',
        displayLength: 2000
    })

    ipcRenderer.send('updatecheck', 'updatecheck')
}