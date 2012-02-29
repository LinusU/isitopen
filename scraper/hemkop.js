
var jQuery = require('jquery');
var request = require('request');
var isitopen = require('./isitopen');

var $ = jQuery;

request({ uri: "http://www.hemkop.se/Hitta-butik/" }, function (error, response, body) {
    
    var r = /var storeLayer = (\[.*\])\;/.exec(body);
    if(!r) { return ; }
    
    var stores = JSON.parse(r[1]);
    var requests = stores.length;
    
    $.each(stores, function (i, store) {
        
        if(store.ID == 288 || store.ID == 203 || store.ID == 201) {
            if(--requests == 0) {
                isitopen.end();
            }
            return ;
        }
        
        var title = store.Name;
        var hours = [null, null, null, null, null, null, null];
        
        if(!title.match(/^hemköp/i)) {
            title = "Hemköp " + title;
        }
        
        var stop = false;
        $.each(store.OpeningHours.split(/\<br ?\/\>/), function (j, h) {
            if(stop || (isitopen.trim(h) == "")) { return ; }
            if(h.match(/Ordinarie öppettider/)) { return ; }
            if(h.match(/Variationer vid helgdagar kan förekomma/)) { return ; }
            if(h.match(/Postens öppettider|Öppettider Post|Delidisken|Förbutik/i)) { stop = true; return ; }
            var parts = isitopen.trim(h).split(" ");
            var days = isitopen.parse.days(parts.slice(0, -1).join(" "));
            var dura = isitopen.parse.duration(parts.slice(-1).join(" "));
            for(var d in days) { hours[days[d]] = dura; }
        });
        
        isitopen.venue({
            "title": title,
            "type": "convenience",
            "lat": Math.round(store.Location.Latitude * 1E6),
            "lon": Math.round(store.Location.Longitude * 1E6),
            "hours": hours
        }, function () {
            if(--requests == 0) {
                isitopen.end();
            }
        });
        
    });
    
});
