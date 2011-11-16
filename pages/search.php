<?php

$smarty->contentType('text', 'json');

$select = array(
    "`venue`.*",
    "`hours`.`open`",
    "`hours`.`close`"
);

$from = array(
    "`venue`",
    "`hours`"
);

$where = array(
    "`venue`.`id` = `hours`.`venue_id`",
    "`hours`.`weekday` LIKE '%" . strtolower(date('D')) . "%'"
);

$order = array();

if(isset($_POST['state'])) {
    $where[] = ($_POST['state'] == "closed"?"NOT":"") . sprintf("
        IF(
            `hours`.`open` < `hours`.`close`,
            '%s' BETWEEN `hours`.`open` AND `hours`.`close`,
            '%s' NOT BETWEEN `hours`.`close` AND `hours`.`open`
        )
    ", date('H:m:s'), date('H:m:s'));
}

if(isset($_POST['lat'], $_POST['lon'])) {
    $select[] = sprintf("
        ROUND(SQRT(
            POW('%u' - `venue`.`lat`, 2) +
            POW('%u' - `venue`.`lon`, 2)
        )) AS `distance`
    ", $_POST['lat'], $_POST['lon']);
    $order[] = "
        `distance` ASC
    ";
}

$order[] = "`venue`.`id` ASC";

echo json_encode(Buzzstmt::construct(
    "
    SELECT " . implode(",", $select) . "
    FROM " . implode(",", $from) . "
    WHERE " . implode(" AND ", $where) . "
    ORDER BY " . implode(",", $order) . "
    LIMIT 10
    "
)->many());
