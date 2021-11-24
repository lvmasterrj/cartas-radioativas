<?php

	header("Content-Type:application/json");

	try {

		require 'data.php';

		$pdo = new PDO('mysql:host=' . $database_host . '; dbname=' . $database_name . ';charset=utf8', $database_user, $database_password);
		$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);  
		$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES,false);
		$pdo->setAttribute(PDO::ATTR_PERSISTENT,true);

		if ($_SERVER['REQUEST_METHOD'] === 'GET') {
			$sql = 'SELECT * FROM mensagens ORDER BY id DESC';           
		
			$stmt = $pdo->prepare($sql);
			$stmt->execute();

			$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

			echo json_encode($data, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
		}

		if ($_SERVER['REQUEST_METHOD'] === 'POST') {
			if($_POST["tipo"] == 'POST' && isset($_POST["mensagem"])){
	
				$stmt = $pdo->prepare('INSERT INTO mensagens (mensagem) VALUES (?)');

				$stmt->execute([$_POST["mensagem"]]);
	
				echo json_encode("Mensagem enviada com sucesso", JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
			} elseif ($_POST["tipo"] == 'DELETE' && isset($_POST["idMsg"])){

				$idMsg = $_POST["idMsg"];
		
				$stmt = $pdo->prepare('DELETE FROM mensagens WHERE id=?');
				
				$data = $stmt->execute([$idMsg]);
	
				echo json_encode($data, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
			} elseif ($_POST["tipo"] == 'LIDA' && isset($_POST["idMsg"])){
				$idMsg = $_POST["idMsg"];
				$lida = $_POST["lida"];
				
				$stmt = $pdo->prepare('UPDATE mensagens SET lida=? WHERE id=?');
				
				$data = $stmt->execute([$lida, $idMsg]);
	
				echo json_encode($data, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
			}
		}

	} catch (PDOException $e) {
		echo 'Database error. ' . $e;
	}
?>