
<aside>
    
</aside>

<div role="main" id="map">
    
</div>

<script type="text/javascript">
    
    window.markers = [];
    
    $(function () {
        
        console.log("IsItOpen loaded");
        
        var cat = {
            'fastfood': 'Fast food',
            'supermarket': 'Supermarket',
            'convenience': 'Convenience store',
            'pharmacy': 'Pharmacy',
            'cafe': 'Cafe',
            'clothing': 'Clothing'
        };
        
        for(var c in cat) {
            var $div = $('<div />').appendTo('aside').text(cat[c]).data('iio', c).on('click', function () {
                
                var $this = $(this);
                
                var img = [
                    new google.maps.MarkerImage("{"/img/presence_online.png"|cdn}", undefined, undefined, undefined, new google.maps.Size(16, 24)),
                    new google.maps.MarkerImage("{"/img/presence_away.png"|cdn}", undefined, undefined, undefined, new google.maps.Size(16, 24)),
                    new google.maps.MarkerImage("{"/img/presence_offline.png"|cdn}", undefined, undefined, undefined, new google.maps.Size(16, 24))
                ];
                
                $this.addClass('loading');
                
                for(var i=0;i<window.markers.length;i++) {
                    google.maps.event.clearInstanceListeners(window.markers[i]);
                    window.markers[i].setMap(null);
                }
                
                window.markers = [];
                
                $.getJSON(
                    '/data/vaesteraas/' + $this.data('iio') + '/',
                    function (data) {
                        
                        for(var i=0;i<data.data.length;i++) {
                            (function (i, p) {
                                
                                var marker = new google.maps.Marker({
                                    position: new google.maps.LatLng(p.lat / 1E6, p.lon / 1E6),
                                    title: p.title,
                                    map: window.map/*,
                                    icon: img[Math.floor(Math.random() * 3)]*/
                                });
                                
                                var h = [p.hours[0], p.hours[5]];
                                
                                for(var s=1;s<7;s+=5) {
                                    for(var j=s;j<(s==1?5:7);j++) {
                                        if(h[j<5?0:1] === null) {
                                            if(p.hours[j] !== null) {
                                                h[j<5?0:1] = false;
                                                break;
                                            }
                                        } else {
                                            if(p.hours[j] === null) {
                                                h[j<5?0:1] = false;
                                                break;
                                            }
                                            if(p.hours[j][0] != h[j<5?0:1][0] || p.hours[j][1] != h[j<5?0:1][1]) {
                                                h[j<5?0:1] = false;
                                                break;
                                            }
                                        }
                                    }
                                }
                                
                                google.maps.event.addListener(marker, 'click', function () {
                                    popup.setContent(
                                        '<div class="popup">' +
                                            
                                            '<h1>' + p.title + '</h1>' +
                                            
                                            '<table>' +
                                                '<!--tr><th colspan="2">Öppetider</th></tr-->' +
                                                
                                                ((
                                                    h[0] !== false
                                                )?(
                                                    '<tr><td>Vardagar </td><td style="text-align: right;">' + (p.hours[0]?(p.hours[0][0] + ' - ' + p.hours[0][1]):"Stängt") + '</td></tr>'
                                                ):(
                                                    '<tr><td>Måndag </td><td style="text-align: right;">' + (p.hours[0]?(p.hours[0][0] + ' - ' + p.hours[0][1]):"Stängt") + '</td></tr>' +
                                                    '<tr><td>Tisdag </td><td style="text-align: right;">' + (p.hours[1]?(p.hours[1][0] + ' - ' + p.hours[1][1]):"Stängt") + '</td></tr>' +
                                                    '<tr><td>Onsdag </td><td style="text-align: right;">' + (p.hours[2]?(p.hours[2][0] + ' - ' + p.hours[2][1]):"Stängt") + '</td></tr>' +
                                                    '<tr><td>Torsdag</td><td style="text-align: right;">' + (p.hours[3]?(p.hours[3][0] + ' - ' + p.hours[3][1]):"Stängt") + '</td></tr>' +
                                                    '<tr><td>Fredag </td><td style="text-align: right;">' + (p.hours[4]?(p.hours[4][0] + ' - ' + p.hours[4][1]):"Stängt") + '</td></tr>'
                                                )) +
                                                
                                                ((
                                                    h[1] !== false
                                                )?(
                                                    '<tr><td>Helger </td><td style="text-align: right;">' + (p.hours[5]?(p.hours[5][0] + ' - ' + p.hours[5][1]):"Stängt") + '</td></tr>'
                                                ):(
                                                    '<tr><td>Lördag </td><td style="text-align: right;">' + (p.hours[5]?(p.hours[5][0] + ' - ' + p.hours[5][1]):"Stängt") + '</td></tr>' +
                                                    '<tr><td>Söndag </td><td style="text-align: right;">' + (p.hours[6]?(p.hours[6][0] + ' - ' + p.hours[6][1]):"Stängt") + '</td></tr>'
                                                )) +
                                                
                                            '</table>' +
                                            
                                        '</div>'
                                    );
                                    popup.open(map, marker);
                                });
                                
                                window.markers.push(marker);
                                
                            })(i, data.data[i]);
                        }
                        
                        $this.removeClass('loading').addClass('active');
                        
                    }
                );
                
            });
        }
        
    });
    
    window.cb0 = function () {
        
        console.log("Google Maps loaded");
        
        window.map = new google.maps.Map($('#map')[0], {
            center: new google.maps.LatLng(59.6039, 16.5474),
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        });
        
        window.popup = new google.maps.InfoWindow({
            content: ''
        });
        
    };
    
    $('<script />').attr({
        type: "text/javascript",
        src: "//maps.googleapis.com/maps/api/js?sensor=false&callback=cb0"
    }).appendTo('body');
    
</script>
