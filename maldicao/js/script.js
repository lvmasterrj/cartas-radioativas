var impressao = {
    cont: 1,
    textoPers: "Maldição",
    cartas: {},
    imprimir: [],
    paginas: {}
};

$(document).ready(() => {
    $("#modal-aguarde").modal('show');
    pegaCartasBD();
});

function pegaCartasBD() {
    $.get("server/maldicao.php", { tabela: "todas" })
        .done(function(data) {
            impressao.cartas = data;
            adicionaCategorias();
            $("#modal-aguarde").modal('hide');
        })
        .fail(function(e) {
            console.log("ERRO");
            console.log(e);
            $("#modal-aguarde").modal('hide');
        });
}

function adicionaCategorias() {
    for (let key in impressao.cartas) {
        $("#botoes-categorias").append(
            `<input type="checkbox" class="btn-check btn-categoria" id="btn-${normaliza(key)}" autocomplete="off" value="${key}">
            <label class="btn btn-outline-secondary" for="btn-${normaliza(key)}">${key} <span class="badge bg-dark qtd ms-1">${impressao.cartas[key].length}</span></label>`
        );
    }
}

function normaliza(str) {
    return str.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

$("#botoes-categorias").on("change", ".btn-categoria", (e) => {
    if ($(e.currentTarget).is(":checked")) {
        montaTabela(e.currentTarget.value);
    } else {
        removeLinhaTabela(e.currentTarget.value);
    }
});

function removeLinhaTabela(categoria) {
    $("tr[categoria='" + categoria + "']").remove();
    atualizaQtd();
}

function montaTabela(categoria) {
    let linhas = "";
    $.each(impressao.cartas[categoria], function(key, val) {
        linhas += novaLinhaTabela(val, categoria);
    });
    $("#corpo-tabela-brancas").append(linhas);
    atualizaQtd();
}

function novaLinhaTabela(dados, categoria, marcado) {
    return `<tr class="${marcado ? "marcado" : ""}" texto="${dados.texto}" ${dados.id ? "id=" + dados.id : ""} categoria="${categoria ? categoria : ""}">
                <td class="carta-texto">${dados.texto}</td>
                <td class="carta-categoria">${categoria ? categoria : ""}</td>
                <td class="btns">${marcado ? `<span class="btn-remover">remover</span>` : ""}</td>
            </tr>`;
}

$("tbody").on("click", "tr", function(e) {
    let dados = $(e.currentTarget);
    marca(dados);
});

function marca(e) {
    e.toggleClass("marcado");
    atualizaQtd();
}

function atualizaQtd() {
    $(".qtd-brancas > .qtd-selec").text($("#corpo-tabela-brancas > .marcado").length);
    $(".qtd-brancas > .qtd-total").text($("#corpo-tabela-brancas > tr").length);
}

function adicionaBrancaPersonalizada() {
    if (!$("#texto-personalizacao-brancas").val()) {
        Swal.fire({
            icon: 'error',
            title: 'Ei!',
            text: 'Você não inseriu nenhuma maldição!'
        });
    } else {
        let campo = $("#texto-personalizacao-brancas");
        let textos = campo.val().split("\n");

        let textosCorrigidos = textos.map((texto) => {
            return texto.replace(!/[()\w+]/g, "");
        });

        adicionaCartaNaTabela(textosCorrigidos);
        campo.val("");
    }
}

function adicionaCartaNaTabela(textos) {
    let items = "";
    for (let key in textos) {
        if (textos[key].trim()) {
            let info = { texto: textos[key] };
            items += novaLinhaTabela(info, "Minha carta", 1);
        }
    }
    $("#corpo-tabela-brancas").append(items);
    atualizaQtd();
}

$("tbody").on("click", ".btn-remover", function(e) {
    $(e.currentTarget).parents("tr").remove();
});

function selecionaTodas() {
    $.each(
        $("#corpo-tabela-brancas").children("tr").not(".marcado"),
        (i, v) => { marca($(v)); }
    );
}

function desselecionaTodas() {
    $.each($("#corpo-tabela-brancas").children("tr.marcado"), (i, v) => {
        marca($(v));
    });
}

function salvaCartasBD() {
    let cartas = [];
    $.each($("tr[categoria='Minha carta']"), (i, v) => {
        cartas.push($(v).attr("texto"));
    });

    $.post("server/maldicao.php", { tipo: "POST", cartas: cartas })
        .done(function(data) { console.log(data); })
        .fail(function(e) { console.log(e); });
}

function gerarPDF() {
    if ($("tr.marcado").length == 0) {
        Swal.fire({
            icon: "error",
            title: "Ops...",
            text: "Você se esqueceu de selecionar as cartas para impressão!",
        });
        return;
    }

    if ($("tr[categoria='Minha carta']").length > 0) {
        Swal.fire({
            title: "Podemos salvar suas maldições?",
            html: 'Podemos salvar as suas maldições para a galera sofrer também?!<br><span class="fs-6 text-black-50"><em>As cartas serão avaliadas e caso aprovadas aparecerão na categoria "personalizadas"</em></span>',
            icon: "question",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: `Claro, pode salvar`,
            denyButtonText: `Não, só gere meu PDF`,
            cancelButtonText: `Espera, ainda não estou pronto`,
        }).then((result) => {
            if (result.isConfirmed) {
                salvaCartasBD();
                montaPDF();
            } else if (result.isDenied) {
                montaPDF();
            }
        });
    } else {
        montaPDF();
    }
}

$("#mensagem").on("submit", function(e) {
    e.preventDefault();
    if (!$("#mensagem-conteudo").val()) {
        Swal.fire({
            icon: 'error',
            title: 'E a mensagem?',
            text: 'Você esqueceu de digitar a mensagem meu amor!'
        });
    } else {
        var campoToast = $(".toast");
        var toast = new bootstrap.Toast(campoToast);
        let mensagem = $("#mensagem-conteudo").val();

        $.post("../server/mensagens.php", { tipo: "POST", mensagem: mensagem })
            .done(function(data) {
                $("#mensagem-conteudo").val("");
                $(campoToast).addClass("bg-success");
                $(".toast-body").text("Mensagem enviada com sucesso!");
                toast.show();
            })
            .fail(function(e) {
                $(campoToast).addClass("bg-danger");
                $(".toast-body").text("Opa... não foi não! Tenta de novo");
                toast.show();
                console.log(e);
            });
    }
});
