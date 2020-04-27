<?php
header('Content-type: application/json');

include('connexion.php');

if($_SERVER['REQUEST_METHOD'] == 'POST'){ //POST
    $pdo->exec("INSERT INTO RECORDS VALUES (NULL, '".$_POST['pseudo']."','".$_POST['score']."');");
    echo "ok";
}else{  //GET
    $enregistements = $pdo->query("SELECT * FROM RECORDS ORDER BY SCORE DESC LIMIT 3");
    //$enregistements = $pdo->query("SELECT * FROM RECORDS ORDER BY SCORE DESC");
    echo json_encode($enregistements->fetchAll());
}
?>
