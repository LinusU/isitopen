<?php

function smarty_modifier_cdn($url) {
    return "http://cdn." . $_SERVER['HTTP_HOST'] . "/" . $url;
}
