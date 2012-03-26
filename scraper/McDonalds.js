
var jQuery = require('jquery');
var request = require('request');
var isitopen = require('./isitopen');

var $ = jQuery;

request({ uri: "http://apps.mcdonalds.se/sweden/restSite.nsf/markers?readForm" }, function (error, response, body) {
    
    var data = JSON.parse(body).markers;
    var requests = data.length;
    
    if(requests == 0) {
        isitopen.end();
    }
    
    $.each(data, function (i, o) {
        
        request({ uri: "http://apps.mcdonalds.se/sweden/restSite.nsf/maps/" + o.unid }, function (error, response, body) {
            
            var hours = []
            
            for(var i=1;i<=7;i++) {
                if(o.openhours[i % 7] == "always,1") {
                    hours.push(["00:00", "24:00"])
                } else {
                    hours.push(o.openhours[i % 7].split(","))
                }
            }
            
            var title = isitopen.trim($(body).find('#rest-info-area .heading h2').eq(0).text());
            
            if(!/^Mc ?Donald'?s /.test(title)) {
                title = "McDonald's " + title;
            }
            
            var name = o.vanityname;
            
            if(/^mcdonalds/.test(name)) {
                name = "mcdonalds-" + name.substring(9);
            } else {
                name = "mcdonalds-" + name;
            }
            
            isitopen.venue({
                "name": name,
                "title": title,
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
