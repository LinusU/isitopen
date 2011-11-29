
var jQuery = require('jquery');
var request = require('request');
var isitopen = require('./isitopen');

var $ = jQuery;

request({ uri: "http://dressmann.com/se/index.asp?id=35393" }, function (error, response, body) {
    
    var stores = jQuery(body).find('.active_country .shop_element');
    var requests = stores.length;
    
    stores.each(function (i, store) {
        
        var $store = $(store);
        var hours = [null, null, null, null, null, null, null];
        
        $store.find('.hours').text().replace(
            /(mån|tis|ons|tors|fre|lör|sön)(-(mån|tis|ons|tors|fre|lör|sön))?:? ?([0-9:.]+-[0-9:.]+|Stängt)/ig,
            function (s, a0, a1, a2, a3) {
                
                var d = [isitopen.parse.day(a0), isitopen.parse.day(a2)];
                var h = (a3.match(/stängt/i)?null:isitopen.parse.duration(a3));
                
                if(d[1] === null || d[0] == d[1]) {
                    hours[d[0]] = h;
                    return s;
                }
                
                if(d[1] < d[0]) {
                    d[1] += 7;
                }
                
                for(var i=d[0]; i<=d[1]; i++) {
                    hours[i % 7] = h;
                }
                
                return s;
            }
        );
        
        var latlon = $store.find('.coordinate').text().split(",");
        
        isitopen.venue({
            title: $store.find('.shopname').text().replace("DressmannXL", "Dressmann XL"),
            type: 'clothing',
            lat: Math.round(latlon[0] * 1E6),
            lon: Math.round(latlon[1] * 1E6),
            hours: hours
        }, function () {
            if(--requests == 0) {
                isitopen.end();
            }
        });
        
    });
    
});
