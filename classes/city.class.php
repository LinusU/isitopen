<?php

class city extends Buzzsql {
    
    function __toString() {
        return $this->title;
    }
    
    static function nearest($lat, $lon) {
        return Buzzstmt::construct(
            get_called_class(),
            "
            SELECT *
            FROM `city`
            ORDER BY
                ROUND(SQRT(
                    POW('?' - `lat`, 2) +
                    POW('?' - `lon`, 2)
                )) ASC
            ",
            $lat,
            $lon
        )->one();
    }
    
}
