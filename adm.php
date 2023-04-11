<?php
session_start();
	// Confere se o usuário está logado
	if(!$_SESSION['valid']){
		header('Location: ./server/login.php');
	}

	// logout
	if(isset($_POST['logout'])){
		session_destroy();
		header('Location: ./server/login.php');
	}

?>

    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        <link rel="stylesheet" type="text/css" href="./styles/adm.css">

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
				<div class="row cartas pesquisa">
					<h2 class="titulo">Pesquisar cartas</h2>
               <div class="col-12">
						<input class="form-control mb-3" type="text" name="campo-pesquisa" id="campo-pesquisa" placeholder="Digite aqui...">
					</div> 
					<div class="col">
                    <div class="area-titulo-tabela">
                        <h3>Cartas Brancas <span class="qtd-brancas badge bg-secondary"><span class="qtd">0</span></span>
                        </h3>
                    </div>
                    <div class="area-tabela cartas-brancas">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col" class="col-texto">Texto</th>
                                    <th scope="col" class="col-categoria">Categoria</th>
                                    <th scope="col" class="col-btn"></th>
                                </tr>
                            </thead>
                            <tbody class="corpo-tabela-brancas"></tbody>
                        </table>
                    </div>
                </div>
                <div class="col">
                    <div class="area-titulo-tabela">
                        <h3>Cartas Pretas <span class="qtd-pretas badge bg-secondary"><span class="qtd">0</span></span>
                        </h3>
                    </div>
                    <div class="area-tabela cartas-pretas">
                        <table class="table table-dark table-hover">
                            <thead>
                                <tr>
                                    <th scope="col" class="col-texto">Texto</th>
                                    <th scope="col" class="col-categoria">Categoria</th>
                                    <th scope="col" class="col-btn"></th>
                                </tr>
                            </thead>
                            <tbody class="corpo-tabela-pretas"></tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="row cartas triagem">
					<h2 class="titulo">Aprovar cartas</h2>
                <div class="col">
                    <div class="area-titulo-tabela">
                        <h3>Cartas Brancas <span class="qtd-brancas badge bg-secondary"><span class="qtd">0</span></span>
                        </h3>
                    </div>
                    <div class="area-tabela cartas-brancas">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col" class="col-texto">Texto</th>
                                    <th scope="col" class="col-categoria">Categoria</th>
                                    <th scope="col" class="col-btn"></th>
                                </tr>
                            </thead>
                            <tbody class="corpo-tabela-brancas"></tbody>
                        </table>
                    </div>
                </div>
                <div class="col">
                    <div class="area-titulo-tabela">
                        <h3>Cartas Pretas <span class="qtd-pretas badge bg-secondary"><span class="qtd">0</span></span>
                        </h3>
                    </div>
                    <div class="area-tabela cartas-pretas">
                        <table class="table table-dark table-hover">
                            <thead>
                                <tr>
                                    <th scope="col" class="col-texto">Texto</th>
                                    <th scope="col" class="col-categoria">Categoria</th>
                                    <th scope="col" class="col-btn"></th>
                                </tr>
                            </thead>
                            <tbody class="corpo-tabela-pretas"></tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="row mensagens">
					<h2 class="titulo">Mensagens <span class="qtd-mensagens badge bg-secondary"><span class="qtd">0</span></span></h2>
               <div class="col lista-mensagens">
                  <div class="area-tabela">
							<table class="table table-hover">
								<thead>
									<tr>
										<th scope="col" class="col-texto">Data</th>
										<th scope="col" class="col-categoria">Texto</th>
										<th scope="col" class="col-btn"></th>
									</tr>
								</thead>
								<tbody id="corpo-tabela-mensagens"></tbody>
							</table>
                  </div>
               </div>
               <div class="col texto-mensagem">
						<div class="mensagem-btns">
							<button type="button" id="btn-apagar" class="btn btn-secondary btn-sm">Apagar</button>
							<button type="button" id="btn-marcarnaolida" class="btn btn-secondary btn-sm">Marcar como não lida</button>
						</div>
						<div class="area-mensagem">
							<textarea name="corpo-mensagem" id="corpo-mensagem" cols="30 " rows="10 "></textarea>
						</div>
					</div>
				</div>

				<div class="row cartas todas">
					<h2 class="titulo">Alterar cartas</h2>
					<div class="col-12 text-center mt-2 mb-3">
						<div id="botoes-categorias" class="btn-group" role="group" aria-label="Basic checkbox toggle button group"></div>
					</div>
               <div class="col">
						<div class="area-titulo-tabela">
							<h3>Cartas Brancas <span class="qtd-brancas badge bg-secondary"><span class="qtd">0</span></span>
							</h3>
						</div>
						<div class="area-tabela cartas-brancas">
							<table class="table table-hover">
								<thead>
									<tr>
										<th scope="col" class="col-texto">Texto</th>
										<th scope="col" class="col-categoria">Categoria</th>
										<th scope="col" class="col-btn"></th>
									</tr>
								</thead>
								<tbody class="corpo-tabela-brancas"></tbody>
							</table>
						</div>
               </div>
               <div class="col">
						<div class="area-titulo-tabela">
							<h3>Cartas Pretas <span class="qtd-pretas badge bg-secondary"><span class="qtd">0</span></span>
							</h3>
						</div>
						<div class="area-tabela cartas-pretas">
							<table class="table table-dark table-hover">
								<thead>
									<tr>
										<th scope="col" class="col-texto">Texto</th>
										<th scope="col" class="col-categoria">Categoria</th>
										<th scope="col" class="col-btn"></th>
									</tr>
								</thead>
								<tbody class="corpo-tabela-pretas"></tbody>
							</table>
						</div>
               </div>
            </div>

				<div class="row outros">
					<h2 class="titulo">Outros</h2>
               <div class="col-6 lista-categorias">
						<div class="area-titulo d-inline-flex align-items-center">
							<h3 class="">Categorias</h3>
							<button type="button" id="adicionar-categoria" class="btn btn-secondary btn-sm ms-3">+</button>
						</div>
                  <div class="area-tabela">
							<table class="table table-hover">
								<thead>
									<tr>
										<th scope="col" class="col-cat">Categoria</th>
										<th scope="col" class="col-icone">Icone</th>
										<th scope="col" class="col-qtd-cat">Qtd</th>
										<th scope="col" class="col-btn"></th>
									</tr>
								</thead>
								<tbody id="corpo-tabela-categorias"></tbody>
							</table>
                  </div>
               </div>
					<div class="col-6 lista-icones">
						<div class="area-titulo d-inline-flex align-items-center">
							<h3>Ícones</h3>
							<button type="button" id="adicionar-icones" class="btn btn-secondary btn-sm ms-3">+</button>
						</div>
						<div class="area-icones row">
							
						</div>
               </div>
				</div>

				*Se tiver dando muito erro de BD por estar acessando uma por uma, refatorar o código para acumular as ações e fazer tudo de uma só vez!
			</div>


	<!-- MODAL TROCA TEXTO CARTAS -->
	<div id="modal-troca-texto" class="modal" tabindex="-1">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Trocar o texto da carta</h5>
					<button type="button" class="btn-close " data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<form>
						<div class="mb-3">
							<label id="label-texto-novo" for="texto-novo" class="col-form-label"></label>
							<input type="text" class="form-control" id="texto-novo">
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
					<button type="button" class="btn btn-primary btn-trocar">Trocar</button>
				</div>
			</div>
		</div>
	</div>

	<!-- MODAL TROCA CATEGORIA CARTAS -->
	<div id="modal-troca-categoria" class="modal" tabindex="-1">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Trocar a categoria da carta</h5>
					<button type="button" class="btn-close " data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<form>
						<div class="mb-3">
							<label id="label-categoria-nova" for="select-categorias" class="form-label"></label>
							<select id="select-categorias" class="form-select" aria-label="Select de categorias"></select>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
					<button type="button" class="btn btn-primary btn-trocar">Trocar</button>
				</div>
			</div>
		</div>
	</div>

	<!-- MODAL ICONES -->
	<div id="modal-icones" class="modal" tabindex="-1">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Adicionar ícones</h5>
					<button type="button" class="btn-close " data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-9 mb-3">
							<label for="input-icone-branco" class="form-label">Ícone preto</label>
							<input class="form-control input-icone" preview="#icone-branco-preview" type="file" id="input-icone-branco">
						</div>
						<div class="col-3">
							<div class="area-icone-preview preto">
								<img id="icone-branco-preview" class="icone-preview" accept=".png">
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-9 mb-3">
							<label for="input-icone-preto" class="form-label">Ícone branco</label>
							<input class="form-control input-icone" preview="#icone-preto-preview" type="file" id="input-icone-preto">
						</div>
						<div class="col-3">
							<div class="area-icone-preview branco">
								<img id="icone-preto-preview" class="icone-preview" accept="*-branco.png" accept=".png">
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
					<button type="button" class="btn btn-primary btn-adicionar">Adicionar Ícones</button>
				</div>
			</div>
		</div>
	</div>

	<!-- MODAL PARA ESCOLHER O ICONE DA CATEGORIA -->
	<div id="modal-escolhe-icone" class="modal" tabindex="-1">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Escolher ícone</h5>
					<button type="button" class="btn-close " data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div class="area-icones row">
							
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
					<button type="button" class="btn btn-primary btn-adicionar">Escolher ícone</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Toast de mensagens -->
	<div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
		<div class="toast align-items-center text-white border-0" role="alert" aria-live="assertive" aria-atomic="true">
				<div class="d-flex">
					<div class="toast-body"></div>
					<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
				</div>
		</div>
	</div>


	<script src="./js/plugins/jquery-3.6.0.min.js"></script>
	<script src="./js/plugins/bootstrap.min.js"></script>
	<script src="./js/plugins/dayjs/dayjs.min.js"></script>
	<script src="./js/plugins/dayjs/relativeTime.js"></script>
	<script src="./js/plugins/dayjs/pt-br.min.js"></script>
   <script src="./js/adm.js"></script>
</body>