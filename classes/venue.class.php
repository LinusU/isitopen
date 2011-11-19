<?php

class venue extends Buzzsql {
    
    function __toString() {
        return $this->title;
    }
    
    function hours() {
        
        $raw = hours::select()->where($this)->many();
        $hours = array(null, null, null, null, null, null, null);
        
        foreach($raw as $h) {
            if($h->forDay('mon')) { $hours[0] = $h; }
            if($h->forDay('tue')) { $hours[1] = $h; }
            if($h->forDay('wed')) { $hours[2] = $h; }
            if($h->forDay('thu')) { $hours[3] = $h; }
            if($h->forDay('fri')) { $hours[4] = $h; }
            if($h->forDay('sat')) { $hours[5] = $h; }
            if($h->forDay('sun')) { $hours[6] = $h; }
        }
        
        return $hours;
    }
    
}
