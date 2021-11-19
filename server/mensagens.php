<?php

	header("Content-Type:application/json");

	try {

		require 'data.php';

		$pdo = new PDO('mysql:host=' . $database_host . '; dbname=' . $database_name . ';charset=utf8', $database_user, $database_password);
		$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);  
		$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES,false);
		$pdo->setAttribute(PDO::ATTR_PERSISTENT,true);

		if ($_SERVER['REQUEST_METHOD'] === 'GET') {
			// We are a GET method
		}

		if ($_SERVER['REQUEST_METHOD'] === 'POST') {
			// Boom baby we a POST method
		}
	
		$sql = 'SELECT categoria, id, texto, tipo FROM mpcah';           
		
		$stmt = $pdo->prepare($sql);
		$stmt->execute();

		$data = $stmt->fetchAll(PDO::FETCH_GROUP | PDO::FETCH_ASSOC);

		echo json_encode($data, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);

	} catch (PDOException $e) {
		echo 'Database error. ' . $e->getMessage();
	}
?>