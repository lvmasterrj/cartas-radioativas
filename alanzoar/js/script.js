var impressao = {
    cont: 1,
    tamanho: "padrao",
    categorias: [],
    perguntas: {}
};
//var dbPerguntas = {};

// const { jsPDF } = window.jspdf;

$(document).ready(() => {
    $("#modal-aguarde").modal('show');
    pegaCategoriasBD();
    pegaCartasBD();
});

// Função que pega as cartas na tabela
function pegaCartasBD() {
    $.get("server/perguntas.php", { acao: "perguntas", tabela: "todas" })
        .done(function(data) {
            impressao.perguntas = data;
            adicionaCategorias();
            $("#modal-aguarde").modal('hide');
        })
        .fail(function(e) {
            console.log("ERRO");
            console.log(e);
        });
}

function pegaCategoriasBD() {
    $.get("server/perguntas.php", { acao: "categorias" })
        .done(function(data) {
            for (const key in data) {
                impressao.categorias.push(key);
            }
        })
        .fail(function(e) {
            console.log("ERRO ao pegar as categorias");
            console.log(e);
        });
}


function adicionaCategorias() {
    for (key in impressao.perguntas) {
        $("#botoes-categorias").append(
            `<input type="checkbox" class="btn-check btn-categoria" id="btn-${normaliza(key)}" autocomplete="off" value="${key}">
				<label class="btn btn-outline-secondary" for="btn-${normaliza(key)}">${key} <span class="badge bg-dark qtd ms-1">${impressao.perguntas[key].length}</span></label>`
        )
    }
}

function normaliza(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Listen pra quando marca os botões de categoria
$("#botoes-categorias").on("change", ".btn-categoria", (e) => {
    if ($(e.currentTarget).is(":checked")) {
        console.log("Clicou")
        montaTabela(e.currentTarget.value);
    } else {
        removeLinhaTabela(e.currentTarget.value);
    }
});

// Função que remove a linha da tabela
function removeLinhaTabela(categoria) {
    $("tr[categoria|='" + categoria + "'").remove();
    atualizaQtd();
}

// Função que cria a tabela de cartas
function montaTabela(categoria) {
    //  console.log(impressao.perguntas);
    let perguntas = ""

    $.each(impressao.perguntas[categoria], function(key, val) {
        //   console.log(key + " - " + val);
        perguntas = perguntas + novaLinhaTabela(val, categoria);
        //cartasPretas = cartasPretas + novaLinhaTabela(val, categoria);
    });
    $("#corpo-tabela-brancas").append(perguntas);
    atualizaQtd();
}

// Função que formata uma nova linha da tabela
function novaLinhaTabela(dados, categoria, marcado) {
    return `<tr class="${marcado ? "marcado" : ""}" texto="${
		dados.texto
	}" ${dados.id ? "id=" + dados.id : ""} categoria="${
		categoria ? categoria : ""
	}">
                <td class="carta-texto">${dados.texto}</td>
                <td class="carta-categoria">${categoria ? categoria : ""}</td>
                <td class="btns">${
									marcado ? `<span class="btn-remover">remover</span>` : ""
								}</td>
            </tr>
            `;
}

// Listen para quando o usuário seleciona uma carta na tabela
$("tbody").on("click", "tr", function (e) {
	let dados = $(e.currentTarget);
	marca(dados);
});

// Função que atualiza o estilo da linha da tabela quando (des)selecionada
function marca(e) {
	e.toggleClass("marcado");
	atualizaQtd();
}

function atualizaQtd() {
	$(".qtd-brancas > .qtd-selec").text(
		$("#corpo-tabela-brancas > .marcado").length
	);
	$(".qtd-brancas > .qtd-total").text($("#corpo-tabela-brancas > tr").length);
}

// // Função que formata o texto inserido das cartas pretas e adiciona à tabela p/ impressão
// function adicionaPretaPersonalizada() {
// 	if (!$("#texto-personalizacao-pretas").val()){
// 		Swal.fire({ 
// 			icon: 'error',
// 			title: 'Qual seu problema!?',
// 			text: 'Você não inseriu nenhuma carta preta!'
// 		});
// 	} else {
// 		let campo = $("#texto-personalizacao-pretas");
// 		let textos = campo.val().split("\n");

// 		textosCorrigidos = textos.map((texto) => {
// 			texto = texto.replace(!/[()\w+]/g, "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// 			return texto
// 		});

// 		adicionaCartaNaTabela(textosCorrigidos, "p");
// 		campo.val("");
// 	}
// }

// // Listen para quando clica dentro do campo de edição das cartas pretas
// $("#texto-personalizacao-pretas").mouseup(()=> atualizaPreview());
// // Listen para quando se digita no campo de edição das cartas pretas
// $("#texto-personalizacao-pretas").keyup(()=> atualizaPreview())

// // Função que atualiza a carta de previw na edição das cartas pretas
// function atualizaPreview(){
// 	var linhas = $("#texto-personalizacao-pretas").val().split("\n");
// 	var linhaAtual = $("#texto-personalizacao-pretas").val().substr(0, $("#texto-personalizacao-pretas")[0].selectionStart).split("\n").length-1;
// 	let texto = linhas[linhaAtual];

// 	texto = texto.replace(/<</g, "\\n<<").replace(/>>/g, ">>\\n")
// 	$("#preview-carta-preta").show();
// 	texto = texto.split("\\n")
// 	const jsPDFDoc = new jsPDF({unit:"px", hotfixes: ["px_scaling"]});
// 	jsPDFDoc.setFontSize(16);
// 	texto = texto.flatMap((linha)=>{

// 		if (linha.indexOf("<<") !== -1 || linha.indexOf(">>") !== -1) {
// 			linha = linha.replace(/<</g, "").replace(/>>/g, "").trim();

// 			let tamanhoUnderline = jsPDFDoc.getCharWidthsArray("_") * 16; //Pega o tamanho do "_" em mm
// 			let tamanhoLinha = jsPDFDoc.getStringUnitWidth(linha) * 16; // Pega o tamanho da linha em mm
// 			let espaco = 150 - tamanhoLinha; //Pega o espaço restante na linha
// 			let qtdUnderlinesAdicionar = Math.ceil(espaco / tamanhoUnderline); //Calcula quantos "_" podem ser adicionados
// 			linha = linha.replace(/_/g, "_".repeat(qtdUnderlinesAdicionar)); //Insere o nro de "_" suficientes para preencher a linha toda.
// 			//let tamanhoFinal = jsPDFDoc.getStringUnitWidth(linha) * 16; // Pega o tamanho da linha em mm

// 		} else {
// 			linha = trocaUnderline(linha);
// 		}

// 		linha = linha.split("\\n");
// 		linha = linha.map((elem)=>elem.trim());// Remove os espaços em cada linha
//       linha = linha.filter((elem) => elem != "");// Remove os valores em branco
// 		linha = jsPDFDoc.splitTextToSize(linha, 205);
// 		return linha;
// 	})

// 	.join("<br>");

// 	$(".texto-preview").html(texto);
// }

// function trocaUnderline(texto = ""){
// 	return texto
// 		.trim()
// 		.replace(/(?<!_)_\./g, "\\n________________.\\n") //Substitui "_."
// 		.replace(/(?<!_)_\!/g, "\\n________________!\\n") //Substitui "_!"
// 		.replace(/(?<!_)_\?/g, "\\n________________?\\n") //Substitui "_?"
// 		.replace(/(?<!_)_\,/g, "\\n________________,\\n") //Substitui "_,"
// 		.replace(/(?<!_)_\;/g, "\\n________________;\\n") //Substitui "_;"
// 		.replace(/(?<!_)_\:/g, "\\n________________:\\n") //Substitui "_;"
// 		.replace(/(?<!_)_(?!_)/g, "\\n_________________\\n") //Substitui "_"
// }

// // Listen para ocultar a carta de preview quando sai do campo
// $("#texto-personalizacao-pretas").focusout(()=>{
// 	$("#preview-carta-preta").hide();
// })

// // Listens para quando clica no botão de adicionar item à edição
// $("#btn-adiciona-linha").click(()=>{
// 	adicionaItemNaCarta("_", 1)
// })
// $("#btn-adiciona-quebra-linha").click(()=>{
// 	adicionaItemNaCarta("\\n", 2)
// })
// $("#btn-adiciona-texto-encapsulado").click(()=>{
// 	adicionaItemNaCarta("<<_>>",2)
// })

// //Função que adiciona os itens na edição das cartas pretas
// function adicionaItemNaCarta(item, retorno = 0){
// 	$("#preview-carta-preta").show();
// 	let campoPersonalizaPreta = $("#texto-personalizacao-pretas")
// 	let inicioCursor = campoPersonalizaPreta[0].selectionStart;
// 	let finalCursor = campoPersonalizaPreta[0].selectionEnd;
// 	let ateCursor = campoPersonalizaPreta.val().substr(0, inicioCursor);
// 	let aposCursor = campoPersonalizaPreta.val().substr(finalCursor);
// 	if (inicioCursor == finalCursor){
// 		campoPersonalizaPreta.val(ateCursor + item + aposCursor);
// 	} else {
// 		selecao = campoPersonalizaPreta.val().substr(inicioCursor, finalCursor - inicioCursor);
// 		campoPersonalizaPreta.val(ateCursor + "<<" + selecao + ">>" + aposCursor);
// 	}
// 	campoPersonalizaPreta[0].focus();
// 	campoPersonalizaPreta[0].setSelectionRange(ateCursor.length + retorno, ateCursor.length + retorno);
// 	atualizaPreview()
// }

// // Função que formata o texto inserido das cartas brancas e adiciona à tabela p/ impressão
// function adicionaBrancaPersonalizada() {
// 	if (!$("#texto-personalizacao-brancas").val()){
// 		Swal.fire({ 
// 			icon: 'error',
// 			title: 'Cabeção!',
// 			text: 'Você não inseriu nenhuma carta branca!'
// 		});
// 	} else {
// 		let campo = $("#texto-personalizacao-brancas");
// 		let textos = campo.val().split("\n");

// 		textosCorrigidos = textos.map((texto) => {
// 			return texto.replace(!/[()\w+]/g, "");
// 		});

// 		adicionaCartaNaTabela(textosCorrigidos, "b");
// 		campo.val("");
// 	}	
// }

// // Função que adiciona as cartas personalizadas na tabela p/ impressão
// function adicionaCartaNaTabela(textos, tipo) {
// 	let items = "";
// 	for (key in textos) {
// 		info = { texto: textos[key], tipo: tipo };
// 		items = items + novaLinhaTabela(info, "Minha carta", 1);
// 	}
// 	if (tipo == "b") {
// 		$("#corpo-tabela-brancas").append(items);
// 	} else {
// 		$("#corpo-tabela-pretas").append(items);
// 	}
// 	atualizaQtd();
// }

// //Listen para quando o usuário remove a linha/carta da tabela
// $("tbody").on("click", ".btn-remover", function (e) {
// 	$(e.currentTarget).parents("tr").remove();
// });

// // Função de selecionar todas as cartas na tabela
// function selecionaTodas(tipo) {
// 	$.each(
// 		$("#corpo-tabela-" + tipo)
// 			.children("tr")
// 			.not(".marcado"),
// 		(i, v) => {
// 			marca($(v));
// 		}
// 	);
// }

// // Função de desselecionar todas as cartas na tabela
// function desselecionaTodas(tipo) {
// 	$.each($("#corpo-tabela-" + tipo).children("tr.marcado"), (i, v) => {
// 		marca($(v));
// 	});
// }

// // Listen para o botão de troca da cor de fundo
// $("#cor-fundo").change((e) => {
// 	impressao.cor = $(e.currentTarget).val();
// 	trocaCorPreta();
// });

// //Listen para os radios de cor das cartas
// $("#tipo-fundo .form-check-input").on("change", () => {
// 	impressao.verso = $("input[name=tipo-fundo]:checked").val();
// 	$(".carta-exemplo.preta").toggleClass("economico");
// 	trocaCorPreta();
// });

// //Listen para os radios de cor das cartas
// $("#tamanho-carta .form-check-input").on("change", () => {
// 	impressao.tamanho = $("input[name=tamanho-carta]:checked").val();
// 	// $(".carta-exemplo.preta").toggleClass("economico");
// 	// trocaCorPreta();
// });

// // Função que troca as cores da carta de exemplo
// function trocaCorPreta() {
// 	if (impressao.verso == "padrao") {
// 		$(".fundo-preta-exemplo").css("background-color", impressao.cor || "#000");
// 	} else {
// 		$(".fundo-preta-exemplo").css("background-color", "#fff");
// 		$(".rodape-economico").css("background-color", impressao.cor || "#000");
// 		$(".fundo-economico").css("background-color", impressao.cor || "#000");
// 	}
// }

// //Listen para o texto personalizado
// $("#texto-rodape").on("input", (e) => {
// 	impressao.textoPers = $(e.currentTarget).val() || "Cartas Radioativas";
// 	$(".texto-cartas").text(impressao.textoPers);
// });

// // Função que salva as cartas do usuário
// function salvaCartasBD() {
// 	let cartas = [];

// 	$.each($("tr[categoria='Minha carta']"), (i, v) => {
// 		cartas.push({ texto: $(v).attr("texto"), tipo: $(v).attr("tipo") });
// 	});

// 	$.post("server/cartas.php", { tipo: "POST", cartas: cartas })
// 		.done(function (data) {
// 			console.log(data);
// 		})
// 		.fail(function (e) {
// 			console.log(e);
// 		});
// }

// // Função para gerar o PDF
// function gerarPDF() {
// 	if ($("tr.marcado").length == 0) {
// 		Swal.fire({
// 			icon: "error",
// 			title: "Ops...",
// 			text: "Você se esqueceu de selecionar as cartas para impressão!",
// 		});
// 		return;
// 	}

// 	if ($("tr[categoria='Minha carta']").length > 0) {
// 		Swal.fire({
// 			title: "Podemos salvar suas cartas?",
// 			html: 'Tudo que é ruim deve ser compartilhado.<br>Podemos salvar as suas cartas para a galera desfrutar/sofrer também?!<br><span class="fs-6 text-black-50"><em>As cartas serão avaliadas e caso aprovadas aparecerão na categoria de cartas "personalizadas"</em></span>',
// 			icon: "question",
// 			showDenyButton: true,
// 			showCancelButton: true,
// 			confirmButtonText: `<i class="fa fa-thumbs-up"></i> Claro, pode salvar`,
// 			denyButtonText: `<i class="fa fa-thumbs-down"></i> Não, só gere meu PDF`,
// 			cancelButtonText: `Espera, ainda não estou pronto`,
// 		}).then((result) => {
// 			if (result.isConfirmed) {
// 				salvaCartasBD();
// 				montaPDF();
// 			} else if (result.isDenied) {
// 				montaPDF();
// 			} else if (result.isDismissed) {
// 				return;
// 			}
// 		});
// 	} else {
// 		montaPDF();
// 	}
// }

// // Listen para o envio de mensagem
// $("#mensagem").on("submit", function (e) {
// 	e.preventDefault();
// 	if (!$("#mensagem-conteudo").val()){
// 		Swal.fire({ 
// 			icon: 'error',
// 			title: 'E a mensagem?',
// 			text: 'Você esqueceu de digitar a mensagem meu amor!'
// 		});
// 	} else {
// 		var campoToast = $(".toast");
// 		var toast = new bootstrap.Toast(campoToast)

// 		let mensagem = $("#mensagem-conteudo").val();

// 		$.post("server/mensagens.php", { tipo: "POST", mensagem: mensagem })
// 			.done(function (data) {
// 				console.log(data);
// 				$("#mensagem-conteudo").val("")
// 				$(campoToast).addClass("bg-success")
// 				$(".toast-body").text("Mensagem enviada com sucesso!")
// 				toast.show();
// 			})
// 			.fail(function (e) {
// 				$(campoToast).addClass("bg-danger")
// 				$(".toast-body").text("Opa... não foi não! Tenta de novo")
// 				toast.show()
// 				console.log(e);
// 			});
// 		}
// });