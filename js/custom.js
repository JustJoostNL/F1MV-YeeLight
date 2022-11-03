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
        // send the log we got from the main process to the html and make sure the text is white, and add the current time in 24h format
        $('#log').prepend(`<p style="color: white;">[${new Date().toLocaleTimeString('en-GB', {hour12: false})}] ${arg}</p>`)
    })

    // let config = [];
    // ipcRenderer.on('config', (event, arg) => {
    //     config = arg
    //     // get the lights from the config file
    //     let lights = config['lights']
    //     // for each light in the lights object, send a fetch request to the ip address, if it returns a 200 status code, the light is online, if not, it's offline
    //     // this is done for each light in the config file
    //     // the ip address is also sent to the html so the user can see the ip address of the light and check if it's correct and if it's online or not
    //     for (let light in lights) {
    //         fetch(`https://${lights[light]['ip']}`)
    //             .then(res => {
    //                 if (res.status === 200) {
    //                     $(`#${light}`).find('.status').removeClass('error').addClass('success')
    //                     $(`#${light}`).find('.ip').html(lights[light]['ip'])
    //                 }
    //             })
    //             .catch(err => {
    //                 $(`#${light}`).find('.status').removeClass('success').addClass('error')
    //                 $(`#${light}`).find('.ip').html(lights[light]['ip'])
    //             })
    //
    //     }
    //
    //
    //
    //     console.log("config: " + config)
    // })

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