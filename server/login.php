<?php
require "data.php";
session_start();

if(isset($_POST['login'])){

	if ($_POST['usuario'] == $usuario && $_POST['senha'] == $senha){
		//$_SESSION['valid'] = true;
      //$_SESSION['timeout'] = time();
		$_SESSION['valid'] = true;
		header('Location: /adm.php');
		
	}else{
		$msg = "Usuário ou senha inválidos!";
	}

}

?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="/styles/login.css">

    <title>Cartas Radioativas - Login</title>
</head>

<body>
	<div class="wrapper">
		<div class="conteudo-login">
			<h1>Login</h1>
			<div class="msg"><? echo $msg ?></div>
			<form method="post" action="">
				
				<div id="div_login">	
					<div>
						<input type="text" class="form-control textbox text-light bg-dark" id="usuario" name="usuario" placeholder="Usuário" />
					</div>
					<div>
						<input type="password" class="form-control textbox text-light bg-dark" id="senha" name="senha" placeholder="Senha"/>
					</div>
					<div>
						<input type="submit" class="btn btn-dark" value="Enviar" name="login" id="login" />
					</div>
				</div>
			</form>
		</div>
	</div>
</body>