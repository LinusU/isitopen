
<header>
    <h1>Is It <a href="#">Open</a>?</h1>
</header>

<form action="" method="post">
    <input type="text" placeholder="Agnegatan, Västerås" />
</form>

<article id="venues">
    <img src="{"img/loader.gif"|cdn}" />
</article>

<script type="text/javascript">
    $(function () {
        
        if(!navigator.geolocation) {
            return ;
        }
        
        navigator.geolocation.getCurrentPosition(function (pos) {
            
            isitopen.Search({
                lat: Math.round(pos.coords.latitude * 1E6),
                lon: Math.round(pos.coords.longitude * 1E6),
                state: 'open'
            }, function (venues) {
                
                var $venues = $('#venues').html('');
                
                for(var i in venues) {
                    (function (v) {
                        
                        var $div = $('<section />');
                        
                        v.open = Date.parse(v.open);
                        v.close = Date.parse((v.close == "24:00:00")?"00:00:00":v.close);
                        
                        if(v.open > v.close) {
                            v.close.add(1).day();
                        }
                        
                        $div.append('<h2>' + v.title + '</h2>');
                        
                        var $distance = $('<p />').appendTo($div);
                        
                        $(window).bind('location', function () {
                            $distance.text(isitopen.distance_to(v.lat, v.lon));
                        });
                        
                        var $p = $('<p />').appendTo($div);
                        
                        if(v.open.compareTo(v.close) == 0) {
                            
                            $p.text("Dygnet runt!");
                            
                        } else {
                            
                            var update = function () {
                                var milli = (v.close - (new Date()));
                                var min = Math.ceil(milli / 60000);
                                if(min < 5) { $p.css({ color: 'red', fontWeight: 'bold' }); }
                                if(min < 2) {
                                    var sec = Math.floor(milli / 1000);
                                    $p.text((sec>0)?(sec + " sekunder"):("Stängt!"));
                                    if(sec > 0) { setTimeout(update, milli % 1000); }
                                } else {
                                    $p.text(((min>=60)?(Math.floor(min / 60) + " timm" + (min<120?"e":"ar")):"") + " " + (min % 60) + " minut" + (min % 60 > 1 ? "er" : ""));
                                    setTimeout(update, milli % 60000);
                                }
                            };
                            
                            update();
                            
                        }
                        
                        $div.click(function () {
                            window.open('/' + v.type + '/' + v.name + '/', '_self');
                        });
                        
                        $venues.append($div);
                        
                    })(venues[i]);
                }
                
                navigator.geolocation.watchPosition(function (pos) {
                    isitopen.coords.copy(pos.coords);
                    $(window).trigger('location');
                });
                
            });
        }, jQuery.noop, { maximumAge: 60000 });
        
    });
</script>
