
var jQuery = require('jquery');
var request = require('request');
var isitopen = require('./isitopen');

var $ = jQuery;

request({ uri: "http://max.se/restauranger.aspx" }, function (error, response, body) {
    
    var restaurants = [];
    
    body.replace(
        /map\.addOverlay\(createMarker\(new GLatLng\(([0-9.]+), ([0-9.]+)\),"Max i ([^"]+)","([^"]+)","restaurang\.aspx\?id=([0-9]+)"\)\)/g,
        function (s, a0, a1, a2, a3, a4) {
            
            restaurants.push({
                lat: Math.round(a0 * 1E6),
                lon: Math.round(a1 * 1E6),
                town: a2,
                title: isitopen.trim(a3.replace(/\s+/g, " ")),
                max_id: a4
            });
            
            return s;
        }
    );
    
    var requests = restaurants.length;
    
    $.each(restaurants, function (i, rest) {
        request({ uri: "http://max.se/restaurang.aspx?id=" + rest.max_id }, function (error, response, body) {
            
            var hours = [];
            
            jQuery(body).find('.content .pic table').eq(0).find('td').eq(1).text().replace(
                /([0-9]{1,2}:[0-9]{1,2}) - ([0-9]{1,2}:[0-9]{1,2})/g,
                function (s, a0, a1) {
                    hours.push([a0 + ":00", a1 + ":00"]);
                    return s;
                }
            );
            
            isitopen.venue({
                "name": "max-" + isitopen.title2name(rest.title),
                "title": "Max " + rest.title,
                "type": "restaurant",
                "lat": rest.lat,
                "lon": rest.lon,
                "hours": hours
            }, function () {
                if(--requests == 0) {
                    isitopen.end();
                }
            });
            
        });
    });
    
});
