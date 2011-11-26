
isitopen = window.isitopen || {};

isitopen.coords = {
    lat: 0,
    lon: 0,
    copy: function (coords) {
        isitopen.coords.lat = Math.round(coords.latitude * 1E6);
        isitopen.coords.lon = Math.round(coords.longitude * 1E6);
    }
};

isitopen.distance_to = function (lat, lon) {
    
    if(isitopen.coords.lat == 0 && isitopen.coords.lon == 0) {
        return "x km";
    }
    
    return isitopen.distance(Math.sqrt(
        Math.pow(isitopen.coords.lat - lat, 2) +
        Math.pow(isitopen.coords.lon - lon, 2)
    ));
    
};

isitopen.distance = function (md) {
    return Math.round(md / 14.4128501);
};

isitopen.meter2text = function (m) {
    if(m < 100) {
        return "Ett stenkast";
    } if(m < 1000) {
        return m + " meter";
    } if(m < 10000) {
        return (Math.round(m / 100) / 10) + " km";
    } else {
        return Math.round(m / 1000) + " km";
    }
};
