
var jQuery = require('jquery');
var request = require('request');
var isitopen = require('./isitopen');

var $ = jQuery;

request({ uri: "http://www.netonnet.se/content/marketing/%C3%B6ppettider" }, function (error, response, body) {
    
    var stores = [];
    
    jQuery(body).find('table').each(function (i, o) {
        
        var data = $(o).find('td').eq(1).find('font');
        
        var title = data.eq(0).text();
        
        if(!title.match(/^Lagershop /)) {
            return ;
        }
        
        title = "NetOnNet " + title.substring(10);
        
        var rows = data.text().split(/[\n\r]+/);
        var state = 0;
        
        var coords = [null, null];
        var hours = [null, null, null, null, null, null, null];
        
        for(var j=0; j<rows.length; j++) {
            
            if(rows[j].match(/^\s+$/i)) {
                continue ;
            }
            
            if(rows[j].match(/Öppettider/i)) {
                state = 1;
                continue ;
            }
            
            if(rows[j].match(/GPS-koordinater/i)) {
                state = 2;
                continue ;
            }
            
            if(rows[j].match(/Klicka här för karta från Google/i)) {
                state = 3;
                continue ;
            }
            
            var parts = rows[j].split(":");
            
            if(state == 1) {
                var days = isitopen.parse.days(isitopen.trim(parts[0]));
                for(var d in days) {
                    hours[days[d]] = isitopen.parse.duration(isitopen.trim(parts[1]));
                }
            }
            
            if(state == 2) {
                coords[parts[0].match('Lat')?0:1] = isitopen.parse.coord(isitopen.trim(parts[1]));
            }
            
        }
        
        stores.push({
            title: title,
            type: "retail",
            lat: coords[0],
            lon: coords[1],
            hours: hours
        });
        
    });
    
    requests = stores.length;
    
    $.each(stores, function (i, o) {
        isitopen.venue(o, function () {
            if(--requests == 0) {
                isitopen.end();
            }
        });
    });
    
});
