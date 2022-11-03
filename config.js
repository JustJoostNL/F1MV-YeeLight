const config = {
    //begin of config file

    // put the url of the livetiming api here (USE THE IP OF YOUR SYSTEM, NOT LOCALHOST) (Eg. http://192.168.1.33/api/v1/live-timing/TrackStatus)
    LiveTimingURL: 'http://YOURIPHERE:10101/api/v2/live-timing/state/SessionStatus,TrackStatus',
    YeeLights: {
        // put all the ips of your lights here (use quotes)
        // if you have multiple lights seperated by a comma (Eg: "192.168.1.1", "192.168.1.2")
        lights: ["192.168.1.1", "192.168.1.2"],

    Settings: {
        // put the brightness of your lights here (0-100)
        brightness: 100,
        // automatically turn off the lights after the session is over
        turnOffWhenSessionEnds: true,

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
    },

    // update channel, you can choose between "latest", "beta" and "alpha"
    updateChannel: "latest",

    //analytics
    // if you want to help me improve this project, you can enable analytics
    // this will send me some data about how many times the lights have been switched on and off, etc...
    // this will not send any personal data
    // if you want to disable this, set this to false

    analytics: true,

    //debug mode
    // if you want to see more logs, set this to true
    debug: false
}

        //end of config file

};

module.exports = config;