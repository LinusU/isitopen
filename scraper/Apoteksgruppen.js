
var jQuery = require('jquery');
var request = require('request');
var isitopen = require('./isitopen');

var $ = jQuery;

request({ uri: "http://www.apoteksgruppen.se/vara_apotek/" }, function (error, response, body) {
    
    var stores = jQuery(body).find('#store_list a');
    var requests = stores.length;
    
    stores.each(function (i, store) {
        
        request({ uri: "http://www.apoteksgruppen.se" + $(store).attr('href') }, function (error, response, body) {
            
            var $d = $(body).find('.details');
            var hours = [null, null, null, null, null, null, null];
            
            $d.find('.additionalinfo div').each(function (i, div) {
                
                var $div = $(div);
                
                var d = isitopen.parse.day(isitopen.trim($div.find('span').text()));
                
                $div.find('span').remove();
                var h = isitopen.parse.duration($div.text());
                
                hours[d] = h;
                
            });
            
            var lat = null, lon = null;
            
            body.replace(
                /var (lat|lng)=([0-9\.]+)\;/g,
                function (s, a0, a1) {
                    if(a0 == "lat") { lat = a1; }
                    if(a0 == "lng") { lon = a1; }
                }
            );
            
            var name = $d.find('.name').text();
            var city = $d.find('.city').text();
            
            if(name.match(city) === null) {
                name += " " + city;
            }
            
            isitopen.venue({
                "title": name,
                "type": "pharmacy",
                "lat": Math.round(lat * 1E6),
                "lon": Math.round(lon * 1E6),
                "hours": hours
            }, function () {
                if(--requests == 0) {
                    isitopen.end();
                }
            });
            
        });
    });
    
});
