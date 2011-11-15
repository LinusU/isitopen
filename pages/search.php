<?php

$smarty->contentType('text', 'json');

switch($parts[1]) {
    case 'near':
        
        echo json_encode(Buzzstmt::construct(
            "
            SELECT
                `venue`.*,
                `hours`.`open`,
                `hours`.`close`,
                ROUND(SQRT(
                    POW('?' - `venue`.`lat`, 2) +
                    POW('?' - `venue`.`lon`, 2)
                )) AS `distance`
            FROM
                `venue`,
                `hours`
            WHERE
                `venue`.`id` = `hours`.`venue_id` AND
                `hours`.`weekday` LIKE '%?%' AND
                IF(
                    `hours`.`open` < `hours`.`close`,
                    '?' BETWEEN `hours`.`open` AND `hours`.`close`,
                    '?' NOT BETWEEN `hours`.`close` AND `hours`.`open`
                )
            ORDER BY
                `distance` ASC
            ",
            $_GET['lat'],
            $_GET['lon'],
            strtolower(date('D')),
            date('H:m:s'),
            date('H:m:s')
        )->many());
        
        break;
}

