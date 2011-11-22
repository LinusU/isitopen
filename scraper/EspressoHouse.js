
var jQuery = require('jquery');
var request = require('request');
var isitopen = require('./isitopen');

var $ = jQuery;

request({ uri: "http://www.espressohouse.se/kaffebarer.aspx" }, function (error, response, body) {
    
    var stores = jQuery(body).find('.showcoffee option');
    var requests = stores.length;
    
    stores.each(function (i, store) {
        
        if($(store).attr('value') == 'baralla') {
            --requests;
            return ;
        }
        
        request({ uri: "http://www.espressohouse.se/" + $(store).attr('value') + ".aspx" }, function (error, response, body) {
            
            var stores = $(body).find('.store');
            var subrequests = stores.length;
            
            stores.each(function (i, s) {
                
                var hours = [null, null, null, null, null, null, null];
                var text = $(s).find('.column1').eq(2).html().split(/\s*\<br ?\/?\>\s*/ig);
                var title = $(s).find('.column1').eq(0).find('h4').text().replace(/\s+/g, " ");
                
                $.each(text, function (i, text) {
                    
                    if(text == "" || text == "Öppetider:") {
                        return ;
                    }
                    
                    var r = /^M-F ([0-9]{1,2}[:.]?[0-9]{0,2}) ?- ?([0-9]{1,2}[:.]?[0-9]{0,2})/i.exec(text);
                    
                    if(r) {
                        var d = [isitopen.parse.time(r[1]), isitopen.parse.time(r[2])];
                        hours[0] = d; hours[1] = d; hours[2] = d; hours[3] = d; hours[4] = d;
                    }
                    
                    var r = /^L-S ([0-9]{1,2}[:.]?[0-9]{0,2}) ?- ?([0-9]{1,2}[:.]?[0-9]{0,2})/i.exec(text);
                    
                    if(r) {
                        var d = [isitopen.parse.time(r[1]), isitopen.parse.time(r[2])];
                        hours[5] = d; hours[6] = d;
                    }
                    
                    var r = /^L ([0-9]{1,2}[:.]?[0-9]{0,2}) ?- ?([0-9]{1,2}[:.]?[0-9]{0,2})/i.exec(text);
                    
                    if(r) {
                        var d = [isitopen.parse.time(r[1]), isitopen.parse.time(r[2])];
                        hours[5] = d;
                    }
                    
                    var r = /^S ([0-9]{1,2}[:.]?[0-9]{0,2}) ?- ?([0-9]{1,2}[:.]?[0-9]{0,2})/i.exec(text);
                    
                    if(r) {
                        var d = [isitopen.parse.time(r[1]), isitopen.parse.time(r[2])];
                        hours[6] = d;
                    }
                    
                });
                
                $(s).find('.column1').eq(0).find('h4').remove();
                var address = $(s).find('.column1').eq(0).html().split(/\s*\<br ?\/?\>\s*/ig);
                
                var r = /^([0-9]{3}) ?([0-9]{2}) ?(.*)$/.exec(address[1]);
                
                if(!r) {
                    if(--subrequests == 0) {
                        if(--requests == 0) {
                            isitopen.end();
                        }
                    }
                    return ;
                }
                
                isitopen.geocode({
                    country: 'se',
                    city: r[3],
                    postcode: r[1]+r[2],
                    street: isitopen.trim(address[0])
                }, function (data) {
                    
                    if(data.lat !== null && data.lon !== null) {
                        isitopen.venue({
                            name: "espressohouse-" + isitopen.title2name(title),
                            title: "Espresso House " + title,
                            type: 'cafe',
                            lat: data.lat,
                            lon: data.lon,
                            hours: hours
                        }, function () {
                            if(--subrequests == 0) {
                                if(--requests == 0) {
                                    isitopen.end();
                                }
                            }
                        });
                    } else {
                        if(--subrequests == 0) {
                            if(--requests == 0) {
                                isitopen.end();
                            }
                        }
                    }
                    
                });
                
            });
            
        });
    });
    
});
