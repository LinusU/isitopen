
isitopen = window.isitopen || {};

isitopen.mobile = {
    
    _state: {},
    
    displayVenue: function (venue) {
        
        if($('#venue').length) {
            return ;
        }
        
        var state = isitopen.mobile._state;
        var $venue = $($.nano(
            $('#tpl-venue').text(), {
                title: venue.title,
                mon: venue.hours[0]?venue.hours[0][0] + " - " + venue.hours[0][1]:"Stängt",
                tue: venue.hours[1]?venue.hours[1][0] + " - " + venue.hours[1][1]:"Stängt",
                wed: venue.hours[2]?venue.hours[2][0] + " - " + venue.hours[2][1]:"Stängt",
                thu: venue.hours[3]?venue.hours[3][0] + " - " + venue.hours[3][1]:"Stängt",
                fri: venue.hours[4]?venue.hours[4][0] + " - " + venue.hours[4][1]:"Stängt",
                sat: venue.hours[5]?venue.hours[5][0] + " - " + venue.hours[5][1]:"Stängt",
                sun: venue.hours[6]?venue.hours[6][0] + " - " + venue.hours[6][1]:"Stängt"
            }
        )).appendTo('body');
        
        state.header = $('header').html();
        state.title = $('header h1').text();
        
        $('header>div').eq(0).css('WebkitAnimationName', 'cubeout');
        
        setTimeout(function () {
            
            $('header>div').eq(0).hide();
            
            var $back = $('<a class="left back" />').text(state.title);
            var $h1 = $('<h1 />').text(venue.title);
            var $div = $('<div />').append($back).append($h1);
            
            $back.one('click', function () {
                $div.css('WebkitAnimationName', 'cubeout');
                setTimeout(function () {
                    $('header>div').eq(0).show().css('WebkitAnimationName', 'cubein');
                    $div.remove();
                }, 200);
                $venue.addClass('hide');
                setTimeout(function () {
                    $venue.remove();
                }, 400);
            });
            
            $('header').append($div.css('WebkitAnimationName', 'cubein'));
            
        }, 200);
        
    }
    
    
};
