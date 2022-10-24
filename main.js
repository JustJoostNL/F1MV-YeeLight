'use strict';

const config = require('./config');
const { Bulb } = require('yeelight.io');
const fetch = require('node-fetch').default;
const url = config.TrackStatusURL;

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

const timesBlinking = config.YeeLights.Settings.timesBlinking;

const allLights = config.YeeLights.lights;


let check;


async function getTimingData(){
    let a = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await a.json();

    if(check !== data.Status) {
        switch (data.Status) {
            case "1":
                console.log("Green")
                await controlLightsOn(brightnessSetting, greenColor.r, greenColor.g, greenColor.b);
                if(blinkWhenGreenFlag) {
                    for (let i = 0; i < timesBlinking; i++) {
                        await controlLightsOff();
                        await sleep(timeBetweenBlinks);
                        await controlLightsOn(brightnessSetting, greenColor.r, greenColor.g, greenColor.b);
                        await sleep(timeBetweenBlinks);
                    }
                }
                check = data.Status;
                break;
            case "2":
                console.log("Yellow")
                await controlLightsOn(brightnessSetting, yellowColor.r, yellowColor.g, yellowColor.b);
                if(blinkWhenYellowFlag) {
                    for (let i = 0; i < timesBlinking; i++) {
                        await controlLightsOff();
                        await sleep(timeBetweenBlinks);
                        await controlLightsOn(brightnessSetting, yellowColor.r, yellowColor.g, yellowColor.b);
                        await sleep(timeBetweenBlinks);
                    }
                }
                check = data.Status;
                break;
            case "4":
                console.log("SC")
                await controlLightsOn(brightnessSetting, safetyCarColor.r, safetyCarColor.g, safetyCarColor.b);
                if(blinkWhenSafetyCar) {
                    for (let i = 0; i < timesBlinking; i++) {
                        await controlLightsOff();
                        await sleep(timeBetweenBlinks);
                        await controlLightsOn(brightnessSetting, safetyCarColor.r, safetyCarColor.g, safetyCarColor.b);
                        await sleep(timeBetweenBlinks);
                    }
                }
                check = data.Status;
                break;
            case "5":
                console.log("Red")
                await controlLightsOn(brightnessSetting, redColor.r, redColor.g, redColor.b);
                if(blinkWhenRedFlag) {
                    for (let i = 0; i < timesBlinking; i++) {
                        await controlLightsOff();
                        await sleep(timeBetweenBlinks);
                        await controlLightsOn(brightnessSetting, redColor.r, redColor.g, redColor.b);
                        await sleep(timeBetweenBlinks);
                    }
                }
                check = data.Status;
                break;
            case "6":
                console.log("VCS")
                await controlLightsOn(brightnessSetting, vscColor.r, vscColor.g, vscColor.b);
                if(blinkWhenVSC) {
                    for (let i = 0; i < timesBlinking; i++) {
                        await controlLightsOff();
                        await sleep(timeBetweenBlinks);
                        await controlLightsOn(brightnessSetting, vscColor.r, vscColor.g, vscColor.b);
                        await sleep(timeBetweenBlinks);
                    }
                }
                check = data.Status;
                break;
            case "7":
                console.log("VSC Ending")
                await controlLightsOn(brightnessSetting, vscEndingColor.r, vscEndingColor.g, vscEndingColor.b);
                if(blinkWhenVSCEnding) {
                    for (let i = 0; i < timesBlinking; i++) {
                        await controlLightsOff();
                        await sleep(timeBetweenBlinks);
                        await controlLightsOn(brightnessSetting, vscEndingColor.r, vscEndingColor.g, vscEndingColor.b);
                        await sleep(timeBetweenBlinks);
                    }
                }
                check = data.Status;
                break;
        }
    }

}

async function controlLightsOn(brightness, r, g, b) {
    const brightnessValue = brightness;

    allLights.forEach((light) => {
        const bulb = new Bulb(light);
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

    allLights.forEach((light) => {
        const bulb = new Bulb(light);
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


getTimingData();
setInterval(getTimingData, 100);


const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
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
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})