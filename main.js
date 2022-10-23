'use strict';

const config = require('./config');
const { Bulb } = require('yeelight.io');
const fetch = require('node-fetch').default;
const url = config.TrackStatusURL;
let check;

const allLights = config.YeeLights.lights;

async function getTimingData(){
    let a = await fetch(url);
    const data = await a.json();

    if(check !== data.Status) {
        switch (data.Status) {
            case "1":
                console.log("Green")
                await controlLights(100, 0,255, 0);
                check = data.Status;
                break;
            case "2":
                console.log("Yellow")
                await controlLights(100, 255,255, 0);
                check = data.Status;
                break;
            case "4":
                console.log("SC")
                await controlLights(100, 255, 255, 0);
                check = data.Status;
                break;
            case "5":
                console.log("Red")
                await controlLights(100, 255, 0, 0);
                check = data.Status;
                break;
            case "6":
                console.log("VCS")
                await controlLights(100, 255, 255, 0);
                check = data.Status;
                break;
            case "7":
                console.log("VSC Ending")
                await controlLights(100, 255, 255, 0);
                check = data.Status;
                break;
        }
    }

}

async function controlLights(brightness, color) {
    const brightnessValue = brightness;
    const colorValue = color;

allLights.forEach((light) => {
    const bulb = new Bulb(light);
        bulb.connect();
        bulb.color(colorValue)
        bulb.brightness(brightnessValue);
        bulb.onn();
        bulb.disconnect();
});
}


getTimingData();
setInterval(getTimingData, 100);