
var RT90 = require('./lib/RT90');
var jQuery = require('jquery');
var request = require('request');
var isitopen = require('./isitopen');

var $ = jQuery;

var importStores = function (stores, cb) {
    stores.each(function (i, store) {
        
        var hours = [null, null, null, null, null, null, null];
        var title = isitopen.trim($(store).find('dl dt a').eq(0).text().replace(/\s+/g, " "));
        
        var uls = $(store).find('ul').length;
        if(uls != 3 && uls != 5) { cb(); return ; }
        if(title == "Coop Nära Lannavaara") { cb(); return ; }
        if($(store).find('.mapLink').length != 1) { cb(); return ; }
        
        var $li = $(store).find('ul').eq(1).find('li');
        
        $(store).find('ul').eq(0).find('li').each(function (j, li) {
            var days = isitopen.parse.days($(li).text());
            var dura = isitopen.parse.duration($li.eq(j).text());
            for(var d in days) { hours[days[d]] = dura; }
        });
        
        var xy = [null, null];
        $(store).find('.mapLink').attr('href').replace(/Point([XY])\=([0-9]+)\&/g, function (s, a0, a1) {
            xy[(a0=="X"?0:1)] = parseInt(a1); return s;
        });
        
        var latlon = RT90.RT90toWGS84(xy[0], xy[1]);
        
        if(!title.match(/^coop/i)) {
            title = "Coop " + title;
        }
        
        isitopen.venue({
            "title": title,
            "type": "convenience",
            "lat": Math.round(latlon[0] * 1E6),
            "lon": Math.round(latlon[1] * 1E6),
            "hours": hours
        }, cb);
        
    });
};

request({ uri: "http://www.coop.se/Sok/Butikssok/?storeType=coop_n%C3%A4ra%7ccoop_konsum%7ccoop_extra%7ccoop_forum&showOtherStores=False&q=*" }, function (error, response, body) {
    
    var $body = jQuery(body);
    
    var stores = $body.find('.shopResult');
    var shoptop = $body.find('.shopTop h5').text();
    
    r = /Visar butik ([0-9]+) \- ([0-9]+) av ([0-9]+)/.exec(shoptop);
    
    if(!r) { isitopen.end(); return ; }
    
    var requests = parseInt(r[3]);
    var perPage = (parseInt(r[2]) - (parseInt(r[1]) - 1));
    var numPages = Math.ceil(requests / perPage);
    
    importStores(stores, function () {
        if(--requests == 0) {
            isitopen.end();
        }
    });
    
    var bn = 1;
    
    var loadNext = function () { console.log("bn=" + bn);
        request({ uri: "http://www.coop.se/Sok/Butikssok/?storeType=coop_n%C3%A4ra%7ccoop_konsum%7ccoop_extra%7ccoop_forum&showOtherStores=False&q=*&bn=" + (++bn) }, function (error, response, body) {
            importStores(jQuery(body).find('.shopResult'), function () {
                if(--requests == 0) {
                    isitopen.end();
                }
            });
            if(bn <= numPages) { loadNext(); }
        });
    };
    
    loadNext();
    
});
