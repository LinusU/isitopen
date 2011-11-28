<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <title>Is It Open</title>
    <link rel="shortcut icon" href="{"favicon.png"|cdn}" />
    <link rel="stylesheet" type="text/css" href="{"mobile.min.css"|cdn}" />
    <style type="text/css">
    @font-face {
        font-family: 'Roboto';
        src: url('{"font/Roboto-Regular-webfont.eot"|cdn}');
        src: url('{"font/Roboto-Regular-webfont.eot?#iefix"|cdn}') format('embedded-opentype'),
             url('{"font/Roboto-Regular-webfont.woff"|cdn}') format('woff'),
             url('{"font/Roboto-Regular-webfont.ttf"|cdn}') format('truetype'),
             url('{"font/Roboto-Regular-webfont.svg#RobotoRegular"|cdn}') format('svg');
        font-weight: normal;
        font-style: normal;
    }
    </style>
    <script type="text/javascript" src="{"jquery-1.7.min.js"|cdn}"></script>
    <script type="text/javascript">
        
        $.holdReady(true);
        
        $.ajax({
            cache: true,
            dataType: 'script',
            url: "{"iio.min.js"|cdn}",
            success: function() { $.holdReady(false); }
        });
        
    </script>
    <meta name="viewport" content="user-scalable=no, width=device-width" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <script type="text/javascript">
        
        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-XXXXXXXX-X']);
        _gaq.push(['_trackPageview']);
        
        (function() {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();
        
    </script>
</head>
<body>
    
    <header>
        <h1>Västerås</h1>
    </header>
    
    <article id="venues">
        
        
        
        
        
    </article>
    
    {literal}
    <script type="text/pure" id="tpl-open">
        <section class="open">
            <h2>{title}</h2>
            <p>{distance}</p>
            <p>{duration}</p>
        </section>
    </script>
    
    <script type="text/pure" id="tpl-closed">
        <section class="closed">
            <h2>{title}</h2>
        </section>
    </script>
    
    <script type="text/pure" id="tpl-venue">
        <article id="venue">
            <h1>{title}</h1>
            <table>
                <tr><td>Måndag:</td><td>{mon}</td></tr>
                <tr><td>Tisdag:</td><td>{tue}</td></tr>
                <tr><td>Onsdag:</td><td>{wed}</td></tr>
                <tr><td>Torsdag:</td><td>{thu}</td></tr>
                <tr><td>Fredag:</td><td>{fre}</td></tr>
                <tr><td>Lördag:</td><td>{sat}</td></tr>
                <tr><td>Söndag:</td><td>{sun}</td></tr>
            </table>
        </article>
    </script>
    {/literal}
    
    <script type="text/javascript">
        $(function () {
            
            var venues = [];
            
            var duration = function (hours) {
                
                var tmp;
                var now = new Date();
                var day = (now.getDay() + 6) % 7;
                
                if(hours[day] === null) {
                    return 0;
                }
                
                var o = Date.parse(hours[day][0]),
                    c = Date.parse(hours[day][1] == "24:00:00" ? "00:00:00" : hours[day][1]);
                
                if(c < o) {
                    c.add(1).day();
                }
                
                if(now.between(o, c)) {
                    return c - now;
                }
                
                o = Date.parse(hours[(day + 6) % 7][0]),
                c = Date.parse(hours[(day + 6) % 7][1] == "24:00:00" ? "00:00:00" : hours[day][1]);
                
                if(c < o) {
                    o.add(-1).day();
                } else {
                    o.add(-1).day();
                    c.add(-1).day();
                }
                
                return ( now.between(o, c) ? c - now : 0 );
            };
            
            var refreshDistance = function () {
                
                $.each(venues, function () {
                    this.__distance__ = isitopen.distance_to(this.lat, this.lon);
                });
                
                venues.sort(function (a, b) {
                    return ( a.__distance__ > b.__distance__ ? 1 : -1 );
                });
                
                return refresh();
            };
            
            var refreshDuration = function () {
                
                var now = new Date();
                var next = 60000 - (now % 60000);
                
                $.each(venues, function () {
                    this.__duration__ = duration(this.hours);
                    if(this.__duration__ > 0 && this.__duration__ <= 60000) {
                        next = 1000 - (now % 1000);
                    }
                });
                
                setTimeout(refreshDuration, next);
                
                return refresh();
            };
            
            var refresh = function () {
                
                if(isitopen.coords.lat == 0 && isitopen.coords.lon == 0) {
                    return ;
                }
                
                var html = '';
                
                $.each(venues, function () {
                    
                    var data = {
                        title: this.title,
                        distance: isitopen.meter2text(this.__distance__),
                        duration: (function () {
                            var min = Math.ceil(this.__duration__ / 60000);
                            if(min < 2) {
                                var sec = Math.floor(this.__duration__ / 1000);
                                return ((sec>0)?(sec + " sekunder"):("Stängt!"));
                            } else {
                                return (((min>=60)?(Math.floor(min / 60) + " timm" + (min<120?"e":"ar")):"") + " " + (min % 60) + " minut" + (min % 60 > 1 ? "er" : ""));
                            }
                        }).apply(this)
                    };
                    
                    if(this.__duration__ > 0) {
                        html += $.nano($('#tpl-open').text(), data);
                    } else {
                        html += $.nano($('#tpl-closed').text(), data);
                    }
                    
                });
                
                $('#venues').html(html);
            };
            
            var state = {};
            var display = function (venue) {
                
                var $venue = $($.nano(
                    $('#tpl-venue').text(), {
                        title: venue.title,
                        mon: venue.hours[0][0] + " - " + venue.hours[0][1],
                        tue: venue.hours[1][0] + " - " + venue.hours[1][1],
                        wed: venue.hours[2][0] + " - " + venue.hours[2][1],
                        thu: venue.hours[3][0] + " - " + venue.hours[3][1],
                        fri: venue.hours[4][0] + " - " + venue.hours[4][1],
                        sat: venue.hours[5][0] + " - " + venue.hours[5][1],
                        sun: venue.hours[6][0] + " - " + venue.hours[6][1],
                    }
                ));
                
                $venue.css({
                    left: $(window).width()
                }).animate({
                    left: 0
                });
                
            };
            
            navigator.geolocation.watchPosition(function (pos) {
                isitopen.coords.copy(pos.coords);
                $(window).trigger('location');
            });
            
            $.getJSON(
                "/data/vaesteraas/",
                function (data) {
                    venues = data.data;
                    refreshDuration();
                    refreshDistance();
                }
            );
            
            $(window).bind('location', refreshDistance);
            /*
            $('#venues').live('click', function () {
                display(venues[0]);
            });
            */
        });
    </script>
    
</body>
</html>