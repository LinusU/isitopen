
var jQuery = require('jquery');
var request = require('request');
var isitopen = require('./isitopen');

var date = require('./lib/phpjs/date').date;

var $ = jQuery;

request({ uri: "http://www.sibylla.se/UI/Pages/GoogleMaps/GetData.aspx" }, function (error, response, body) {
    
    var data = JSON.parse(body);
    var requests = data.length;
    
    if(requests == 0) {
        isitopen.end();
    }
    
    $.each(data, function (i, o) {
        
        var save = true;
        var hours = [null, null, null, null, null, null, null];
        
        var h = o.OpeningHours.replace(/&nbsp;/g, ' ').replace(/(\s|&nbsp;)+/g, ' ').replace(/<\/?div>/ig, '').replace(/Alla dagar<BR>/ig, 'Alla dagar').split(/ ?\<br ?\/?\> ?/i);
        
        $.each(h, function (i, txt) {
            
            txt = txt.replace(/<[a-z0-9= ]+>/ig, '');
            
            if(txt == "") { return ; }
            if(hours === false) { return ; }
            if(txt.match(/^öppet?t(ider)?:?$/i)) { return ; }
            if(hours.indexOf(null) === -1) { return ; }
            
            if(txt.match(/^vinter(tid)?:?$/i)) {
                save = (date('I') == 0);
                return ;
            }
            
            if(txt.match(/^sommar(tid)?:?$/i)) {
                save = (date('I') == 1);
                return ;
            }
            
            if(txt.match(/^(Gatukök:?|Högsäsong|Alla dagar|november ?- ?mars|sept ?- ?april|april ?- ?september|11\/11 2011 - 21\/12 2011|Öppettider sommar|\*\) sommartid)$/i)) {
                hours = false;
                return ;
            }
            
            if(save === false) { return ; }
            
            var r;
            
            r = /((alla?|varje) daga?r?),? ?(([0-9.:]+ ?(-|till) ?[0-9.:]+)|dygnet runt)\.?/i.exec(txt);
            
            if(r) {
                var d = ( r[3].match(/dygnet runt/i) ? ["00:00:00", "24:00:00"] : isitopen.parse.duration(r[4]) );
                hours[0] = d; hours[1] = d; hours[2] = d; hours[3] = d; hours[4] = d; hours[5] = d; hours[6] = d;
                return ;
            }
            
            r = /månd?a?g? ?- ?(tis|ons|tors)d?a?g?:? ([0-9.:]+ ?- ?[0-9.:]+)/i.exec(txt);
            
            if(r) {
                var d = isitopen.parse.duration(r[2]);
                hours[0] = d; hours[1] = d;
                if(!r[1].match(/tis/i)) { hours[2] = d; }
                if(r[1].match(/tors/i)) { hours[3] = d; }
                return ;
            }
            
            r = /(månd?a?g? ?- ?fred?a?g?|vardagar):? ([0-9.:]+ ?- ?[0-9.:]+)/i.exec(txt);
            
            if(r) {
                var d = isitopen.parse.duration(r[2]);
                hours[0] = d; hours[1] = d; hours[2] = d; hours[3] = d; hours[4] = d;
                return ;
            }
            
            r = /(fred?a?g? ?- ?lörd?a?g?):? ([0-9.:]+ - [0-9.:]+)/i.exec(txt);
            
            if(r) {
                var d = isitopen.parse.duration(r[2]);
                hours[4] = d; hours[5] = d;
                return ;
            }
            
            r = /(lörd?a?g? ?- ?sönd?a?g?|helger):? ([0-9.:]+ - [0-9.:]+)/i.exec(txt);
            
            if(r) {
                var d = isitopen.parse.duration(r[2]);
                hours[5] = d; hours[6] = d;
                return ;
            }
            
            r = /(ons|tors|fre|lör|sön)daga?r?( och helgdag)? ([0-9.: ]+ ?- ?[0-9.:]+)/i.exec(txt);
            
            if(r) {
                var d = isitopen.parse.duration(r[3].replace(/ /g, ''));
                hours[ (r[1] == "ons") ? 2 : ( (r[1] == "tors") ? 3 : ( (r[1] == "fre") ? 4 : ( (r[1] == "lör") ? 5 : 6 ) ) ) ] = d;
                return ;
            }
            
            r = /(sön|mån)dag - torsdag ([0-9.:]+ - [0-9.:]+)/i.exec(txt);
            
            if(r) {
                var d = isitopen.parse.duration(r[2]);
                if(r[1] == "sön") { hours[6] = d; }
                hours[0] = d; hours[1] = d; hours[2] = d; hours[3] = d;
                return ;
            }
            
            r = /Tors-fred ([0-9.:]+-[0-9.:]+), Lörd ([0-9.:]+-[0-9.:]+)/i.exec(txt);
            
            if(r) {
                hours[3] = isitopen.parse.duration(r[1]);
                hours[4] = isitopen.parse.duration(r[1]);
                hours[5] = isitopen.parse.duration(r[2]);
                return ;
            }
            
            r = /lö ([0-9.:]+ - [0-9.:]+) sö ([0-9.:]+ - [0-9.:]+)/i.exec(txt);
            
            if(r) {
                hours[5] = isitopen.parse.duration(r[1]);
                hours[6] = isitopen.parse.duration(r[2]);
                return ;
            }
            
            r = /(sön)dag stängt/i.exec(txt);
            
            if(r) {
                hours[6] = null; return ;
            }
            
            throw new Error('Unparseable hours: { text: "' + txt + '" }');
        });
        
        var title = (o.Name.match(/Sibylla/i)) ? o.Name : "Sibylla " + o.Name ;
        
        if(title == "Sibyllagrillen") {
            if(o.Image == "/upload/KitchenIllustrations/Gällivare-2009.jpg") { title += " Gällivare"; }
            if(o.Image == "/upload/KitchenIllustrations/Gatukök-080927-016-Kävlinge.jpg") { title += " Kävlinge"; }
            if(o.Image == "/upload/KitchenIllustrations/Storuman-2009.jpg") { title += " Storuman"; }
        }
        
        if(hours === false) {
            if(--requests == 0) {
                isitopen.end();
            }
            return ;
        }
        
        isitopen.venue({
            "title": title,
            "type": "restaurant",
            "lat": Math.round(o.Lat * 1E6),
            "lon": Math.round(o.Lan * 1E6),
            "hours": hours
        }, function () {
            if(--requests == 0) {
                isitopen.end();
            }
        });
        
    });
    
});
