
var mysql = require('mysql');

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
        .replace(/[-:\/\s]+/g, "-")
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
                "(`city_id`, `name`, `title`, `lat`, `lon`) " +
                "VALUES(?, ?, ?, ?, ?) " +
                "ON DUPLICATE KEY UPDATE " +
                "`city_id` = ?, `title` = ?, `lat` = ?, `lon` = ?",
                [city_id, venue.name, venue.title, venue.lat, venue.lon,
                city_id, venue.title, venue.lat, venue.lon]
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
