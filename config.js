const config = {
    //begin of config file

    // put the url of the livetiming api here
    TrackStatusURL: 'http://localhost:10101/api/v1/live-timing/TrackStatus',
    YeeLights: {
        // put all the ips of your lights here (use quotes)
        // if you have multiple lights seperated by a comma (Eg: "192.168.1.1", "192.168.1.2")
        lights: ["ip1", "ip2"]

        //end of config file
    }
};

module.exports = config;