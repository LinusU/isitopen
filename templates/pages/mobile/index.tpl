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
    @-webkit-keyframes slidein {
        from { -webkit-transform: translate3d(100%, 0px, 0px); }
        to { -webkit-transform: translate3d(0%, 0px, 0px); }
    }
    @-webkit-keyframes slideout {
        from { -webkit-transform: translate3d(0%, 0px, 0px); }
        to { -webkit-transform: translate3d(100%, 0px, 0px); }
    }
    @-webkit-keyframes cubein {
        from { -webkit-transform: translate3d(0px, 50%, 0px) rotate3d(1, 0, 0, 90deg); opacity: .5; }
        to { -webkit-transform: translate3d(0px, 0%, 0px) rotate3d(1, 0, 0, 0deg); opacity: 1; }
    }
    @-webkit-keyframes cubeout {
        from { -webkit-transform: translate3d(0px, 0%, 0px) rotate3d(1, 0, 0, 0deg); opacity: 1; }
        to { -webkit-transform: translate3d(0px, -50%, 0px) rotate3d(1, 0, 0, 90deg); opacity: .5; }
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
    
    {literal}
    <script type="text/html" id="tpl-splash">
        <div id="splash">
            
            <h1>Is It Open?</h1>
            
            <p>
                Is It Open är den perfekta appen för dig som vill vet om saker är öppet, bla bla bla! Nihil labore
                dolor in beard laboris. Elit laboris adipisicing, PBR laborum magna consectetur nostrud four loko
                irony Austin raw denim yr. Tempor helvetica synth, nostrud laborum iphone nisi eiusmod organic
                aliquip assumenda adipisicing wolf non DIY.
            </p>
            
            <div id="msg">
                För att installera appen, klicka på {icon} här nedan, och välj <strong>"{text}"</strong>.
            </div>
            
        </div>
    </script>
    
    <script type="text/html" id="tpl-main">
        <header>
            <div><h1>{title}</h1></div>
        </header>
        <article id="venues"></article>
    </script>
    
    <script type="text/html" id="tpl-open">
        <section class="open">
            <h2>{title}</h2>
            <p>{distance}</p>
            <p>{duration}</p>
        </section>
    </script>
    
    <script type="text/html" id="tpl-closed">
        <section class="closed">
            <h2>{title}</h2>
        </section>
    </script>
    
    <script type="text/html" id="tpl-venue">
        <article id="venue">
            <h1>{title}</h1>
            <table>
                <tr><td>Måndag:</td><td>{mon}</td></tr>
                <tr><td>Tisdag:</td><td>{tue}</td></tr>
                <tr><td>Onsdag:</td><td>{wed}</td></tr>
                <tr><td>Torsdag:</td><td>{thu}</td></tr>
                <tr><td>Fredag:</td><td>{fri}</td></tr>
                <tr><td>Lördag:</td><td>{sat}</td></tr>
                <tr><td>Söndag:</td><td>{sun}</td></tr>
            </table>
        </article>
    </script>
    {/literal}
    
    <script type="text/javascript">
        $(function () {
            
            if(!window.navigator.standalone) {
                
                var OSVersion = navigator.appVersion.match(/OS \d+_\d+/g);
                OSVersion = OSVersion ? OSVersion[0].replace(/[^\d_]/g,'').replace('_','.')*1 : 0;
                
                var $splash = $($.nano($('#tpl-splash').text(), {
                    icon: (OSVersion >= 4.2 ? '<span class="share"></span>' : '<span class="plus">+</span>'),
                    text: (navigator.language == "sv-se" ? "Lägg till på hemskärmen" : "Add to Home Screen")
                }));
                
                $('body').append($splash);
                
                return ;
            }
            
            $('body').append($.nano($('#tpl-main').text(), {
                title: 'Västerås'
            }));
            
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
                
                if(c <= o) {
                    c.add(1).day();
                }
                
                if(now.between(o, c)) {
                    return c - now;
                }
                
                if(hours[(day + 6) % 7] === null) {
                    return 0;
                }
                
                o = Date.parse(hours[(day + 6) % 7][0]),
                c = Date.parse(hours[(day + 6) % 7][1] == "24:00:00" ? "00:00:00" : hours[(day + 6) % 7][1]);
                
                if(c <= o) {
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
                        distance: isitopen.meter2text((this.__distance__ === undefined)?NaN:this.__distance__),
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
                
                if($('#venue').length) {
                    return ;
                }
                
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
                
            };
            
            navigator.geolocation.watchPosition(function (pos) {
                isitopen.coords.copy(pos.coords);
                $(window).trigger('location');
            });
            
            navigator.geolocation.getCurrentPosition(function (pos) {
                isitopen.coords.copy(pos.coords);
                $(window).trigger('location');
            }, jQuery.noop, { timeout: 1000, maximumAge: Infinity });
            
            $.getJSON(
                "/data/vaesteraas/",
                function (data) {
                    venues = data.data;
                    refreshDuration();
                }
            );
            
            $(window).bind('location', refreshDistance);
            
            $('#venues').on('click', 'section', function () {
                display(venues[$(this).index()]);
            });
            
        });
    </script>
    
</body>
</html>