const { ipcRenderer } = require('electron');
$(function() {
    ipcRenderer.on('f1mvAPI', (event, arg) => {
        console.log(arg)
        if (arg === 'online') {
            $('#f1mv').find('.status').removeClass('error').addClass('success')
        }

        if (arg === 'offline') {
            $('#f1mv').find('.status').removeClass('success').addClass('error')
        }
    })

    ipcRenderer.on('updateAPI', (event, arg) => {
        console.log(arg)
        if (arg === 'online') {
            $('#updateAPI').find('.status').removeClass('error').addClass('success')
        }

        if (arg === 'offline') {
            $('#updateAPI').find('.status').removeClass('success').addClass('error')
        }

    })

    ipcRenderer.on('log', (event, arg) => {
        // send the log we got from the main process to the html and make sure the text is white
        $('#log').append(`<p style="color: white">${arg}</p>`)
        
        // scroll down automatically to the bottom of the log
        $('#log').scrollTop($('#log')[0].scrollHeight);
        
        
        
        
        
    })
})


function simulateGreen() {
    M.toast({
        html: 'Green flag event sent',
        displayLength: 2000
    })

    ipcRenderer.send('simulate', 'Green')
}

function simulateYellow() {
    M.toast({
        html: 'Yellow flag event sent',
        displayLength: 2000
    })

    ipcRenderer.send('simulate', 'Yellow')
}

function simulateRed() {
    M.toast({
        html: 'Red flag event sent',
        displayLength: 2000
    })

    ipcRenderer.send('simulate', 'Red')
}

function simulateSC() {
    M.toast({
        html: 'Safety car event sent',
        displayLength: 2000
    })

    ipcRenderer.send('simulate', 'SC')
}

function simulateVSC() {
    M.toast({
        html: 'VSC event sent',
        displayLength: 2000
    })

    ipcRenderer.send('simulate', 'VSC')
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