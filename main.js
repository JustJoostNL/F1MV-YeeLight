'use strict';

const { autoUpdater } = require("electron-updater")
const { app, BrowserWindow, dialog, ipcMain  } = require('electron')
const http = require('http');
const https = require('https');
const { Bulb } = require('yeelight.io');
const fetch = require('node-fetch').default;
const process = require('process');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const updateURL = "https://api.github.com/repos/koningcool/F1MV-YeeLight/releases/"

// config
const Store = require('electron-store');
const config = require("./config");
const userConfig = new Store({name: 'settings', defaults: config});

const brightnessSetting = userConfig.get('YeeLights.Settings.brightness');
const url = userConfig.get('LiveTimingURL');
const greenColor = userConfig.get('YeeLights.Settings.green');
const yellowColor = userConfig.get('YeeLights.Settings.yellow');
const redColor = userConfig.get('YeeLights.Settings.red');
const safetyCarColor = userConfig.get('YeeLights.Settings.safetyCar');
const vscColor = userConfig.get('YeeLights.Settings.vsc');
const vscEndingColor = userConfig.get('YeeLights.Settings.vscEnding');
const analyticsURL = 'https://api.joost.systems/yeelight/analytics';
const analyticsPreference = userConfig.get('YeeLights.analytics');
const debugPreference = userConfig.get('YeeLights.debug');
const sessionEndPreference = userConfig.get('YeeLights.Settings.turnOffWhenSessionEnds');
const updateChannel = userConfig.get('YeeLights.updateChannel');
const allLights = userConfig.get('YeeLights.lights');
autoUpdater.channel = updateChannel;


let analyticsSend = false;
let flagSwitchCounter = 0;
let lightsOnCounter = 0;
let lightsOffCounter = 0;
let check;
let win;


function createWindow () {
    if(debugPreference) {
        console.log("Creating window...");
        win.webContents.send('log', "Creating window...");
    }
    win = new BrowserWindow({
        width: 1700,
        height: 1200,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    win.loadFile('index.html').then(r => {
        if(debugPreference) {
            console.log("Window loaded!");
            win.webContents.send('log', "Window loaded!");
        }
    })
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        autoUpdater.checkForUpdates().then(r => {
            if(debugPreference) {
                console.log(r);
                win.webContents.send('log', r);
            }
        });
        let startTime = new Date();
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })

    // TODO: More stable solution.
    setTimeout(() => {
        win.webContents.send('config', config);
    }, 500);
})

app.on('window-all-closed',  async() => {

    console.log("Closing window and sending analytics...");
    win.webContents.send('log', "Closing window and sending analytics...");

    if (process.platform !== 'darwin') {
        if(analyticsPreference === true || analyticsSend === false) {
            await sendAnalytics().catch((err) => {
                analyticsSend = true;
                console.log(err);
                win.webContents.send('log', err);
            });
        }
        app.quit()


    }
})

// open the config file
ipcMain.on('open-config', (event, arg) => {
    win.webContents.send('log', "Opening config file...");
    require('child_process').exec('start notepad.exe ' + userConfig.path);
})

ipcMain.on('simulate', (event, arg) => {
    simulateFlag(arg).then(r => {
        if(debugPreference) {
            console.log("Simulated flag: " + arg);
            win.webContents.send('log', "Simulated flag: " + arg);
        }
    })
})

ipcMain.on('updatecheck', (event, arg) => {
    console.log(autoUpdater.checkForUpdates())
    win.webContents.send('log', autoUpdater.checkForUpdates());
    win.webContents.send('log', 'Checking for updates...')
})

async function simulateFlag(arg) {
    win.webContents.send('log', "Simulated " + arg);
    console.log(arg)
}


async function sendAnalytics() {
    if(analyticsPreference) {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false });
        const currentDate = new Date()
        const day = currentDate.getDate()
        const month = currentDate.getMonth() + 1
        const year = currentDate.getFullYear()
        const date = day + "-" + month + "-" + year

        const data = {
            "time-of-sending": currentTime,
            "date-of-sending": date,
            "config": userConfig.store,
            "lights-on-counter": lightsOnCounter,
            "light-off-counter": lightsOffCounter,
            "flag-switch-counter": flagSwitchCounter
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        await fetch(analyticsURL, options);
        if(debugPreference) {
            console.log(data);
            win.webContents.send('log', data);
        }
    }
}

async function checkF1MV() {
    let a = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await a.json();

    if (!Object.keys(data).length) {
        return false;
    }

    return true;
}

async function getTimingData() {
    let F1MVApi = await checkF1MV();

    if (!F1MVApi) {
        return true;
    }


    let a = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await a.json();
    const trackStatus = data.TrackStatus.Status;
    const sessionStatus = data.SessionStatus.Status;
    //check = trackStatus;
    if(debugPreference) {
        console.log(data);
        win.webContents.send('log', data);
    }
    if(debugPreference) {
        console.log("TrackStatus: " + trackStatus + " SessionStatus: " + sessionStatus);
        win.webContents.send('log', "TrackStatus: " + trackStatus + " SessionStatus: " + sessionStatus);
    }
    if(debugPreference) {
        if (sessionStatus === "Started") {
            console.log("Session status = Started");
            win.webContents.send('log', "Session status = Started");
        }
    }

    if(sessionStatus === "Finalised" || sessionStatus === "Ends") {
        if(debugPreference) {
            console.log("Session status = Finalised or Ends");
            win.webContents.send('log', "Session status = Finalised or Ends");
        }
        if(sessionEndPreference) {
            await controlLightsOff();
        }
        clearInterval(check);
        if (analyticsPreference === true || analyticsSend !== true) {
            await sendAnalytics();
            console.log("Analytics sent!");
            win.webContents.send('log', "Analytics sent!");
            analyticsSend = true;
        }
        app.quit();

    }



    if(debugPreference) {
        console.log("Printing all config values because debug is enabled");
        console.log(userConfig.store);
        win.webContents.send('log', "Printing all config values because debug is enabled");
        win.webContents.send('log', userConfig.store);

    }

    if (check !== trackStatus && sessionStatus !== "Ends" && sessionStatus !== "Finalised") {
        switch (trackStatus) {
            case "1":
                console.log("Green")
                flagSwitchCounter++;
                await controlLightsOn(brightnessSetting, greenColor.r, greenColor.g, greenColor.b);
                win.webContents.send('log', "Green flag detected!");
                check = trackStatus;
                break;
            case "2":
                console.log("Yellow")
                flagSwitchCounter++;
                await controlLightsOn(brightnessSetting, yellowColor.r, yellowColor.g, yellowColor.b);
                win.webContents.send('log', "Yellow flag detected!");
                check = trackStatus;
                break;
            case "4":
                console.log("SC")
                flagSwitchCounter++;
                await controlLightsOn(brightnessSetting, safetyCarColor.r, safetyCarColor.g, safetyCarColor.b);
                win.webContents.send('log', "Safety car detected!");
                check = trackStatus;
                break;
            case "5":
                console.log("Red")
                flagSwitchCounter++;
                await controlLightsOn(brightnessSetting, redColor.r, redColor.g, redColor.b);
                win.webContents.send('log', "Red flag detected!");
                check = trackStatus;
                break;
            case "6":
                console.log("VCS")
                flagSwitchCounter++;
                await controlLightsOn(brightnessSetting, vscColor.r, vscColor.g, vscColor.b);
                win.webContents.send('log', "Virtual safety car detected!");
                check = trackStatus;
                break;
            case "7":
                console.log("VSC Ending")
                flagSwitchCounter++;
                await controlLightsOn(brightnessSetting, vscEndingColor.r, vscEndingColor.g, vscEndingColor.b);
                win.webContents.send('log', "Virtual safety car ending detected!");
                check = trackStatus;
                break;
        }
    }

}

async function controlLightsOn(brightness, r, g, b) {
    const brightnessValue = brightness;
    lightsOnCounter++;

    allLights.forEach((light) => {
        const bulb = new Bulb(light);
        if(debugPreference) {
            console.log("Turning on light: " + light + " with brightness: " + brightnessValue + " and color: " + r + " " + g + " " + b);
            win.webContents.send('log', "Turning on light: " + light + " with brightness: " + brightnessValue + " and color: " + r + " " + g + " " + b);
        }
        bulb.on('connected', (lamp) => {
            try {
                lamp.color(r,g,b);
                lamp.brightness(brightnessValue);
                lamp.onn();
                lamp.disconnect();
            } catch (err) {
                if(debugPreference) {
                    console.log(err)
                    win.webContents.send('log', err);
                }
            }
        });
        bulb.connect();
    });
}


async function controlLightsOff() {
    lightsOffCounter++;

    allLights.forEach((light) => {
        const bulb = new Bulb(light);
        if(debugPreference) {
            console.log("Turning off light: " + light);
            win.webContents.send('log', "Turning off light: " + light);
        }
        bulb.on('connected', (lamp) => {
            try {
                lamp.off();
                lamp.disconnect();
            } catch (err) {
                if (debugPreference) {
                    console.log(err)
                    win.webContents.send('log', err);
                }
            }
        });
        bulb.connect();
    });
}


setInterval(function(){
    getTimingData().catch((err) => {
        if(debugPreference) {
            console.log(err);
            win.webContents.send('log', err);
        }
    });
}, 100);

setTimeout(() => {
    checkApis()
}, 500);
setInterval(function() {
    checkApis()
}, 5000)

function checkApis() {
    https.get(updateURL, function (res) {
        win.webContents.send('updateAPI', 'online')
    }).on('error', function (e) {
        win.webContents.send('updateAPI', 'offline')
    });

    http.get(url, function (res) {
        win.webContents.send('f1mvAPI', 'online')
    }).on('error', function (e) {
        win.webContents.send('f1mvAPI', 'offline')
    });
}

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
        type: 'info',
        buttons: ['Restart', 'Later'],
        title: 'Application Update',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail:
            'A new version has been downloaded. Restart the application to apply the updates.',
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
})

// notify on update available "The update is available. Downloading now... You will be notified when the update is ready to install."
autoUpdater.on('update-available', () => {
    win.webContents.send('log', 'There is a update available. Downloading now... You will be notified when the update is ready to install.')
})

autoUpdater.on('error', (message) => {
    console.error('There was a problem updating the application')
    console.error(message)
})

setInterval(() => {
    autoUpdater.checkForUpdates().then(r => console.log(r) && win.webContents.send('log', r)).catch(e => console.log(e) && win.webContents.send('log', e))
}, 60000)