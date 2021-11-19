<?php
session_start();
	// Confere se o usuário está logado
	if(!$_SESSION['valid']){
		header('Location: /server/login.php');
	}

	// logout
	if(isset($_POST['logout'])){
		session_destroy();
		header('Location: /server/login.php');
	}
?>



<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="/styles/adm.css">

    <title>Cartas Radioativas - Adm</title>
</head>

<body>
	<div class="container">
		<div class="header mt-3">
			<h1 class="me-4">Cartas Radioativas - Administração</h1>
			<form class="" method="post" action="">
				<div id="div_login">
					<input type="submit" class="btn btn-secondary" value="Logout" name="logout" id="logout" />
				</div>
			</form>
		</div>
		<div class="row cartas">
			<div class="col">
				Lista de cartas brancas
			</div>
			<div class="col">
				Lista de cartas pretas
			</div>
		</div>
		<div class="row mensagens">
			<div class="col">
				Lista de mensagens
			</div>
			<div class="col">
				Conteudo da mensagem
			</div>
		</div>
	
	</div>

	
</body>
