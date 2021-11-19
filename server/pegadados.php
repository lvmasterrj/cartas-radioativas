<?php

    header("Content-Type:application/json");

    try {

		require 'data.php';

        //$categoria = $_GET["categoria"];

      //   $database_name     = 'epiz_30257710_cah';
      //   $database_user     = 'epiz_30257710';
      //   $database_password = '9nf542wr';
      //   $database_host     = 'sql205.epizy.com';
      //   $charset           = 'utf8';

        $pdo = new PDO('mysql:host=' . $database_host . '; dbname=' . $database_name . ';charset=utf8', $database_user, $database_password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);  
        $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES,false);
        $pdo->setAttribute(PDO::ATTR_PERSISTENT,true);

        //$sql = 'SELECT * FROM mpcah WHERE categoria=?'; 
        $sql = 'SELECT categoria, id, texto, tipo FROM mpcah';           
        
        $stmt = $pdo->prepare($sql);
        // $stmt->execute([$categoria]);
        $stmt->execute();
        
        // $data = [];

        // while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {          
        //         $data[] = $row;  
        // } 

        $data = $stmt->fetchAll(PDO::FETCH_GROUP | PDO::FETCH_ASSOC);


        //utf8_decode($data)

        //echo $data;

        // $response         = [];
        // $response['data'] =  $data;

        //$response = $data;

        //echo json_encode($data, JSON_PRETTY_PRINT);
        echo json_encode($data, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);

    } catch (PDOException $e) {
        echo 'Database error. ' . $e->getMessage();
    }
?>