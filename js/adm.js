dayjs.extend(window.dayjs_plugin_relativeTime);
dayjs.locale('pt-br');

var dbCartas = {};

$(document).ready(() => {
    pegaCartasTriagemBD();
    pegaMsgsBD();
    pegaTodasCartasBD();
});

// Função que pega as cartas, para triagem, no BD
function pegaCartasTriagemBD() {
    $.get("server/cartas.php", { tabela: "triagem" })
        .done(function(data) {
            montaTabelaTriagem(data);
        })
        .fail(function(e) {
            console.log("ERRO ao pegar as cartas de triagem");
            console.log(e);
        });
}

// Função que pega as cartas, para adm, no BD
function pegaTodasCartasBD() {
    $.get("server/cartas.php", { tabela: "todas" })
        .done(function(data) {
            dbCartas = data;
            adicionaCategorias();
        })
        .fail(function(e) {
            console.log("ERRO ao pegar todas as cartas");
            console.log(e);
        });
}

function adicionaCategorias() {
    //  console.log(dbCartas);

    for (key in dbCartas) {
        //Adiciona os botôes  
        $("#botoes-categorias").append(
            `<input type="checkbox" class="btn-check btn-categoria" id="btn-${normaliza(key)}" autocomplete="off" value="${key}">
				<label class="btn btn-outline-dark" for="btn-${normaliza(key)}">${key} <span class="badge bg-secondary qtd">${dbCartas[key].length}</span></label>`
        );
        //Adiciona as opções no modal
        $("#select-categorias").append(
            `<option value="${key}">${key}</option>`
        );
        //Adiciona as categorias na tabela de categorias
        $("#corpo-tabela-categorias").append(
            `<tr>
					<td class="categoria-texto">${key}</td>
					<td class="cat-qtd">${dbCartas[key].length}</td>
					<td class="btn-migrar">migrar</td>
				<tr>`
        );

    }
}

function normaliza(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// function pegaCartasBD() {
//     $.get("server/cartas.php", { tabela: "todas" })
//         .done(function(data) {
//             montaTabelaTriagem(data);
//         })
//         .fail(function(e) {
//             console.log("ERRO");
//             console.log(e);
//         });
// }

function pegaMsgsBD() {
    $.get("server/mensagens.php")
        .done(function(data) {
            montaTabelaMensagens(data);
        })
        .fail(function(e) {
            console.log("ERRO");
            console.log(e);
        });
}

// function adicionaCategorias() {
//     for (key in dbCartas) {
//         $("#botoes-categorias").append(
//             `<input type="checkbox" class="btn-check btn-categoria" id="btn-${normaliza(key)}" autocomplete="off" value="${key}">
// 				<label class="btn btn-outline-dark" for="btn-${normaliza(key)}">${key} <span class="badge bg-secondary qtd">${dbCartas[key].length}</span></label>`
//         )
//     }
// }

// Função que processa as cartas e separa entre pretas e brancas
// function calculaQtds() {
//     $("#label-originais .qtd").text(dbCartas["Original"].length);
//     $("#label-expansoes .qtd").text(dbCartas["Expansão"].length);
//     $("#label-personalizadas .qtd").text(dbCartas["Personalizada"].length);
// }

// Listen pra quando marca os botões de categoria
$("#botoes-categorias").on("change", ".btn-categoria", (e) => {
    if ($(e.currentTarget).is(":checked")) {
        montaTabelaTodas(e.currentTarget.value);
    } else {
        removeLinhaTabela(e.currentTarget.value);
    }
});

// Função que remove a linha da tabela
function removeLinhaTabela(categoria) {
    $(".todas tr[categoria|='" + categoria + "'").remove();
    atualizaQtd();
}

// Função que cria a tabela de cartas
function montaTabelaTodas(categoria) {

    let cartasBrancas = "",
        cartasPretas = "";

    $.each(dbCartas[categoria], function(key, val) {
        if (val.tipo == "b") {
            cartasBrancas = cartasBrancas + novaLinhaTodas(val, categoria);
        } else {
            cartasPretas = cartasPretas + novaLinhaTodas(val, categoria);
        }
    });

    $(".todas .corpo-tabela-brancas").append(cartasBrancas);
    $(".todas .corpo-tabela-pretas").append(cartasPretas);
    atualizaQtd();
}

// Função que monta a tabela com todas as cartas para adm
function montaTabelaTriagem(cartas) {
    let cartasBrancas = "",
        cartasPretas = "";

    $.each(cartas["b"], function(key, val) {
        cartasBrancas = cartasBrancas + novaLinhaTriagem(val, "b");
    })

    $.each(cartas["p"], function(key, val) {
        cartasPretas = cartasPretas + novaLinhaTriagem(val, "p");
    })

    $(".triagem .corpo-tabela-brancas").append(cartasBrancas);
    $(".triagem .corpo-tabela-pretas").append(cartasPretas);
    atualizaQtd();
}

function montaTabelaMensagens(mensagens) {
    let linhas = "";
    $.each(mensagens, function(key, val) {
        linhas = linhas + novaLinhaMensagens(val);
    })
    $("#corpo-tabela-mensagens").append(linhas);
    atualizaQtd();
}

// Função que formata uma nova linha de cartas para a tabela
function novaLinhaTriagem(dados, tipo) {
    return `<tr id-carta="${dados.id}">
                <td class="carta-texto" id-carta="${dados.id}" tipo="${tipo}" tabela="triagem">${dados.texto}</td>
                <td class="carta-categoria" id-carta="${dados.id}" tabela="triagem">Personalizadas</td>
                <td class="btns"><span class="btn-remover" id-carta="${dados.id}" tabela="triagem">remover</span><br /><span class="btn-aprovar" id-carta="${dados.id}">aprovar</span></td>
            </tr>
            `;
}

// Função que formata uma nova linha de cartas para a tabela
function novaLinhaTodas(dados, categoria) {

    return `<tr tipo="${dados.tipo}" texto="${dados.texto}" ${dados.id ? "id-carta=" + dados.id : ""} categoria="${
				categoria ? categoria : ""	}">
							 <td class="carta-texto" id-carta="${dados.id}" tabela="todas">${dados.texto}</td>
							 <td class="carta-categoria" id-carta="${dados.id}" tabela="todas">${categoria ? categoria : ""}</td>
							 <td class="btns"><span class="btn-remover" id-carta="${dados.id}" tabela="todas">remover</span></td>
						</tr>
						`;
}

// Função que formata uma nova linha de mensagens para a tabela
function novaLinhaMensagens(dados) {
    let miniTexto = dados.mensagem.slice(0, 50).trimEnd();
    return `<tr class="linha-msg" id-msg="${dados.id}">
                <td class="msg-data">${dayjs(dados.data).fromNow()}</td>
                <td class="msg-texto ${dados.lida == 0 ? "": "lida"}" id-msg="${dados.id}" textoCompleto="${dados.mensagem}">${miniTexto + (dados.mensagem.length > miniTexto.length ? "..." : "")}</td>
					 </tr>
					 `;
}

function atualizaQtd() {
    $(".triagem .qtd-brancas > .qtd").text($(".triagem .corpo-tabela-brancas > tr").length);
    $(".triagem .qtd-pretas > .qtd").text($(".triagem .corpo-tabela-pretas > tr").length);
    $(".qtd-mensagens > .qtd").text($("#corpo-tabela-mensagens > tr").length);

}

// Listen para quando se clica no texto da carta
$(".cartas").on("click", "td.carta-texto", (e) => {
    let textoOriginal = $(e.target).text();
    console.log(textoOriginal);
    $("#label-texto-novo").text("Original: " + textoOriginal);
    $("#texto-novo").val(textoOriginal);
    $("#modal-troca-texto .btn-trocar").attr("id-carta", $(e.target).attr("id-carta")).attr("tabela", $(e.target).attr("tabela"));

    var modalTexto = new bootstrap.Modal(document.getElementById('modal-troca-texto'));
    modalTexto.show();
})

// Listen para quando se clica, no modal, para trocar o texto da carta
$("#modal-troca-texto .btn-trocar").click((e) => {
    let textoTrocado = $("#texto-novo").val();
    $("." + $(e.target).attr("tabela") + " td.carta-texto[id-carta=" + $(e.target).attr("id-carta") + "]").text(textoTrocado);
    if ($(e.target).attr("tabela") == "todas") insereBotaoSalvar($(e.target).attr("id-carta"));
    var modalTexto = bootstrap.Modal.getInstance(document.getElementById('modal-troca-texto'));
    modalTexto.hide();
})

// Listen para quando se clica na categoria da carta
$(".cartas").on("click", "td.carta-categoria", (e) => {
    let categoriaOriginal = $(e.target).text();
    console.log(categoriaOriginal);
    $("#label-categoria-nova").text("Original: " + categoriaOriginal);
    $('#select-categorias').val(categoriaOriginal).prop('selected', true);
    $("#modal-troca-categoria .btn-trocar").attr("id-carta", $(e.target).attr("id-carta")).attr("tabela", $(e.target).attr("tabela"));

    var modalTexto = new bootstrap.Modal(document.getElementById('modal-troca-categoria'));
    modalTexto.show();
})

// Listen para quando se clica, no modal, para trocar a categoria da carta
$("#modal-troca-categoria .btn-trocar").click((e) => {
    let categoriaTrocada = $("#select-categorias").val();
    $("." + $(e.target).attr("tabela") + " td.carta-categoria[id-carta=" + $(e.target).attr("id-carta") + "]").text(categoriaTrocada);
    if ($(e.target).attr("tabela") == "todas") insereBotaoSalvar($(e.target).attr("id-carta"));
    var modalTexto = bootstrap.Modal.getInstance(document.getElementById('modal-troca-categoria'));
    modalTexto.hide();
})

function insereBotaoSalvar(idCarta) {
    if ($("tr[id-carta=" + idCarta + "] td.btns .btn-salvar").length == 0) {
        $(".todas tr[id-carta=" + idCarta + "] td.btns").append(
            `<br><span class="btn-salvar" id-carta="${idCarta}">salvar</span>`
        );
    }
}

// Listen para quando se clica para salvar a carta
$(".cartas").on("click", ".btn-salvar", (e) => {

    if (doisCliques(e)) {
        let idCarta = $(e.target).attr("id-carta");
        let texto = $(".todas td.carta-texto[id-carta=" + idCarta + "]").text();
        let categoria = $(".todas td.carta-categoria[id-carta=" + idCarta + "]").text();

        $.post("server/cartas.php", { tipo: "PUT", idCarta: idCarta, texto: texto, categoria: categoria })
            .done(function(data) {
                $("tr[id-carta=" + idCarta + "]").remove();
                mostraAlerta("sucesso", "Carta salva com sucesso!")
                atualizaQtd();
            })
            .fail(function(e) {
                console.log("ERRO");
                mostraAlerta("erro", "Deu erro ao salvar a carta!")
                console.log(e);
            });
    }
})

///////////////// TROCAR O SELECT DE CATEGORIA DO MODAL POR DATALIST
///////////////// COLOCAR UM BOTÃO DE ATUALIZAR
///////////////// COLOCAR UMA ÁREA DE MEXER NAS CATEGORIAS (ADICIONAR, ALTERAR)
///////////////// COLOCAR UM BOTÃO PRA SALVAR TODAS AS ALTERAÇÕES

// Listen para quando se clica para remover a carta
$(".cartas").on("click", ".btn-remover", (e) => {

    if (doisCliques(e)) {
        let idCarta = $(e.target).attr("id-carta");
        let tabela = $(e.target).attr("tabela");

        $.post("server/cartas.php", { tipo: "DELETE", idCarta: idCarta, tabela: tabela })
            .done(function(data) {
                $("tr[id-carta=" + idCarta + "]").remove();
                mostraAlerta("sucesso", "Removido com sucesso!")
                atualizaQtd();
            })
            .fail(function(e) {
                console.log("ERRO");
                mostraAlerta("erro", "Deu erro!")
                console.log(e);
            });
    }
})

// Listen para quando se clica para aprovar a carta
$(".cartas").on("click", ".btn-aprovar", (e) => {

    if (doisCliques(e)) {
        let idCarta = $(e.target).attr("id-carta");
        let textoCarta = $("td.carta-texto[id-carta=" + idCarta + "]").text();
        let tipoCarta = $("td.carta-texto[id-carta=" + idCarta + "]").attr("tipo");
        let catCarta = $("td.carta-categoria[id-carta=" + idCarta + "]").text();

        $.post("server/cartas.php", { tipo: "POST", aprovadas: 1, cartas: [{ texto: textoCarta, tipo: tipoCarta, categoria: catCarta }] })
            .done(function(data) {
                //console.log(data);
                $.post("server/cartas.php", { tipo: "DELETE", idCarta: idCarta, tabela: "triagem" })
                    .done((e) => {
                        $("tr[id-carta=" + idCarta + "]").remove();
                        mostraAlerta("sucesso", "Carta aprovada!")
                        atualizaQtd();
                    })
                    .fail((e) => {
                        console.log("ERRO ao apagar");
                        mostraAlerta("erro", "Deu erro!")
                        console.log(e);
                    })
            })
            .fail(function(e) {
                console.log("ERRO ao salvar");
                mostraAlerta("erro", "Deu erro!")
                console.log(e);
            });
    }
});

// Listen para quando se clica para remover a mensagem na lista
// $(".lista-mensagens").on("click", ".btn-remover", (e) => {

//     if (doisCliques(e)) {
//         let idMsg = $(e.target).attr("id-msg");
//         removerMsgBD(idMsg);
//     }
// })

// Função que apaga a mensagem do BD
function removerMsgBD(idMsg) {
    $.post("server/mensagens.php", { tipo: "DELETE", idMsg: idMsg })
        .done(function(data) {
            $("tr[id-msg=" + idMsg + "]").remove();
            mostraAlerta("sucesso", "Removido com sucesso!")
            atualizaQtd();
        })
        .fail(function(e) {
            console.log("ERRO");
            mostraAlerta("erro", "Deu erro!")
            console.log(e);
        });
}

// Listen para quando clica na mensagem, para abrir a mensagem completa
$("#corpo-tabela-mensagens").on("click", "tr", (e) => {

    let idMsg = $(e.currentTarget).attr("id-msg");
    let textoMsg = $(e.currentTarget).children("td.msg-texto").attr("textocompleto");
    $("#corpo-mensagem").val(textoMsg).attr("id-msg", idMsg);

    if (!$(e.currentTarget).children("td.msg-texto").hasClass("lida")) {
        $(".msg-texto[id-msg=" + idMsg + "]").addClass("lida");

        $.post("server/mensagens.php", { tipo: "LIDA", idMsg: idMsg, lida: 1 })
            .fail(function(e) {
                console.log("ERRO ao marcar mensagem como lida");
                console.log(e);
            });
    }
})

// Listen para quando clica na botão apagar mensagem
$("#btn-apagar").click((e) => {
    let idMsg = $("#corpo-mensagem").attr("id-msg");
    if (idMsg) {
        if (doisCliques(e)) {
            removerMsgBD(idMsg);
            $("#corpo-mensagem").val("").removeAttr("id-msg");
        }
    }
})

// Listen para quando clica na botão marcar como não lida
$("#btn-marcarnaolida").click((e) => {
    let idMsg = $("#corpo-mensagem").attr("id-msg");
    if (idMsg) {
        $(".msg-texto[id-msg=" + idMsg + "]").removeClass("lida");
        $("#corpo-mensagem").val("").removeAttr("id-msg");
        $.post("server/mensagens.php", { tipo: "LIDA", idMsg: idMsg, lida: 0 })
            .fail(function(e) {
                console.log("ERRO ao marcar mensagem como não lida");
                console.log(e);
            });
    }
})

// Função de mostrar os alertas
function mostraAlerta(tipo, msg) {
    var campoToast = $(".toast");
    var toast = new bootstrap.Toast(campoToast)

    if (tipo = "sucesso") {
        $(campoToast).addClass("bg-success")
    } else {
        $(campoToast).addClass("bg-danger")
    }
    $(".toast-body").text(msg)
    toast.show();
}

/* 
 * Função que testa se o botão já foi clicado
 * A ideia é que para realizar a função, tem que clicar duas vezes no botão, numa espécie de confirmação.
 * retorna true se já tiver clicado ou
 * retorna false se for o primeiro clique
 */
function doisCliques(e) {
    if ($(e.target).attr("clique") == 1) {
        $(e.target).attr("clique", 0);
        return true;
    } else {
        $(e.target).attr("clique", 1);
        return false;
    }
}

// // Função que formata o texto inserido das cartas pretas e adiciona à tabela p/ impressão
// function adicionaPretaPersonalizada() {
// 	let campo = $("#texto-personalizacao-pretas");
// 	let textos = campo.val().split("\n");

// 	textosCorrigidos = textos.map((texto) => {
// 		return texto.replace(!/[()\w+]/g, "");
// 		//let textoLimpo = texto.replace(!/[()\w+]/g, "");
// 		//return textoLimpo.replace(/(?<!_)_(?!_)/g, "__________");
// 	});

// 	adicionaCartaNaTabela(textosCorrigidos, "p");
// 	campo.val("");
// }

// // Função que formata o texto inserido das cartas brancas e adiciona à tabela p/ impressão
// function adicionaBrancaPersonalizada() {
// 	let campo = $("#texto-personalizacao-brancas");
// 	let textos = campo.val().split("\n");

// 	textosCorrigidos = textos.map((texto) => {
// 		return texto.replace(!/[()\w+]/g, "");
// 	});

// 	adicionaCartaNaTabela(textosCorrigidos, "b");
// 	campo.val("");
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

// //Listen para os radios de padrão das cartas
// $("#tipo-fundo .form-check-input").on("change", () => {
// 	impressao.verso = $("input[name=tipo-fundo]:checked").val();
// 	$(".carta-exemplo.preta").toggleClass("economico");
// 	trocaCorPreta();
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

// // Função que monta as linhas de corte
// function montaLinhasDeCorte(doc) {
// 	doc.setDrawColor(0);
// 	doc.setLineWidth(0.1);

// 	for (key in coordImpressao.padrao.corte.x) {
// 		let x = coordImpressao.padrao.corte.x;
// 		doc.line(x[key], 0, x[key], 5);
// 		doc.line(x[key], 292, x[key], 297);
// 	}
// 	for (key in coordImpressao.padrao.corte.y) {
// 		let y = coordImpressao.padrao.corte.y;
// 		doc.line(0, y[key], 5, y[key]);
// 		doc.line(205, y[key], 210, y[key]);
// 	}
// }

// // Função que cria os fundos das cartas
// function fundoCarta(doc) {
// 	let x = coordImpressao.padrao[impressao.cont].fora[0];
// 	let y = coordImpressao.padrao[impressao.cont].fora[1];
// 	doc.roundedRect(x, y, 63.5, 88, 3, 3, "FD");
// }

// function atualizaImpCont(doc) {
// 	if (impressao.cont == 9) {
// 		impressao.cont = 1;
// 		doc.addPage();
// 		montaLinhasDeCorte(doc);
// 	} else {
// 		impressao.cont = ++impressao.cont;
// 	}
// }

// // Função que monta a parte da frente das cartas
// function montaFrentes(tipo, val, doc) {
// 	let xTextoDentro = coordImpressao.padrao[impressao.cont].dentro[0][0];
// 	let yTextoDentro = coordImpressao.padrao[impressao.cont].dentro[0][1];
// 	let xRodapeDentro = coordImpressao.padrao[impressao.cont].dentro[2][0];
// 	let yRodapeDentro = coordImpressao.padrao[impressao.cont].dentro[2][1];
// 	let maxText =
// 		coordImpressao.padrao[impressao.cont].dentro[1][0] - xTextoDentro;
// 	let xfora = coordImpressao.padrao[impressao.cont].fora[0];

// 	doc.setDrawColor(255);

// 	// let texto = [po,po]
// 	// val = val.toString();
// 	// console.log("1: " + val == texto);
// 	// console.log("2: " + val === texto);

// 	val = val
// 		.replace(/\\n /g, "\n")
// 		.replace(/\\n/g, "\n")
// 		.replace(/(?<!_)_(?!_)/g, "\n_________________\n");

// 	let textoCarta = doc.setFontSize(16).splitTextToSize(val, 53.5);
// 	// console.log(val);
// 	// textoCarta = val.split("\n");
// 	// console.log(textoCarta);
// 	if (tipo != "branca" && impressao.verso == "padrao") {
// 		doc.setFillColor(impressao.cor || 0); //dentro
// 		doc.setTextColor(255);
// 		fundoCarta(doc);

// 		doc.text(textoCarta, xTextoDentro, yTextoDentro);

// 		//rodapé
// 		doc.setFontSize(10);
// 		doc.text(
// 			$("#texto-rodape").val() || "Cartas Radioativas",
// 			xRodapeDentro + 8,
// 			yRodapeDentro - 1
// 		);
// 		doc.addImage(
// 			"imgs/biohazard-branco.png",
// 			"png",
// 			xRodapeDentro,
// 			yRodapeDentro - 5,
// 			5,
// 			5
// 		);
// 	} else {
// 		doc.setFillColor(255);
// 		doc.setTextColor(0);
// 		fundoCarta(doc);

// 		doc.text(textoCarta, xTextoDentro, yTextoDentro);

// 		//rodapé

// 		if (tipo == "branca") {
// 			doc.addImage(
// 				"imgs/biohazard-preto.png",
// 				"png",
// 				xRodapeDentro,
// 				yRodapeDentro - 5,
// 				5,
// 				5
// 			);
// 		} else {
// 			doc.setFillColor(impressao.cor || 0);
// 			doc.rect(xfora, yRodapeDentro - 7, 63.5, 9, "F");
// 			doc.setTextColor(255);
// 			doc.addImage(
// 				"imgs/biohazard-branco.png",
// 				"png",
// 				xRodapeDentro,
// 				yRodapeDentro - 5,
// 				5,
// 				5
// 			);
// 		}

// 		doc.setFontSize(10);
// 		doc.text(
// 			$("#texto-rodape").val() || "Cartas Radioativas",
// 			xRodapeDentro + 7,
// 			yRodapeDentro - 1.5
// 		);
// 	}

// 	atualizaImpCont(doc);
// }

// // Função que monta a parte de trás das cartas
// function montaVerso(tipo, doc) {
// 	let xDentro = coordImpressao.padrao[impressao.cont].dentro[0][0];
// 	let yDentro = coordImpressao.padrao[impressao.cont].dentro[0][1];
// 	let xFora = coordImpressao.padrao[impressao.cont].fora[0];

// 	let tamImagem = 15;

// 	let logoDentro = [xFora + 31.75 - tamImagem / 2, yDentro + 5];

// 	doc.setDrawColor(255);

// 	if (tipo != "branca" && impressao.verso == "padrao") {
// 		doc.setFillColor(impressao.cor || 0);
// 		doc.setTextColor(255);
// 		fundoCarta(doc);
// 		doc.addImage(
// 			"imgs/biohazard-branco.png",
// 			"png",
// 			logoDentro[0],
// 			logoDentro[1],
// 			tamImagem,
// 			tamImagem
// 		);
// 	} else {
// 		doc.setFillColor(255);
// 		fundoCarta(doc);

// 		if (tipo == "branca") {
// 			doc.setTextColor(0);
// 			doc.addImage(
// 				"imgs/biohazard-preto.png",
// 				"png",
// 				logoDentro[0],
// 				logoDentro[1],
// 				tamImagem,
// 				tamImagem
// 			);
// 		} else {
// 			doc.setTextColor(255);
// 			doc.setFillColor(impressao.cor || 0);
// 			doc.rect(xFora, yDentro, 63.5, 35, "F");
// 			doc.addImage(
// 				"imgs/biohazard-branco.png",
// 				"png",
// 				logoDentro[0],
// 				logoDentro[1],
// 				tamImagem,
// 				tamImagem
// 			);
// 		}
// 	}

// 	doc.setFontSize(16);
// 	doc.text(
// 		impressao.textoPers,
// 		xFora + 31.75,
// 		logoDentro[1] + tamImagem + 10,
// 		null,
// 		null,
// 		"center"
// 	);

// 	atualizaImpCont(doc);
// }

// // Função que monta o PDF
// function montaPDF() {
// 	impressao.cont = 1;

// 	const { jsPDF } = window.jspdf;

// 	const doc = new jsPDF();

// 	montaLinhasDeCorte(doc);

// 	//Pega os textos das cartas nas tabelas
// 	impressao.brancas = $.map(
// 		$("#corpo-tabela-brancas > tr.marcado"),
// 		(val, i) => {
// 			return $(val).children("td.carta-texto").text();
// 		}
// 	);
// 	impressao.pretas = $.map($("#corpo-tabela-pretas > tr.marcado"), (val, i) => {
// 		return $(val).children("td.carta-texto").text();
// 	});

// 	var totalDeCartas = impressao.brancas.length + impressao.pretas.length;

// 	//Monta as frentes
// 	$.each(impressao.brancas, (i, val) => montaFrentes("branca", val, doc));
// 	$.each(impressao.pretas, (i, val) => montaFrentes("preta", val, doc));

// 	doc.addPage();
// 	montaLinhasDeCorte(doc);
// 	impressao.cont = 1;

// 	//Monta as costas
// 	$.each(impressao.brancas, () => montaVerso("branca", doc));
// 	$.each(impressao.pretas, () => montaVerso("preta", doc));

// 	doc.output("dataurlnewwindow");
// }

// // Função que salva as cartas do usuário
// function salvaCartasBD() {
// 	let cartas = [];

// 	$.each($("tr[categoria='Minha carta']"), (i, v) => {
// 		cartas.push({ texto: $(v).attr("texto"), tipo: $(v).attr("tipo") });
// 	});

// 	$.post("server/cartas.php", { cartas: cartas })
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

// 	var campoToast = $(".toast");
// 	var toast = new bootstrap.Toast(campoToast)

// 	let mensagem = $("#mensagem-conteudo").val();

// 	$.post("server/mensagens.php", { mensagem: mensagem })
// 		.done(function (data) {
// 			console.log(data);
// 			$("#mensagem-conteudo").val("")
// 			$(campoToast).addClass("bg-success")
// 			$(".toast-body").text("Mensagem enviada com sucesso!")
// 			toast.show();
// 		})
// 		.fail(function (e) {
// 			$(campoToast).addClass("bg-danger")
// 			$(".toast-body").text("Opa... não foi não! Tenta de novo")
// 			toast.show()
// 			console.log(e);
// 		});
// });

// Day.js = https://day.js.org/docs/en/plugin/relative-time
// Regex = https://regex101.com/r/yV6qE5/1
// jsPDF = https://raw.githack.com/MrRio/jsPDF/master/docs/jsPDF.html
// SVGToPNG = https://svgtopng.com/pt/
// SweetAlert = https://sweetalert2.github.io/
// P/ trocar cor do png, basta abrir o arquivo em um editor de texto e trocar o fillcolor.