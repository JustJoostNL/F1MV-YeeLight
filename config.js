const config = {
    //begin of config file

    // put the url of the livetiming api here (USE THE IP OF YOUR SYSTEM, NOT LOCALHOST)
    TrackStatusURL: 'http://youriphere:10101/api/v1/live-timing/TrackStatus',
    YeeLights: {
        // put all the ips of your lights here (use quotes)
        // if you have multiple lights seperated by a comma (Eg: "192.168.1.1", "192.168.1.2")
        lights: ["ip1", "ip2"],

    Settings: {
        // put the brightness of your lights here (0-100)
        brightness: 100,
        blinkWhenGreenFlag: false,
        blinkWhenRedFlag: true,
        blinkWhenYellowFlag: false,
        blinkWhenSafetyCar: false,
        blinkWhenVSC: false,
        blinkWhenVSCEnding: false,
        timeBetweenBlinks: 500, // in ms

        // put the color of your lights here (0-255)
        green: {
            r: 0,
            g: 255,
            b: 0
        },
        yellow: {
            r: 255,
            g: 255,
            b: 0
        },
        red: {
            r: 255,
            g: 0,
            b: 0
        },
        safetyCar: {
            r: 255,
            g: 255,
            b: 0
        },
        vsc: {
            r: 255,
            g: 255,
            b: 0
        },
        vscEnding: {
            r: 255,
            g: 255,
            b: 0

        }
    }
}

        //end of config file

};

module.exports = config;