<?php



	header("Content-Type:application/json");



	try {



		require 'data.php';



		$pdo = new PDO('mysql:host=' . $database_host . '; dbname=' . $database_name . ';charset=utf8', $database_user, $database_password);

		$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);  

		$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES,false);

		$pdo->setAttribute(PDO::ATTR_PERSISTENT,true);



		if ($_SERVER['REQUEST_METHOD'] === 'GET') {

			$trecho = '%' . $_GET["trecho"] . '%';
				
			$sql = 'SELECT categoria, id, texto, tipo FROM cartas WHERE texto LIKE ? ORDER BY categoria';
		
			$stmt = $pdo->prepare($sql);

			$stmt->execute([$trecho]);

			$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

			echo json_encode($data, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);

		}



		// if ($_SERVER['REQUEST_METHOD'] === 'POST') {



		// 	// $_POST["tipo"] == 'POST' => Está inserindo cartas

		// 	if($_POST["tipo"] == 'POST' && isset($_POST["cartas"])){



		// 		$cartas = $_POST["cartas"];



		// 		//$_POST["aprovadas"] == 1 => Está aprovando cartas

		// 		if ($_POST["aprovadas"] == 1){

		// 			$stmt = $pdo->prepare('INSERT INTO cartas (texto, tipo, categoria) VALUES (?,?,?)');

		// 			$carta = $cartas[0];

		// 			$stmt->execute([$carta["texto"], $carta["tipo"], $carta["categoria"]]);

		// 		// else => Está inserindo cartas personalizadas

		// 		} else {

		// 			$stmt = $pdo->prepare('INSERT INTO personalizadas (texto, tipo) VALUES (?,?)');

		// 			$repetidas = 0;

		// 			$inseridas = 0;

					

		// 			foreach($cartas as $carta){

		// 				$total = $total + 1;

		// 				try {

		// 					$stmt->execute([$carta["texto"], $carta["tipo"]]);

		// 					$inseridas = $inseridas + 1;

		// 				} catch (PDOException $e) {

		// 					$errorCode = $stmt->errorInfo()[1];

		// 					if ($errorCode == 1062) {

		// 						$repetidas = $repetidas + 1;

		// 					} else {

		// 						throw $e;

		// 					}

		// 				}

		// 			}

		// 		}		



		// 		echo json_encode("Total = " . $total . " | " . "Inseridas = " . $inseridas . " | Repetidas = " . $repetidas, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);

	

		// 	//$_POST["tipo"] == "DELETE" => Está deletando cartas

		// 	} elseif ($_POST["tipo"] == "DELETE" && isset($_POST["idCarta"])){

							

		// 			$idCarta = $_POST["idCarta"];

		// 			$tabela = $_POST["tabela"];



		// 			if($tabela == "todas"){

		// 				$stmt = $pdo->prepare('DELETE FROM cartas WHERE id=?');

		// 			} else {

		// 				$stmt = $pdo->prepare('DELETE FROM personalizadas WHERE id=?');

		// 			}

					

		// 			$data = $stmt->execute([$idCarta]);

		

		// 			echo json_encode($data, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);



		// 	} elseif ($_POST["tipo"] == "PUT" && isset($_POST["idCarta"])){

							

		// 		$idCarta = $_POST["idCarta"];

		// 		// $tabela = $_POST["tabela"];

		// 		$texto = $_POST["texto"];

		// 		$categoria = $_POST["categoria"];



		// 		$stmt = $pdo->prepare('UPDATE cartas SET texto=?, categoria=? WHERE id=?');

				

		// 		$data = $stmt->execute([$texto, $categoria, $idCarta]);

	

		// 		echo json_encode($data, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);



		// } else {

		// 		echo 'Nenhum dado recebido pelo sistema';

		// 	}

		// }



		// //echo json_encode("popoopo", JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);



		// // if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

		// // 	if(isset($_POST["idCarta"])){



		// // 		echo json_encode($_POST, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);

					

		// // 		// $idCarta = $_POST["idCarta"];

	

		// // 		// $stmt = $pdo->prepare('DELETE FROM personalizadas WHERE id=?');

				

		// // 		// $data = $stmt->execute([$idCarta]);

	

		// // 		// echo json_encode($data, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);

	

		// // 	} else {

		// // 		echo 'Nenhum dado recebido pelo sistema';

		// // 	}

		// // }



	} catch (PDOException $e) {

		echo 'Database error. ' . $e->getMessage();

	}

?>