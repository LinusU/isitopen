<?php

$city = city::select()->where("`name` = '?'", $parts[1])->one();

if($city === false) {
    return 404;
}

$smarty->contentType('text', 'json');

$venues = venue::select()->where(isset($parts[2])?array($city, 'type' => $parts[2]):$city)->many();

echo '{"license": "Copyright, All Rights Reserved, Usage of this data without explicit permission is strictly forbidden!", "name": "' . $city->name . '", "title": "' . $city->title . '", "data": [';

foreach($venues as $key => $venue) {
    
    if($key > 0) {
        echo ",";
    }
    
    $data = $venue->get_row();
    $hours = hours::select()->where($venue)->many();
    
    unset($data['id']);
    unset($data['city_id']);
    
    $data['hours'] = array(null, null, null, null, null, null, null);
    
    foreach($hours as $hour) {
        foreach(explode(',', $hour->weekday) as $day) {
            switch($day) {
                case 'mon': $data['hours'][0] = array($hour->open, $hour->close); break;
                case 'tue': $data['hours'][1] = array($hour->open, $hour->close); break;
                case 'wed': $data['hours'][2] = array($hour->open, $hour->close); break;
                case 'thu': $data['hours'][3] = array($hour->open, $hour->close); break;
                case 'fri': $data['hours'][4] = array($hour->open, $hour->close); break;
                case 'sat': $data['hours'][5] = array($hour->open, $hour->close); break;
                case 'sun': $data['hours'][6] = array($hour->open, $hour->close); break;
            }
        }
    }
    
    echo json_encode($data);
}

echo ']}';
