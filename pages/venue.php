<?php

$venue = venue::select()->where(array(
    'type' => $parts[0],
    'name' => $parts[1]
))->one();

if($venue === false) {
    return 404;
}

$smarty->assign('venue', $venue);
$smarty->assign('hours', $venue->hours());

$smarty->display('pages/venue.tpl');