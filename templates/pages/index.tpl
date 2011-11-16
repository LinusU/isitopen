
<form action="" method="post">
    
    <h1>Is It <a href="#">Open</a>?</h1>
    
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
                        $div.append('<p>' + isitopen.distance(v.distance) + '</p>');
                        
                        var $p = $('<p />');
                        
                        if(v.open.compareTo(v.close) == 0) {
                            
                            $p.text("Dygnet runt!");
                            
                        } else {
                            
                            var update = function () {
                                var min = Math.floor((v.close - (new Date())) / 60000);
                                $p.text(((min>=60)?(Math.floor(min / 60) + " timm" + (min<120?"e":"ar")):"") + " " + (min % 60) + " minuter");
                                if(min < 5) { $p.css({ color: 'red', fontWeight: 'bold' }); }
                            };
                            
                            setInterval(update, 60000);
                            update();
                            
                        }
                        
                        $div.append($p);
                        
                        $div.click(function () {
                            
                        });
                        
                        $venues.append($div);
                        
                    })(venues[i]);
                }
                
            });
        });
        
    });
</script>
