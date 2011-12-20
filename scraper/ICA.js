
var jQuery = require('jquery');
var request = require('request');
var isitopen = require('./isitopen');

var $ = jQuery;

request({ encoding: 'binary', uri: "http://www.karthotellet.com/icakarta/functions/objects.php?xmin=0&ymin=0&xmax=3000000&ymax=8000000&sid=0.7314213775098324&layer=1&services=&profile=" }, function (error, response, body) {
    
    /*
     
     Note that we are requesting with { encoding: 'binary' }, that is very bad. Also,
     the following line messes things up:
     
     body = (new require('iconv').Iconv('ISO-8859-1', 'UTF-8')).convert(body).toString('UTF-8');
     
    */
    
    var lines = body.split(/[\n\r]+/);
    var requests = lines.length;
    
    $.each(lines, function (i, row) {
        
        var data = row.split(";");
        
        if(data.length < 8) {
            if(--requests == 0) {
                isitopen.end();
            }
            return ;
        }
        
        if(data[8] == '01030' || data[8] == '01752' || data[8] == '02262' || data[8] == '11436' || data[8] == '13674' || data[8] == '13717') {
            if(--requests == 0) {
                isitopen.end();
            }
            return ;
        }
        
        request({ uri: "http://www.ica.se/handlers/storedispatcher.ashx?storeId=" + data[8] }, function (error, response, body) {
            console.log(data[8]);
            var hours = [null, null, null, null, null, null, null];
            
            jQuery(body).find('.opening-hours').eq(0).find('li').each(function (i, li) {
                $(li).text().replace(/\s+/, ' ').replace(
                    /([a-zåäö]+)( ?-? ?([a-zåäö]+))? ?:? ?([0-9]{1,2}(:[0-9]{1,2})?) ?-? ?([0-9]{1,2}(:[0-9]{1,2})?)/ig,
                    function (s, a0, a1, a2, a3, a4, a5, a6) {
                        var days = isitopen.parse.days(a0 + (a1?a1:''));
                        for(var d in days) {
                            hours[days[d]] = isitopen.parse.duration(a3 + " - " + a5);
                        }
                        return s;
                    }
                );
            });
            
            if(
                hours[0] == null &&
                hours[1] == null &&
                hours[2] == null &&
                hours[3] == null &&
                hours[4] == null &&
                hours[5] == null &&
                hours[6] == null
            ) {
                if(--requests == 0) {
                    isitopen.end();
                }
            } else {
                
                var title = isitopen.trim(data[2]);
                
                if(!title.match(/^ica/i)) {
                    title = "ICA " + title;
                }
                
                isitopen.venue({
                    "title": title,
                    "type": "convenience",
                    "lat": Math.round(data[1] * 1E1),
                    "lon": Math.round(data[0] * 1E1),
                    "hours": hours
                }, function () {
                    if(--requests == 0) {
                        isitopen.end();
                    }
                });
                
            }
            
        });
        
    });
    
});
