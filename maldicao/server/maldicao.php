<?php

	header("Content-Type:application/json");

	try {

		require '../../server/data.php';

		$pdo = new PDO('mysql:host=' . $database_host . '; dbname=' . $database_name . ';charset=utf8', $database_user, $database_password);
		$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
		$pdo->setAttribute(PDO::ATTR_PERSISTENT, true);

		if ($_SERVER['REQUEST_METHOD'] === 'GET') {

			if ($_GET["tabela"] === "todas") {
				$sql = 'SELECT categoria, id, texto FROM maldicao';
			} elseif ($_GET["tabela"] === "triagem") {
				$sql = 'SELECT id, texto FROM maldicao_personalizadas';
			} else {
				throw new Exception("Qual a tabela?", 1);
			}

			$stmt = $pdo->prepare($sql);
			$stmt->execute();
			$data = $stmt->fetchAll(PDO::FETCH_GROUP | PDO::FETCH_ASSOC);
			echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
		}

		if ($_SERVER['REQUEST_METHOD'] === 'POST') {

			if ($_POST["tipo"] == 'POST' && isset($_POST["cartas"])) {

				$cartas = $_POST["cartas"];
				$stmt = $pdo->prepare('INSERT INTO maldicao_personalizadas (texto) VALUES (?)');
				$repetidas = 0;
				$inseridas = 0;
				$total = 0;

				foreach ($cartas as $carta) {
					$total = $total + 1;
					try {
						$stmt->execute([$carta]);
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

				echo json_encode("Total = " . $total . " | Inseridas = " . $inseridas . " | Repetidas = " . $repetidas, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

			} else {
				echo json_encode("Nenhum dado recebido pelo sistema", JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
			}
		}

	} catch (PDOException $e) {
		echo 'Database error. ' . $e->getMessage();
	}
?>
