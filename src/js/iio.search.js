
isitopen = window.isitopen || {};

isitopen.Search = {
    
    'near': function (lat, lon, callback) {
        
        $.getJSON(
            '/search/near/',
            {lat: lat, lon: lon},
            callback
        );
        
    }
    
    
};
