<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <title>Is It Open</title>
    <link rel="shortcut icon" href="{"favicon.png"|cdn}" />
    <link rel="stylesheet" type="text/css" href="{"mobile.min.css"|cdn}" />
    <link rel="apple-touch-startup-image" href="{"img/splash.png"|cdn}" />
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
    
    <script type="text/html" id="tpl-row">
        <section class="{class}">
            <h2>{title}</h2>
            <p>{distance}</p>
            <p>{duration}</p>
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
            
            if(/iphone|ipod|ipad/gi.test(navigator.platform) && !window.navigator.standalone) {
                
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
            
            var duration = isitopen.duration.left;
            
            var refreshDistance = function () {
                
                $.each(venues, function () {
                    this.__distance__ = isitopen.distance_to(this.lat, this.lon);
                    this.element.find('p').eq(0).text(isitopen.meter2text(this.__distance__));
                });
                
                venues.sort(function (a, b) {
                    return ( a.__distance__ > b.__distance__ ? 1 : -1 );
                });
                
                var parent = $('#venues')[0];
                
                for(var i=0; i<venues.length; i++) {
                    parent.appendChild(venues[i].element[0]);
                }
                
            };
            
            var refreshDuration = function () {
                
                var now = new Date();
                var next = 60000 - (now % 60000);
                
                $.each(venues, function () {
                    this.__duration__ = duration(this.hours);
                    this.element.find('p').eq(1).text(isitopen.duration.format(this.__duration__));
                    if(this.__duration__ > 0 && this.__duration__ <= 60000) {
                        next = 1000 - (now % 1000);
                    }
                });
                
                setTimeout(refreshDuration, next);
            };
            
            navigator.geolocation.watchPosition(function (pos) {
                isitopen.coords.copy(pos.coords);
                $(window).trigger('location');
            });
            
            navigator.geolocation.getCurrentPosition(function (pos) {
                isitopen.coords.copy(pos.coords);
                $(window).trigger('location');
            }, jQuery.noop, { timeout: 1000, maximumAge: Infinity });
            
            isitopen.data.fetch('vaesteraas', function (data) {
                
                venues = data.data;
                
                $.each(venues, function () {
                    
                    this.__duration__ = isitopen.duration.left(this.hours);
                    
                    var data = {
                        'title': this.title,
                        'distance': isitopen.meter2text(NaN),
                        'duration': isitopen.duration.format(this.__duration__),
                        'class': (this.__duration__ > 0) ? 'open' : 'closed'
                    };
                    
                    this.element = $($.nano($('#tpl-row').text(), data)).appendTo('#venues');
                    
                });
                
                refreshDuration();
            });
            
            $(window).bind('location', refreshDistance);
            
            $('#venues').on('click', 'section', function () {
                isitopen.mobile.displayVenue(venues[$(this).index()]);
            });
            
        });
    </script>
    
</body>
</html>