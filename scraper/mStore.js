
var jQuery = require('jquery');
var request = require('request');
var isitopen = require('./isitopen');

var $ = jQuery;

request({ uri: "http://mstore.se/m4n?oid=136_" }, function (error, response, body) {
    
    var stores = jQuery(body).find('#centerbox a.action');
    var requests = stores.length;
    
    stores.each(function (i, store) {
        request({ uri: "http://mstore.se" + $(store).attr('href') }, function (error, response, body) {
            
            var hours = [null, null, null, null, null, null, null];
            var text = jQuery(body).find('.centerbox .body').text().replace(/[\s]+/g, " ").replace(/–/g, "-");
            
            var r = /Måndag ?-?t?i?l?l? ?Fredag ?:? ?([0-9]{1,2}:?[0-9]{0,2}) ?- ?([0-9]{1,2}:?[0-9]{0,2})/i.exec(text) ||
                    /Vardagar ?:? ?([0-9]{1,2}:?[0-9]{0,2}) ?- ?([0-9]{1,2}:?[0-9]{0,2})/i.exec(text);
            
            if(r) {
                var d = [isitopen.parse.time(r[1]), isitopen.parse.time(r[2])];
                hours[0] = d; hours[1] = d; hours[2] = d; hours[3] = d; hours[4] = d;
            }
            
            var r = /Lördaga?r? ?:? ?([0-9]{1,2}:?[0-9]{0,2}) ?- ?([0-9]{1,2}:?[0-9]{0,2})/i.exec(text);
            
            if(r) {
                var d = [isitopen.parse.time(r[1]), isitopen.parse.time(r[2])];
                hours[5] = d;
            }
            
            var r = /Söndaga?r? ?:? ?([0-9]{1,2}:?[0-9]{0,2}) ?- ?([0-9]{1,2}:?[0-9]{0,2})/i.exec(text);
            
            if(r) {
                var d = [isitopen.parse.time(r[1]), isitopen.parse.time(r[2])];
                hours[6] = d;
            }
            
            console.log(hours);
            
            if(--requests == 0) {
                isitopen.end();
            }
            
        });
    });
    
    
    /*
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
    */
});
