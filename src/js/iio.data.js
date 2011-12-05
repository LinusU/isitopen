
isitopen = window.isitopen || {};

isitopen.data = {
    
    _store: function (city) {
        city.stored = (new Date()).getTime();
        localStorage.setItem(city.name, JSON.stringify(city));
    },
    _fetch: function (name) {
        var city = localStorage.getItem(name);
        
        if(!city) { return null; }
        city = JSON.parse(city);
        
        if(city.stored < (new Date()).getTime() - 604800000) {
            localStorage.removeItem(name);
            return null;
        }
        
        return city;
    },
    
    fetch: function (name, callback) {
        /*
        var city = isitopen.data._fetch(name);
        
        if(city !== null) {
            setTimeout(callback, 0, city);
            return ;
        }
        */
        $.getJSON(
            '/data/' + name + '/',
            function (data) {
                //isitopen.data._store(data);
                callback(data);
            }
        );
        
    }
    
};
