
var request = require('request');
var isitopen = require('./isitopen');

request({ uri: "http://apps.mcdonalds.se/sweden/restSite.nsf/markers?readForm" }, function (error, response, body) {
    
    var markers = JSON.parse(body).markers;
    
    for(var i in markers) {
        isitopen.city({
            title: markers[i].city,
            lat: Math.round(markers[i].lat * 1E6),
            lon: Math.round(markers[i].lng * 1E6)
        });
    }
    
    isitopen.end();
    
});
