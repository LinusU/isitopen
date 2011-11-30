
var jQuery = require('jquery');
var request = require('request');
var isitopen = require('./isitopen');

var $ = jQuery;

request({ uri: "http://www.medstop.se/hitta-apotek" }, function (error, response, body) {
    
    var stores = jQuery(body).find('.vocabindex a');
    var requests = stores.length;
    
    stores.each(function (i, store) {
        
        request({ uri: "http://www.medstop.se" + $(store).attr('href') }, function (error, response, body) {
            
            var stores = [];
            
            body.replace(
                /markers\.push\(\{lat: ([0-9\.]+), lng: ([0-9\.]+), text: '([^']+)'\}\)/gi,
                function (s, a0, a1, a2) {
                    
                    var $a2 = $('<div>' + a2 + '</div>');
                    var hours = [null, null, null, null, null, null, null];
                    
                    $a2.find('.oh-display').each(function (i, text) {
                        
                        var $text = $(text);
                        
                        var h = isitopen.parse.duration($text.find('.oh-display-hours').text());
                        
                        $text.find('.oh-display-hours').remove();
                        var d = isitopen.parse.day(isitopen.trim($text.text()));
                        
                        hours[d] = h;
                    });
                    
                    stores.push({
                        "title": $a2.find('b').eq(0).text(),
                        "type": "pharmacy",
                        "lat": Math.round(a0 * 1E6),
                        "lon": Math.round(a1 * 1E6),
                        "hours": hours
                    });
                    
                }
            );
            
            var subrequests = stores.length;
            
            if(subrequests === 0) {
                if(--requests == 0) {
                    isitopen.end();
                }
            }
            
            for(var i=0; i<stores.length; i++) {
                isitopen.venue(stores[i], function () {
                    if(--subrequests == 0) {
                        if(--requests == 0) {
                            isitopen.end();
                        }
                    }
                });
            }
            
        });
    });
    
});
