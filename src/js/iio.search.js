
isitopen = window.isitopen || {};

isitopen.Search = function (data, callback) {
    
    $.ajax({
        url: '/search/',
        dataType: 'json',
        data: data,
        success: callback,
        type: "POST"
    });
    
};
