
isitopen = window.isitopen || {};

isitopen.duration = {
    
    left: function (hours) {
        
        var tmp;
        var now = new Date();
        var day = (now.getDay() + 6) % 7;
        
        if(hours[day] === null) {
            return 0;
        }
        
        var o = Date.parse(hours[day][0]),
            c = Date.parse(hours[day][1] == "24:00:00" ? "00:00:00" : hours[day][1]);
        
        if(c <= o) {
            c.add(1).day();
        }
        
        if(now.between(o, c)) {
            return c - now;
        }
        
        if(hours[(day + 6) % 7] === null) {
            return 0;
        }
        
        o = Date.parse(hours[(day + 6) % 7][0]),
        c = Date.parse(hours[(day + 6) % 7][1] == "24:00:00" ? "00:00:00" : hours[(day + 6) % 7][1]);
        
        if(c <= o) {
            o.add(-1).day();
        } else {
            o.add(-1).day();
            c.add(-1).day();
        }
        
        return ( now.between(o, c) ? c - now : 0 );
    },
    
    format: function (milliseconds) {
        var min = Math.ceil(milliseconds / 60000);
        if(min < 2) {
            var sec = Math.floor(milliseconds / 1000);
            return ((sec>0)?(sec + " sekunder"):("Stängt!"));
        } else {
            return (((min>=60)?(Math.floor(min / 60) + " timm" + (min<120?"e":"ar")):"") + " " + (min % 60) + " minut" + (min % 60 > 1 ? "er" : ""));
        }
    }
    
};
