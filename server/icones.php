<?php

	header("Content-Type:application/json");

	try {

		require 'data.php';

		$pdo = new PDO('mysql:host=' . $database_host . '; dbname=' . $database_name . ';charset=utf8', $database_user, $database_password);
		$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);  
		$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES,false);
		$pdo->setAttribute(PDO::ATTR_PERSISTENT,true);
		
		$directory = dirname(__DIR__);

		if ($_SERVER['REQUEST_METHOD'] === 'GET') {

			$sql = 'SELECT * FROM icones';
		
			$stmt = $pdo->prepare($sql);
			$stmt->execute();

			$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

			echo json_encode($data, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
		}

		if ($_SERVER['REQUEST_METHOD'] === 'POST') {

			
			if($_POST["tipo"] == 'POST' ){
			
				if (count($_FILES) == 2){

					foreach($_FILES as $key => $value) {
						$nomeArquivo = $_FILES[$key]["name"];
						
						//$nome = substr($nomeArquivo, 0, strlen($nomeArquivo)-4);

						if (substr($nomeArquivo, -11)=== "-branco.png"){
							$nome = substr($nomeArquivo, 0, strlen($nomeArquivo)-11);
						} elseif (substr($nomeArquivo, -10)=== "-preto.png") {
							$nome = substr($nomeArquivo, 0, strlen($nomeArquivo)-10);
						} else {
							throw new Exception("Nome errado dos ícones", 1);
						}
						
						if (!move_uploaded_file($_FILES[$key]["tmp_name"], $directory . "/imgs/icones/" . $nomeArquivo)){
							throw new Exception("Error ao salvar as imagens", 1);
						};

					}

					$stmt = $pdo->prepare('INSERT INTO icones (nome) VALUES (?)');
					$stmt->execute([$nome]);

					echo json_encode("ok", JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
				} else {
					echo json_encode("Erro", JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
				}
			// } else if ($_POST["tipo"] == 'PUT' && $_POST["acao"] == "trocaIcone"){
			// 	$catID = $_POST["catID"];
			// 	$icone = $_POST["icone"];

			// 	$stmt = $pdo->prepare('UPDATE categorias SET icone=? WHERE id=?');
				
			// 	$data = $stmt->execute([$icone, $catID]);
	
			// 	echo json_encode($data, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
			}

		}

	} catch (PDOException $e) {
		echo 'Database error. ' . $e->getMessage();
	}
?>