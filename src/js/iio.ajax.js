
(function ($, History) {
    
    if(!History.enabled) {
        return ;
    }
    
    var update_links = function ($root) {
        $root.find('a').click(function (event) {
            if(event.which == 2 || event.metaKey) { return true; }
            History.pushState(null, null, $(this).attr('href'));
            event.preventDefault();
            return false;
        });
    };
    
    $(window).bind('statechange', function () {
        console.log("LINUS HAR STÖRST");
        var state = History.getState();
        
        $.ajax({
            url: state.url,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            success: function (data) {
                $('#site').html(data);
                update_links($('#site'));
            }
        });
        
    });
    
    var win_open = window.open;
    
    window.open = function (url, target, features) {
        if(target == '_self') {
            History.pushState(null, null, url);
        } else {
            win_open(url, target, features);
        }
    };
    
    update_links($('body'));
    
})(jQuery, window.History);
