<?php

/* Set the locale */
setlocale(LC_ALL, array('sv_SE.UTF-8', 'sv_SE'));

/* Requirements */
require_once (dirname(__FILE__) . '/../lib/Buzzmix/require.php');

/* Create the Buzzmix */
$site = new Buzzmix(dirname(__FILE__) . '/..');

/* Set header and footer */
$site->setHeader('header.tpl');
$site->setFooter('footer.tpl');

/* Setup the MySQL Database */
$site->mysqlSetup("localhost", "isitopen", "isitopen", "isitopen");

/* Minify the html */
function smarty_pre_minify($tpl_source, $smarty) { return preg_replace('/[ \t\n\r]+/s', ' ', $tpl_source); }
$site->registerFilter('pre', 'smarty_pre_minify');

/* Display it! */
$site->handleRequest($_SERVER['REQUEST_URI']);
