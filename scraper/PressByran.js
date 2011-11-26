
var jQuery = require('jquery');
var request = require('request');
var isitopen = require('./isitopen');

var $ = jQuery;

request({ uri: "http://www.pressbyran.se/butiker/" }, function (error, response, body) {
    
    var stores = [];
    
    body.replace(/\s+/g, " ").replace(
        /coor \= new google\.maps\.LatLng\(([0-9.]+),([0-9.]+)\)\; createMarker\(map, coor, "([^"]+)", "[^"]+", ""\)/gi,
        function (s, a0, a1, a2) {
            
            var hours = [null, null, null, null, null, null, null];
            var $store = $(a2);
            
            if(a0 == 0 && a1 == 0) {
                return s;
            }
            
            $store.find('li').each(function (i, li) {
                
                var r = /(mån|tis|ons|tors|fre|lör|sön)dag: ([0-9]{1,2}:[0-9]{1,2}) ?- ?([0-9]{1,2}:[0-9]{1,2})/i.exec($(li).text());
                
                if(!r) {
                    throw new Error("Couldn't parse hours: " + $(li).text());
                }
                
                hours[(function (txt) {
                    switch(txt.toLowerCase()) {
                        case 'mån': return 0;
                        case 'tis': return 1;
                        case 'ons': return 2;
                        case 'tors': return 3;
                        case 'fre': return 4;
                        case 'lör': return 5;
                        case 'sön': return 6;
                    }; return 7;
                })(r[1])] = [
                    isitopen.parse.time(r[2]),
                    isitopen.parse.time(r[3])
                ];
                
            });
            
            stores.push({
                "title": isitopen.trim($store.find('h3').text()),
                "type": "convenience",
                "lat": Math.round(a0 * 1E6),
                "lon": Math.round(a1 * 1E6),
                "hours": hours
            });
            
            return s;
        }
    );
    
    var requests = stores.length;
    
    if(requests === 0) {
        isitopen.end();
    }
    
    for(var i=0; i<stores.length; i++) {
        isitopen.venue(stores[i], function () {
            if(--requests == 0) {
                isitopen.end();
            }
        });
    }
    
});
