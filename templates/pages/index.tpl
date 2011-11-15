
<form action="" method="post">
    
    <h1>Is It <a href="#">Open</a>?</h1>
    
    <input type="text" />
    
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
            isitopen.Search.near(Math.round(pos.coords.latitude * 1E6), Math.round(pos.coords.longitude * 1E6), function (venues) {
                
                var $venues = $('#venues').html('');
                
                for(var i in venues) {
                    
                    var $div = $('<section />');
                    
                    $div.append('<h2>' + venues[i].title + '</h2>');
                    $div.append('<p>' + isitopen.distance(venues[i].distance) + '</p>');
                    $div.append('<p>' + venues[i].open + ' - ' + venues[i].close + '</p>');
                    
                    $div.click(function () {
                        
                    });
                    
                    $venues.append($div);
                    
                }
                
            });
        });
        
    });
</script>
