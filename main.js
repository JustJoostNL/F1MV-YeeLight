'use strict';

const { autoUpdater } = require("electron-updater")
const { dialog } = require('electron')

const config = require('./config');
const { Bulb } = require('yeelight.io');
const fetch = require('node-fetch').default;
const process = require('process');
const url = config.LiveTimingURL
const sleep = ms => new Promise(r => setTimeout(r, ms));

const brightnessSetting = config.YeeLights.Settings.brightness;

const timeBetweenBlinks = config.YeeLights.Settings.timeBetweenBlinks;

const greenColor = config.YeeLights.Settings.green;
const yellowColor = config.YeeLights.Settings.yellow;
const redColor = config.YeeLights.Settings.red;
const safetyCarColor = config.YeeLights.Settings.safetyCar;
const vscColor = config.YeeLights.Settings.vsc;
const vscEndingColor = config.YeeLights.Settings.vscEnding;
const blinkWhenGreenFlag = config.YeeLights.Settings.blinkWhenGreenFlag;
const blinkWhenRedFlag = config.YeeLights.Settings.blinkWhenRedFlag;
const blinkWhenYellowFlag = config.YeeLights.Settings.blinkWhenYellowFlag;
const blinkWhenSafetyCar = config.YeeLights.Settings.blinkWhenSafetyCar;
const blinkWhenVSC = config.YeeLights.Settings.blinkWhenVSC;
const blinkWhenVSCEnding = config.YeeLights.Settings.blinkWhenVSCEnding;
const analyticsURL = 'https://api.joost.systems/yeelight/analytics';
const analyticsPreference = config.YeeLights.analytics;
const debugPreference = config.YeeLights.debug;
const sessionEndPreference = config.YeeLights.Settings.turnOffWhenSessionEnds
let analyticsSend = false;


let flagSwitchCounter = 0;

let lightsOnCounter = 0;
let lightsOffCounter = 0;

const timesBlinking = config.YeeLights.Settings.timesBlinking;

const allLights = config.YeeLights.lights;


let check;

autoUpdater.channel = config.YeeLights.channel;


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
            "config": config,
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
        }
    }
}



async function getTimingData() {
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
    }
    if(debugPreference) {
        console.log("TrackStatus: " + trackStatus + " SessionStatus: " + sessionStatus);
    }
    if(debugPreference) {
        if (sessionStatus === "Started") {
            console.log("Session status = Started");
        }
    }

    if(sessionStatus === "Finalised" || sessionStatus === "Ends") {
        if(debugPreference) {
            console.log("Session status = Finalised or Ends");
        }
        if(sessionEndPreference) {
            await controlLightsOff();
        }
    }

    if(sessionStatus === "Finalised" || sessionStatus === "Ends") {
        if(debugPreference) {
            console.log("Session status = Finalised or Ends");
        }
        await controlLightsOff();
        clearInterval(check);
        if (analyticsPreference === true || analyticsSend !== true) {
            await sendAnalytics();
            console.log("Analytics sent!");
            analyticsSend = true;
        }
        app.quit();

    }



    if(debugPreference) {
        console.log("Printing all config values because debug is enabled");
        console.log(config);

    }

    if (check !== trackStatus && sessionStatus !== "Ends" && sessionStatus !== "Finalised") {
        switch (trackStatus) {
            case "1":
                console.log("Green")
                flagSwitchCounter++;
                if(blinkWhenGreenFlag === false) {
                    await controlLightsOn(brightnessSetting, greenColor.r, greenColor.g, greenColor.b);
                }
                if (blinkWhenGreenFlag) {
                    await blink(brightnessSetting, greenColor.r, greenColor.g, greenColor.b);
                }
                check = trackStatus;
                break;
            case "2":
                console.log("Yellow")
                flagSwitchCounter++;
                if(blinkWhenYellowFlag === false) {
                await controlLightsOn(brightnessSetting, yellowColor.r, yellowColor.g, yellowColor.b);
                }
                if (blinkWhenYellowFlag) {
                    await blink(brightnessSetting, yellowColor.r, yellowColor.g, yellowColor.b);
                }
                check = trackStatus;
                break;
            case "4":
                console.log("SC")
                flagSwitchCounter++;
                if(blinkWhenSafetyCar === false) {
                await controlLightsOn(brightnessSetting, safetyCarColor.r, safetyCarColor.g, safetyCarColor.b);
                }
                if (blinkWhenSafetyCar) {
                    await blink(brightnessSetting, safetyCarColor.r, safetyCarColor.g, safetyCarColor.b);
                }
                check = trackStatus;
                break;
            case "5":
                console.log("Red")
                flagSwitchCounter++;
                if(blinkWhenRedFlag === false) {
                await controlLightsOn(brightnessSetting, redColor.r, redColor.g, redColor.b);
                }
                if (blinkWhenRedFlag) {
                    await blink(brightnessSetting, redColor.r, redColor.g, redColor.b);
                }
                check = trackStatus;
                break;
            case "6":
                console.log("VCS")
                flagSwitchCounter++;
                if(blinkWhenVSC === false) {
                await controlLightsOn(brightnessSetting, vscColor.r, vscColor.g, vscColor.b);
                }
                if (blinkWhenVSC) {
                    await blink(brightnessSetting, vscColor.r, vscColor.g, vscColor.b);
                }
                check = trackStatus;
                break;
            case "7":
                console.log("VSC Ending")
                flagSwitchCounter++;
                if(blinkWhenVSCEnding === false) {
                await controlLightsOn(brightnessSetting, vscEndingColor.r, vscEndingColor.g, vscEndingColor.b);
                }
                if (blinkWhenVSCEnding) {
                    await blink(brightnessSetting, vscEndingColor.r, vscEndingColor.g, vscEndingColor.b);
                }
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
        }
        bulb.on('connected', (lamp) => {
            try {
                lamp.color(r,g,b);
                lamp.brightness(brightnessValue);
                lamp.onn();
                lamp.disconnect();
            } catch (err) {
                console.log(err)
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
        }
        bulb.on('connected', (lamp) => {
            try {
                lamp.off();
                lamp.disconnect();
            } catch (err) {
                console.log(err)
            }
        });
        bulb.connect();
    });
}

let cd = false;
async function blink(brightness, color) {
    if (!cd) {
        cd = true;
        for (let i = 1; i <= timesBlinking; i++) {
            console.log(`count: ${i}/${timesBlinking}`)
            await controlLightsOn(brightness, color);
            console.log(Math.floor(new Date().getTime() / 1000))
            await sleep(timeBetweenBlinks);
            await controlLightsOn(brightness, color);
            console.log(Math.floor(new Date().getTime() / 1000))
            await sleep(timeBetweenBlinks);
            await controlLightsOn(brightness, color);
            console.log(Math.floor(new Date().getTime() / 1000))
            await sleep(timeBetweenBlinks);
            await console.log(`${i}/${timesBlinking} done blinking`)

            if (i === timesBlinking) {
                console.log('done')
                cd = false;
            }
        }
    }
}


getTimingData().catch((err) => {
    console.log(err);
});
setInterval(getTimingData, 100);



const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
    if(debugPreference) {
        console.log("Creating window...");
    }
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {

        }
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        autoUpdater.checkForUpdates();
        let startTime = new Date();
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed',  async() => {

    console.log("Closing window and sending analytics...");

    if (process.platform !== 'darwin') {
        if(analyticsPreference === true || analyticsSend === false) {
            await sendAnalytics().catch((err) => {
                analyticsSend = true;
                console.log(err);
            });
        }
        app.quit()


    }
})

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

autoUpdater.on('error', (message) => {
    console.error('There was a problem updating the application')
    console.error(message)
})

setInterval(() => {
    autoUpdater.checkForUpdates()
}, 60000)