<?php

$city = city::select()->where("`name` = '?'", $parts[1])->one();

if($city === false) {
    return 404;
}

$smarty->contentType('text', 'json');

$venues = venue::select()->where($city)->many();

echo '{"license": "Copyright, All Rights Reserved, Usage of this data without explicit permission is strictly forbidden!", "data": [';

foreach($venues as $key => $venue) {
    
    if($key > 0) {
        echo ",";
    }
    
    $data = $venue->get_row();
    $hours = hours::select()->where($venue)->many();
    
    unset($data['id']);
    unset($data['city_id']);
    
    $data['hours'] = array();
    
    foreach($hours as $hour) {
        $tmp = $hour->get_row();
        unset($tmp['id']);
        unset($tmp['venue_id']);
        $tmp['weekday'] = explode(',', $tmp['weekday']);
        $data['hours'][] = $tmp;
    }
    
    echo json_encode($data);
}

echo ']}';
