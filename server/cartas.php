<?php

	header("Content-Type:application/json");

	try {

		require 'data.php';

		$pdo = new PDO('mysql:host=' . $database_host . '; dbname=' . $database_name . ';charset=utf8', $database_user, $database_password);
		$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);  
		$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES,false);
		$pdo->setAttribute(PDO::ATTR_PERSISTENT,true);

		if ($_SERVER['REQUEST_METHOD'] === 'GET') {
			$sql = 'SELECT categoria, id, texto, tipo FROM mpcah';           
		
			$stmt = $pdo->prepare($sql);
			$stmt->execute();

			$data = $stmt->fetchAll(PDO::FETCH_GROUP | PDO::FETCH_ASSOC);

			echo json_encode($data, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
		}

		if ($_SERVER['REQUEST_METHOD'] === 'POST') {
			if(isset($_POST["cartas"])){

				$cartas = $_POST["cartas"];
	
				$stmt = $pdo->prepare('INSERT INTO personalizadas (texto, tipo) VALUES (?,?)');
	
				$repetidas = 0;
				$inseridas = 0;
				
				foreach($cartas as $carta){
					$total = $total + 1;
					try {
						$stmt->execute([$carta["texto"], $carta["tipo"]]);
						$inseridas = $inseridas + 1;
					} catch (PDOException $e) {
						$errorCode = $stmt->errorInfo()[1];
						if ($errorCode == 1062) {
							$repetidas = $repetidas + 1;
						} else {
							throw $e;
						}
					}
				}
	
				echo json_encode("Total = " . $total . " | " . "Inseridas = " . $inseridas . " | Repetidas = " . $repetidas, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
	
			} else {
				echo 'Nenhum dado recebido pelo sistema';
			}
		}

	} catch (PDOException $e) {
		echo 'Database error. ' . $e->getMessage();
	}
?>