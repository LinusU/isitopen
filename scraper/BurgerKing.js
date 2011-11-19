
var jQuery = require('jquery');
var request = require('request');

var $ = jQuery;

function parseTime(text) {
    var r;
    
    r = /([0-9]{1,2})([.:]?([0-9]{1,2}))?/.exec(text);
    
    if(r) {
        return r[1] + ":" + (r[3]?r[3]:"00");
    }
    
    throw new Error("Unparseable time: " + text);
}

function assembleDay(r, mon, tue, wed, thu, fri, sat, sun) {
    var h = [], d = [null];
    for(var i=1;i<r.length;i+=1) { h.push(parseTime(r[i])); }
    for(var i=0;i<h.length;i+=2) { d.push([h[i+0], h[i+1]]); }
    return [d[mon], d[tue], d[wed], d[thu], d[fri], d[sat], d[sun]];
}

function parseHours(text, url) {
    
    if(!text) {
        return [null, null, null, null, null, null, null];
    }
    
    text = text.replace(/\r?\n/g, " ").replace(/ +/g, " ").replace("–", "-");
    
    var r;
    
    r = /(Alla dagar|Mån-Sön):? ?([0-9.:]+) ?- ?([0-9.:]+)/i.exec(text);
    if(r) { return assembleDay([r[0], r[2], r[3]], 1, 1, 1, 1, 1, 1, 1); }
    
    r = /([0-9.:]+)-([0-9.:]+) alla dagar/i.exec(text);
    if(r) { return assembleDay(r, 1, 1, 1, 1, 1, 1, 1); }
    
    r = /Vardagar: ([0-9.:]+)-([0-9.:]+) Helger: ([0-9.:]+)-([0-9.:]+)/i.exec(text);
    if(r) { return assembleDay(r, 1, 1, 1, 1, 1, 2, 2); }
    
    r = /Mån ?- ?Fre:? ([0-9.:]+) ?- ?([0-9.:]+),? Lör ?- ?Sön:? ([0-9.:]+) ?- ?([0-9.:]+)/i.exec(text);
    if(r) { return assembleDay(r, 1, 1, 1, 1, 1, 2, 2); }
    
    r = /mån-lör ([0-9.:]+)-([0-9.:]+), sön ([0-9.:]+)-([0-9.:]+)/i.exec(text);
    if(r) { return assembleDay(r, 1, 1, 1, 1, 1, 1, 2); }
    
    r = /sönd?a?g?-tors?d?a?g?:? ?([0-9.:]+)-([0-9.:]+),? ?fred?a?g?-lörd?a?g?:? ?([0-9.:]+)-([0-9.:]+)/i.exec(text);
    if(r) { return assembleDay(r, 1, 1, 1, 1, 2, 2, 1); }
    
    r = /månd?a?g? ?- ?fred?a?g?:? ([0-9.:]+) ?- ?([0-9.:]+),? ?Lörd?a?g?:? ([0-9.:]+) ?- ?([0-9.:]+),? ?Sönd?a?g?:? ([0-9.:]+) ?- ?([0-9.:]+)/i.exec(text);
    if(r) { return assembleDay(r, 1, 1, 1, 1, 1, 2, 3); }
    
    r = /Mån-ons ([0-9.:]+)-([0-9.:]+) Tors-fre ([0-9.:]+)-([0-9.:]+) Lör-sön ([0-9.:]+)-([0-9.:]+)/i.exec(text);
    if(r) { return assembleDay(r, 1, 1, 1, 2, 2, 3, 3); }
    
    //                           . That is not an ordinary space, stupid Burger King!
    r = /Månd?a?g?-Torsd?a?g?:? ? ?([0-9.:]+)-([0-9.:]+),? ?Fred?a?g? ?- ?Lörd?a?g?:? ?([0-9.:]+)-([0-9.:]+),? ?Sönd?a?g?a?r? ?o?c?h? ?h?e?l?g?d?a?g?a?r?:? ?([0-9.:]+)-([0-9.:]+)/i.exec(text);
    if(r) { return assembleDay(r, 1, 1, 1, 1, 2, 2, 3); }
    
    r = /Mån-tors ([0-9.:]+)-([0-9.:]+), Fre ([0-9.:]+)-([0-9.:]+), Lör ([0-9.:]+)-([0-9.:]+)/i.exec(text);
    if(r) { return assembleDay(r, 1, 1, 1, 1, 2, 3, 0); }
    
    r = /Mån-tis: ([0-9.:]+)-([0-9.:]+) ?Ons-tors ([0-9.:]+)-([0-9.:]+) ?Fre-lör ([0-9.:]+)-([0-9.:]+) ?Sön ([0-9.:]+)-([0-9.:]+)/i.exec(text);
    if(r) { return assembleDay(r, 1, 1, 2, 2, 3, 3, 4); }
    
    r = /mån-ons ([0-9.:]+)-([0-9.:]+) tors- fre ([0-9.:]+)-([0-9.:]+) lör ([0-9.:]+)-([0-9.:]+) sön :([0-9.:]+)-([0-9.:]+)/i.exec(text);
    if(r) { return assembleDay(r, 1, 1, 1, 2, 2, 3, 4); }
    
    r = /mån-tors:? ?([0-9.:]+)-([0-9.:]+),? fre:? ?([0-9.:]+)-([0-9.:]+),? lör:? ?([0-9.:]+)-([0-9.:]+),? sön:? ?([0-9.:]+)-([0-9.:]+)/i.exec(text);
    if(r) { return assembleDay(r, 1, 1, 1, 1, 2, 3, 4); }
    
    r = /Måndag: ([0-9.:]+)-([0-9.:]+)Tisdag ([0-9.:]+)-([0-9.:]+)Onsdag ([0-9.:]+)-([0-9.:]+)Torsdag ([0-9.:]+)-([0-9.:]+)Fredag ([0-9.:]+)-([0-9.:]+)Lördag ([0-9.:]+)-([0-9.:]+)Söndag ([0-9.:]+)-([0-9.:]+)/i.exec(text);
    if(r) { return assembleDay(r, 1, 2, 3, 4, 5, 6, 7);}
    
    r = /^([0-9.:]+) ?- ?([0-9.:]+)$/i.exec(text);
    if(r) { return assembleDay(r, 1, 1, 1, 1, 1, 1, 1); }
    
    if(url == "/restauranger/goteborg/liseberg-balder/") { return null; }
    if(url == "/restauranger/helsingborg/vala/") { return null; }
    if(url == "/restauranger/lund/") { return null; }
    if(url == "/restauranger/stockholm/stockholm-central2/") { return null; }
    
    throw new Error('Unparseable hours: { url: "' + url + '", text: "' + text + '" }');
}

request({ uri: "http://www.burgerking.se/t/RestaurantsXML.aspx" }, function (error, response, body) {
    
    var restaurants = jQuery(body).find('restaurant');
    
    restaurants.each(function (i, rest) {
        request({ uri: "http://www.burgerking.se" + $(rest).attr('url') }, function (error, response, body) {
            
            var hours = parseHours(jQuery(body).find('.openinghours').text(), $(rest).attr('url'));
            
            console.log({
                "name": "burgerking-" + $(rest).attr('name').toLowerCase().replace(/ /g, "-").replace(/[åä]/g, "a").replace(/ö/g, "o"),
                "title": "Burger King " + $(rest).attr('name'),
                "type": "restaurant",
                "lat": Math.round($(rest).attr('latitude') * 1E6),
                "lon": Math.round($(rest).attr('longitude') * 1E6),
                "hours": hours
            });
            
        });
    });
    
});
