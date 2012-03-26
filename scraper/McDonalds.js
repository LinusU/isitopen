
var jQuery = require('jquery');
var request = require('request');
var isitopen = require('./isitopen');

var $ = jQuery;

request({ uri: "http://apps.mcdonalds.se/sweden/restSite.nsf/markers?readForm" }, function (error, response, body) {
    
    var data = JSON.parse(body).markers;
    var requests = data.length;
    
    console.log(requests);
    
    if(requests == 0) {
        isitopen.end();
    }
    
    $.each(data, function (i, o) {
        
        request({ uri: "http://apps.mcdonalds.se/sweden/restSite.nsf/maps/" + o.unid }, function (error, response, body) {
            
            var hours = []
            
            for(var i in o.openhours) {
                if(o.openhours[i] == "always,1") {
                    hours.push(["00:00", "24:00"])
                } else {
                    hours.push(o.openhours[i].split(","))
                }
            }
            
            isitopen.venue({
                "title": "McDonalds " + isitopen.trim($(body).find('#rest-info-area .heading h2').eq(0).text()),
                "type": "fastfood",
                "lat": Math.round(o.lat * 1E6),
                "lon": Math.round(o.lng * 1E6),
                "hours": hours
            }, function () {
                if(--requests == 0) {
                    isitopen.end();
                }
            });
            
        });
        
    });
    
});
