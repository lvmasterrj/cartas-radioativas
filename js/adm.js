dayjs.extend(window.dayjs_plugin_relativeTime);
dayjs.locale('pt-br');

var dbCartas = {};

$(document).ready(() => {
    pegaCartasTriagemBD();
    pegaMsgsBD();
    pegaTodasCartasBD();
    pegaIconesBD();
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
            pegaCategorias();
        })
        .fail(function(e) {
            console.log("ERRO ao pegar todas as cartas");
            console.log(e);
        });
}

//Função de pegar as categorias do BD
function pegaCategorias() {
    $.get("server/categorias.php")
        .done(function(data) {
            //return data;
            adicionaCategorias(data);
        })
        .fail(function(e) {
            console.log("ERRO ao pegar as categorias");
            console.log(e);
        });
}

// Função que pega o nome dos icones no BD
function pegaIconesBD() {
    $.get("server/icones.php")
        .done(function(data) {
            adicionaIcones(data);
        })
        .fail(function(e) {
            console.log("ERRO ao pegar os ícones");
            console.log(e);
        });
}

function adicionaIcones(icones) {
    $.each(icones, (k, v) => {
        $(".area-icones").append(
            `<div class="col-4 justify-content-center p-1 icone" icone-nome="${v.nome}">
			  		<img src="/imgs/icones/${v.nome}-preto.png" class="w-100 icone-p">
					<img src="/imgs/icones/${v.nome}-branco.png" class="w-100 icone-b">
					<p class="text-center mb-0">${v.nome}</p>
			  </div>`
        )

    })
}

function adicionaCategorias(categorias) {

    $.each(categorias, (k, v) => {
        //console.log(v);
        $("#select-categorias").append(
            `<option value="${v.nome}">${v.nome}</option>`
        );

        $("#corpo-tabela-categorias").append(
            `<tr>
        		<td class="categoria-texto">${v.nome}</td>
        		<td class="categoria-icone" cat-id='${v.id}' icone-nome="${v.icone}">
				  <img src='/imgs/icones/${v.icone}-preto.png' width='20' height='20'>
				</td>
        		<td class="cat-qtd">${dbCartas[v.nome]?dbCartas[v.nome].length:0}</td>
        		<td class="btn-migrar">migrar</td>
        	<tr>`
        );
    });

    for (key in dbCartas) {

        //Adiciona os botôes  
        $("#botoes-categorias").append(
            `<input type="checkbox" class="btn-check btn-categoria" id="btn-${normaliza(key)}" autocomplete="off" value="${key}">
     			<label class="btn btn-outline-dark" for="btn-${normaliza(key)}">${key} <span class="badge bg-secondary qtd">${dbCartas[key].length}</span></label>`
        );


        //Verifica se a categoria já foi puxada
        if (!$("td.categoria-texto:contains('" + key + "')").length) {
            //Adiciona as opções no modal
            $("#select-categorias").append(
                `<option value="${key}">${key}</option>`
            );

            //Adiciona as categorias na tabela de categorias
            $("#corpo-tabela-categorias").append(
                `<tr>
    						<td class="categoria-texto">*${key}</td>
    						<td class="categoria-icone" cat-id='' icone-nome="" >-</td>
    						<td class="cat-qtd">${dbCartas[key].length}</td>
    						<td class="btn-migrar">migrar</td>
    					<tr>`
            );
        }


    }
}

function normaliza(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function pegaMsgsBD() {
    $.get("server/mensagens.php")
        .done(function(data) {
            montaTabelaMensagens(data);
        })
        .fail(function(e) {
            console.log("ERRO ao pegar mensagens");
            console.log(e);
        });
}

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
                <td class="carta-texto" id-carta="${dados.id}" tipo="${tipo}" tabela="triagem">${dados.texto.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>
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
    $("#label-categoria-nova").text("Original: " + categoriaOriginal);
    $('#select-categorias').val(categoriaOriginal).prop('selected', true);
    $("#modal-troca-categoria .btn-trocar").attr("id-carta", $(e.target).attr("id-carta")).attr("tabela", $(e.target).attr("tabela"));

    var modalTexto = new bootstrap.Modal(document.getElementById('modal-troca-categoria'));
    modalTexto.show();
})

// Listen para quando se clica, no modal, para trocar a categoria da carta
$("#modal-troca-categoria .btn-trocar").click((e) => {
    let categoriaTrocada = $("#select-categorias").val();
    console.log("Categoria Selecionada: " + categoriaTrocada)
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
        let texto = $(".todas td.carta-texto[id-carta=" + idCarta + "]").text().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        let categoria = $(".todas td.carta-categoria[id-carta=" + idCarta + "]").text();

        $.post("server/cartas.php", { tipo: "PUT", idCarta: idCarta, texto: texto, categoria: categoria })
            .done(function(data) {
                $("tr[id-carta=" + idCarta + "]").remove();
                mostraAlerta("sucesso", "Carta salva com sucesso!")
                atualizaQtd();
            })
            .fail(function(e) {
                console.log("ERRO ao salvar carta");
                mostraAlerta("erro", "Deu erro ao salvar a carta!")
                console.log(e);
            });
    }
})

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
                console.log("ERRO ao remover cartas");
                mostraAlerta("erro", "Deu erro!")
                console.log(e);
            });
    }
})

// Listen para quando se clica para aprovar a carta
$(".cartas").on("click", ".btn-aprovar", (e) => {

    if (doisCliques(e)) {
        let idCarta = $(e.target).attr("id-carta");
        let textoCarta = $("td.carta-texto[id-carta=" + idCarta + "]").text().replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
        .done((data) => {
            $("tr[id-msg=" + idMsg + "]").remove();
            mostraAlerta("sucesso", "Removido com sucesso!")
            atualizaQtd();
        })
        .fail((e) => {
            console.log("ERRO ao remover Msg");
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

// Listen para quando clica em adicionar ícone
$("#adicionar-icones").click((e) => {
    var modalTexto = new bootstrap.Modal(document.getElementById('modal-icones'));
    modalTexto.show();
});

// Listen para fazer preview, quando escolhe um ícone no modal
$(".input-icone").on("change", (e) => {
    //console.log($(e.target));
    let file = e.target.files[0]

    //console.log($($(e.target).attr("preview")));
    if (file) {
        $($(e.target).attr("preview")).attr("src", URL.createObjectURL(file))

        if (file.name.endsWith("-branco.png")) {
            $(e.target).attr("nome-icone", file.name.substring(0, file.name.length - 11));
        } else if (file.name.endsWith("-preto.png")) {
            $(e.target).attr("nome-icone", file.name.substring(0, file.name.length - 10));
        } else {
            mostraAlerta("danger", "Nome da imagem incorreto (xxx-preto.png ou xxx-branco.png) - " + file.name);
        }
    }
});

// Listen para upload das imagens do ícones quando clica em adicionar ícone no modal
$("#modal-icones .btn-adicionar").click(() => {
    //console.log($('#input-icone-branco')[0].files);
    console.log("Adicionando icone");
    let fd = new FormData();
    let icone1 = $('#input-icone-branco')[0].files;
    let icone2 = $('#input-icone-preto')[0].files;

    if (icone1.length == 1 && icone2.length == 1) {
        fd.append('icone1', icone1[0]);
        fd.append('icone2', icone2[0]);
        fd.append('tipo', 'POST');

        $.ajax({
            url: "server/icones.php",
            type: "post",
            data: fd,
            contentType: false,
            processData: false,
            success: function(response) {
                if (response != 0) {
                    mostraAlerta("sucesso", "Ícones salvos com sucesso");
                    var modalIcones = bootstrap.Modal.getInstance(document.getElementById('modal-icones'));
                    modalIcones.hide();
                } else {
                    mostraAlerta("danger", "Erro ao salvar os ícones");
                    console.log("ERRO ao salvar as imagens");
                }
            },
        });

    } else {
        mostraAlerta("danger", "Faltou adicionar o(s) arquivo(s)");
    }
});

// Listen para, quando clicar no ícone das categorias, abrir o modal para selecionar o ícone
$("#corpo-tabela-categorias").on("click", ".categoria-icone", (e) => {
    let icone = $(e.currentTarget).attr("icone-nome");
    $("#modal-escolhe-icone .icone[icone-nome='" + icone + "']").addClass("border border-3 border-success icone-selecionado");
    $("#modal-escolhe-icone .btn-adicionar").attr("cat-id", $(e.currentTarget).attr("cat-id"));
    var modalSelectIcones = new bootstrap.Modal(document.getElementById('modal-escolhe-icone'));
    modalSelectIcones.show();
});

// Listen para quando seleciona um ícone dentro do modal de seleção de ícones
$("#modal-escolhe-icone").on("click", ".icone", (e) => {
    $("#modal-escolhe-icone .icone-selecionado").removeClass(["border", "border-3", "border-success", "icone-selecionado"]);

    $(e.currentTarget).addClass("border border-3 border-success icone-selecionado");
})

//Listen para quando o modal é fechado
$("#modal-escolhe-icone").on('hidden.bs.modal', (e) => {
    $("#modal-escolhe-icone .icone-selecionado").removeClass(["border", "border-3", "border-success", "icone-selecionado"]);
})

// Listen para quando clica no botão de escolher o ícone dentro do modal
$("#modal-escolhe-icone .btn-adicionar").click((e) => {
    let icone = $("#modal-escolhe-icone .icone-selecionado").attr("icone-nome");
    let catID = $(e.currentTarget).attr("cat-id")

    $.post("server/categorias.php", {
            tipo: "PUT",
            acao: "trocaIcone",
            catID: catID,
            icone: icone
        })
        .done(function(data) {
            mostraAlerta("sucesso", "Ícones adicionado à categoria");
            var modalSelectIcones = bootstrap.Modal.getInstance(document.getElementById('modal-escolhe-icone'));
            modalSelectIcones.hide();
            //return data;
            //adicionaCategorias(data);
        })
        .fail(function(e) {
            console.log("ERRO ao adicionar o ícone à categoria");
            console.log(e);
        });
});


// Função de mostrar os alertas
function mostraAlerta(tipo, msg) {
    var campoToast = $(".toast");
    var toast = new bootstrap.Toast(campoToast)

    if (tipo == "sucesso") {
        $(campoToast).addClass("bg-success")
    } else {
        $(campoToast).addClass("bg-danger")
    }
    $(".toast-body").text(msg)
    toast.show();
}

// Listen para o campo de pesquisa
$("#campo-pesquisa").change(e => {
    console.log(e);
})

/* 
 * Função que testa se o botão já foi clicado
 * A ideia é que para realizar a função, tem que clicar duas vezes no botão, numa espécie de confirmação.
 * retorna true se já tiver clicado ou
 * retorna false se for o primeiro clique
 */
function doisCliques(e) {
    if ($(e.target).attr("clique") == 1) {
        $(e.target).attr("clique", 0).text($(e.target).text().substring(0, $(e.target).text().length - 1), );
        return true;
    } else {
        $(e.target).attr("clique", 1).text($(e.target).text() + "*");
        return false;
    }
}