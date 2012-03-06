
var jQuery = require('jquery');
var request = require('request');
var isitopen = require('./isitopen');

var $ = jQuery;

request({ uri: "http://www.7eleven.se/sokbutik.php" }, function (error, response, body) {
    
    var r = /var kmlFile = "([^"]+)";/.exec(body);
    
    if(!r) { throw new Error("Couldn't locate kmlFile"); }
    
    request({ uri: "http://www.7eleven.se/" + r[1] }, function (error, response, body) {
        
        var stores = $('Placemark', body);
        var requests = stores.length;
        
        if(requests === 0) {
            throw new Error("No stores found...");
        }
        
        stores.each(function (i, store) {
            
            var $store = $(store);
            var hours = [null, null, null, null, null, null, null];
            var latlon = $store.find('coordinates').text().split(',');
            
            var desc = $store.find('description').text().replace(/(Mån|Tis|Ons|Tors|Fre|Lör|Sön)dag: ([0-9\.]+-[0-9\.]+)/g, function (s, a0, a1) {
                var d = isitopen.parse.day(a0);
                hours[d] = isitopen.parse.duration(a1);
                if(hours[d][1] == "23:59") { hours[d][1] = "24:00"; }
                return s;
            });
            
            isitopen.venue({
                "title": isitopen.trim($store.find('storetype').text()),
                "type": "convenience",
                "lat": Math.round(parseInt(latlon[0]) * 1E6),
                "lon": Math.round(parseInt(latlon[1]) * 1E6),
                "hours": hours
            }, function () {
                if(--requests == 0) {
                    isitopen.end();
                }
            });
            
        });
        
    });
    
});
