<?php

class hours extends Buzzsql {
    
    function __toString() {
        return substr($this->open, 0, 5) . " - " . substr($this->close, 0, 5);
    }
    
    function forDay($day) {
        return (strpos($this->weekday, $day) !== false);
    }
    
}
