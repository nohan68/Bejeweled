<?php
/* * * * * * * * * * * * * * * * * * * * * * CONFIGURATION BASE DE DONEES * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

$HOTE        = "localhost";
$UTILISATEUR = "njaugey";
$MOTDEPASSE  = "0906";
$BDD         = "BDD_njaugey";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
$pdo = new PDO('mysql:host='.$HOTE.';dbname='.$BDD, $UTILISATEUR, $MOTDEPASSE);
