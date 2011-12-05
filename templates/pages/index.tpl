
<header>
    <h1>Is It <a href="#">Open</a>?</h1>
	    
    <form action="" method="post">
        <input type="text" placeholder="Agnegatan, Västerås" />
    </form>
    <a id="optionstoggler" href="javascript:toggleOptions();">Alternativ</a>

	<div id="options">
		<form >
			<label for="">Visa </label> <a id="venuetypechoose">allt</a> <label for="">som är</label>
			<select>
				<option>
					Öppet
				</option>	
				<option>
					Existerande
				</option>
				<option>
					Stängt
				</option>
			</select>
			
			
		</form>
	</div>
    
</header>

<article id="venues">    
    
    <img src="{"img/loader.gif"|cdn}" />
    
</article>

<script type="text/javascript">
    $(function () {
        
        if(!navigator.geolocation) {
            return ;
        }
        
        navigator.geolocation.getCurrentPosition(function (pos) {
            
            isitopen.coords.copy(pos.coords);
            
            isitopen.Search({
                lat: isitopen.coords.lat,
                lon: isitopen.coords.lon,
                state: 'open'
            }, function (venues) {
                
                var $venues = $('#venues');
                
                $venues.find('img, section').remove();
                
                for(var i in venues) {
                    (function (v) {
                        
                        var $div = $('<section />');
                        
                        $div.data('lat', v.lat);
                        $div.data('lon', v.lon);
                        
                        v.open = Date.parse(v.open);
                        v.close = Date.parse((v.close == "24:00:00")?"00:00:00":v.close);
                        
                        if(v.open > v.close) {
                            v.close.add(1).day();
                        }
                        
                        $div.append('<h2>' + v.title + '</h2>');
                        
                        var $distance = $('<p />').appendTo($div);
                        
                        $(window).bind('location', function () {
                            $distance.text(isitopen.meter2text(isitopen.distance_to(v.lat, v.lon)));
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
                
                $(window).trigger('location');
                
                navigator.geolocation.watchPosition(function (pos) {
                    isitopen.coords.copy(pos.coords);
                    $(window).trigger('location');
                });
                
                $(window).bind('location', function () {
                    
                    var el = $('#venues section'),
                        sort = [].sort;
                    
                    el.data('distance', false);
                    
                    sort.call(el, function (a, b) {
                        
                        var da = $(a).data('distance'),
                            db = $(b).data('distance');
                        
                        if(da === false) { $(a).data('distance', da = isitopen.distance_to($(a).data('lat'), $(a).data('lon'))); }
                        if(db === false) { $(b).data('distance', db = isitopen.distance_to($(b).data('lat'), $(b).data('lon'))); }
                        
                        return ( da > db ? 1 : -1 );
                    }).each(function () {
                        $('#venues').append($(this));
                    });
                    
                });
                
            });
        }, jQuery.noop, { maximumAge: 60000 });
        
    });
</script>
