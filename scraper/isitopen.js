
var mysql = require('mysql');
var request = require('request');
var querystring = require('querystring');

var client = mysql.createClient({
    user: 'isitopen',
    password: 'isitopen',
});

client.query("USE `isitopen`");

exports.trim = function (str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

exports.title2name = function (title) {
    return exports.trim(title)
        .toLowerCase()
        .replace(/[´`'"]+/g, "")
        .replace(/[,\-:\/\s]+/g, "-")
        .replace(/å/g, "aa")
        .replace(/[äæ]/g, "ae")
        .replace(/ö/g, "oe")
        .replace(/[ÿý]/g, "y")
        .replace(/[ëêéè]/g, "e")
        .replace(/[üûúù]/g, "u")
        .replace(/[ïîíì]/g, "i")
        .replace(/[ôóò]/g, "o");
};

exports.city = function (city, cb) {
    
    if(!("name" in city)) {
        city.name = exports.title2name(city.title);
    }
    
    client.query(
        "INSERT INTO `city` " +
        "(`name`, `title`, `lat`, `lon`) " +
        "VALUES(?, ?, ?, ?) " +
        "ON DUPLICATE KEY UPDATE " +
        "`title` = ?, `lat` = ?, `lon` = ?",
        [city.name, city.title, city.lat, city.lon,
        city.title, city.lat, city.lon], cb
    );
    
};

exports.venue = function (venue, cb) {
    
    if(!("name" in venue)) {
        venue.name = exports.title2name(venue.title);
    }
    
    client.query(
        "SELECT `id` FROM `city` " +
        "ORDER BY ROUND(SQRT( "+
        "   POW(? - `lat`, 2) + " +
        "   POW(? - `lon`, 2) " +
        ")) ASC LIMIT 1",
        [venue.lat, venue.lon],
        function (err, res) {
            
            if(err) {
                throw err;
            }
            
            var city_id = res[0].id;
            
            if(!city_id) {
                throw Error("Error finding city");
            }
            
            client.query(
                "INSERT INTO `venue` " +
                "(`city_id`, `name`, `title`, `type`, `lat`, `lon`) " +
                "VALUES(?, ?, ?, ?, ?, ?) " +
                "ON DUPLICATE KEY UPDATE " +
                "`city_id` = ?, `title` = ?, `type` = ?, `lat` = ?, `lon` = ?",
                [city_id, venue.name, venue.title, venue.type, venue.lat, venue.lon,
                city_id, venue.title, venue.type, venue.lat, venue.lon]
            );
            
            var hours = {};
            var days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
            
            for(var i in venue.hours) {
                if(venue.hours[i] !== null) {
                    var id = venue.hours[i].join("-");
                    if(id in hours) {
                        hours[id]['weekday'].push(days[i]);
                    } else {
                        hours[id] = {
                            weekday: [days[i]],
                            open: venue.hours[i][0],
                            close: venue.hours[i][1]
                        }
                    }
                }
            }
            
            client.query(
                "SELECT `hours`.`id` " +
                "FROM `venue`, `hours` " +
                "WHERE `hours`.`venue_id` = `venue`.`id` " +
                "AND `venue`.`name` = ?",
                [venue.name],
                function (err, res) {
                    
                    if(err) {
                        throw err;
                    }
                    
                    hours = (function (h) { var a=[]; for(var i in h) { a.push(h[i]); }; return a;})(hours);
                    
                    var ids = [];
                    
                    for(var i in res) {
                        ids.push(res[i].id)
                    }
                    
                    while(ids.length && hours.length) {
                        
                        var i = ids.pop(0);
                        var h = hours.pop(0);
                        
                        client.query(
                            "UPDATE `hours` " +
                            "SET `weekday` = ?, `open` = ?, `close` = ? " +
                            "WHERE `id` = ?",
                            [h.weekday.join(","), h.open, h.close, i]
                        );
                        
                    }
                    
                    while(ids.length) {
                        
                        var i = ids.pop(0);
                        
                        client.query(
                            "DELETE FROM `hours` WHERE `id` = ?",
                            [i]
                        );
                        
                    }
                    
                    while(hours.length) {
                        
                        var h = hours.pop(0);
                        
                        client.query(
                            "INSERT INTO `hours` " +
                            "(`venue_id`, `weekday`, `open`, `close`) " +
                            "VALUES((SELECT `id` FROM `venue` WHERE `name` = ?), ?, ?, ?)",
                            [venue.name, h.weekday, h.open, h.close]
                        );
                        
                    }
                    
                    cb();
                    
                }
            );
            
        }
    );
};

exports.end = function () {
    client.end();
};

/* Parse functions */
exports.parse = {
    time: function (text) {
        var r;
        
        r = /([0-9]{1,2})([.:]?([0-9]{1,2}))?/.exec(text);
        
        if(r) {
            return r[1] + ":" + (r[3]?r[3]:"00");
        }
        
        throw new Error("Unparseable time: " + text);
    },
    duration: function (text) {
        var r;
        
        r = /Stängt/i.exec(text);
        
        if(r) {
            return null;
        }
        
        r = /(([0-9]{1,2})([.:]?([0-9]{1,2}))?) ?(-|to|till) ?(([0-9]{1,2})([.:]?([0-9]{1,2}))?)/i.exec(text);
        
        if(r) {
            return [
                exports.parse.time(r[1]),
                exports.parse.time(r[6])
            ];
        }
        
        throw new Error("Unparseable duration: " + text);
    },
    day: function (text) {
        if(!text) { return null; }
        switch(exports.trim(text.toLowerCase())) {
            case 'mån': case 'måndag': return 0;
            case 'tis': case 'tisdag': return 1;
            case 'ons': case 'onsdag': return 2;
            case 'tor': case 'tors': case 'torsdag': return 3;
            case 'fre': case 'fredag': return 4;
            case 'lör': case 'lördag': return 5;
            case 'sön': case 'söndag': return 6;
        }
        
        throw new Error("Unparseable day: " + text);
    },
    days: function (text) {
        
        var ret = [];
        var data = text.split(/-|till/i);
        
        if(data.length == 1) {
            if(data[0].match(/alla dagar/i)) {
                return [0, 1, 2, 3, 4, 5, 6]; 
            } else {
                return [exports.parse.day(data[0])];
            }
        }
        
        if(data.length != 2) {
            throw new Error("Unparseable days: " + text);
        }
        
        var b = exports.parse.day(data[0]);
        var e = exports.parse.day(data[1]);
        
        for(var i=b; i!=e; i=(i+1)%7) {
            ret.push(i);
        }
        
        ret.push(e);
        
        return ret;
    }
};

/* GeoCoding */
exports.geocode = function (opt, callback) {
    
    client.query(
        "SELECT * FROM `geocode` " +
        "WHERE `city` = ? " +
        "AND `postcode` = ? " +
        "AND `street` = ? ",
        [opt.city, opt.postcode, opt.street],
        function (err, res) {
            
            if(err) {
                throw err;
            }
            
            if(res.length > 0) {
                callback(res[0]);
                return ;
            }
            
            var options = {
                format: 'json',
                countrycodes: opt.country,
                q: opt.street + ", " + opt.city
            };
            
            request({ uri: 'http://nominatim.openstreetmap.org/search?' + querystring.stringify(options) }, function (error, response, body) {
                
                var data = JSON.parse(body);
                
                opt.lat = null;
                opt.lon = null;
                
                if(data.length == 1) {
                    opt.lat = Math.round(data[0].lat * 1E6);
                    opt.lon = Math.round(data[0].lon * 1E6);
                } else {
                    
                    var matched = null;
                    
                    for(var i in data) {
                        var reg = new RegExp(", " + opt.postcode.substr(0, 3) + " ?" + opt.postcode.substr(3) + ",");
                        if(reg.test(data[i])) {
                            if(matched === null) {
                                matched = data[i];
                            } else {
                                matched = null;
                                break ;
                            }
                        }
                    }
                    
                    if(matched !== null) {
                        opt.lat = Math.round(matched.lat * 1E6);
                        opt.lon = Math.round(matched.lon * 1E6);
                    }
                    
                }
                
                client.query(
                    "INSERT INTO `geocode` " +
                    "(`city`, `postcode`, `street`, `lat`, `lon`) " +
                    "VALUES(?, ?, ?, ?, ?)",
                    [opt.city, opt.postcode, opt.street, opt.lat, opt.lon],
                    function () {  }
                );
                
                callback(opt);
            });
            
        }
    )
    
};
