
isitopen = window.isitopen || {};

isitopen.distance = function (md) {
    
    var m = Math.round(md / 14.4128501);
    
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