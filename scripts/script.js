var impressao = { cont: 1, cor: null, verso: "padrao", textoPers: "Cartas Radioativas" };
var dbCartas = {};
var coordImpressao = {
    padrao: {
        corte: {
            x: [10, 73.5, 137, 200.5],
            y: [17, 105, 193, 281]
        },
        1: {
            fora: [10, 17],
            dentro: [
                [15, 27],
                [68.5, 22],
                [15, 100],
                [68.5, 100]
            ]
        },
        2: {
            fora: [73.5, 17],
            dentro: [
                [78.5, 27],
                [132, 22],
                [78.5, 100],
                [132, 100]
            ]
        },
        3: {
            fora: [137, 17],
            dentro: [
                [142, 27],
                [195.5, 22],
                [142, 100],
                [195.5, 100]
            ]
        },
        4: {
            fora: [10, 105],
            dentro: [
                [15, 115],
                [68.5, 110],
                [15, 188],
                [68.5, 188]
            ]
        },
        5: {
            fora: [73.5, 105],
            dentro: [
                [78.5, 115],
                [132, 110],
                [78.5, 188],
                [132, 188]
            ]
        },
        6: {
            fora: [137, 105],
            dentro: [
                [142, 115],
                [195.5, 110],
                [142, 188],
                [195.5, 188]
            ]
        },
        7: {
            fora: [10, 193],
            dentro: [
                [15, 203],
                [68.5, 198],
                [15, 276],
                [68.5, 276]
            ]
        },
        8: {
            fora: [73.5, 193],
            dentro: [
                [78.5, 203],
                [132, 198],
                [78.5, 276],
                [132, 276]
            ]
        },
        9: {
            fora: [137, 193],
            dentro: [
                [142, 203],
                [195.5, 198],
                [142, 276],
                [195.5, 276]
            ]
        }
    }
}

$(document).ready(pegaCartasBD());

// Função que pega as cartas na tabela
function pegaCartasBD() {
    $.get("server/cartas.php")
        .done(function(data) {
            dbCartas = data;
            calculaQtds();
        })
        .fail(function(e) {
            console.log("ERRO");
            console.log(e)
        });
}

// Função que processa as cartas e separa entre pretas e brancas
function calculaQtds() {
    $("#label-originais .qtd").text(dbCartas['Original'].length);
    $("#label-expansoes .qtd").text(dbCartas['Expansão'].length);
    $("#label-personalizadas .qtd").text(dbCartas['Personalizada'].length);

}

// Listen pra quando marca os botões de categoria
$(".btn-categoria").change((e) => {
    if ($(e.currentTarget).is(":checked")) {
        montaTabela(e.currentTarget.value);
    } else {
        removeLinhaTabela(e.currentTarget.value);
    }
})

// Função que remove a linha da tabela
function removeLinhaTabela(categoria) {
    $("tr[categoria|='" + categoria + "'").remove();
    atualizaQtd();
}

// Função que cria a tabela de cartas
function montaTabela(categoria) {

    let cartasBrancas = "",
        cartasPretas = "";

    $.each(dbCartas[categoria], function(key, val) {
        if (val.tipo == "b") {
            cartasBrancas = cartasBrancas + novaLinhaTabela(val, categoria)
        } else {
            cartasPretas = cartasPretas + novaLinhaTabela(val, categoria)
        }
    });
    $("#corpo-tabela-brancas").append(cartasBrancas);
    $("#corpo-tabela-pretas").append(cartasPretas);
    atualizaQtd();
}

// Função que formata uma nova linha da tabela
function novaLinhaTabela(dados, categoria, marcado, tipo) {
    return `<tr class="${marcado?"marcado":""}" tipo="${dados.tipo}" texto="${dados.texto}" ${dados.id?"id=" + dados.id:""} categoria="${categoria?categoria:""}">
                <td class="carta-texto">${dados.texto}</td>
                <td>${categoria?categoria:""}</td>
                <td>${marcado?`<span class="btn-remover">remover</span>`:""}</td>
            </tr>
            `
}

// Listen para quando o usuário seleciona uma carta na tabela
$('tbody').on('click', 'tr', function(e) {
    let dados = $(e.currentTarget);
    marca(dados);
})

// Função que atualiza o estilo da linha da tabela quando (des)selecionada
function marca(e){
    e.toggleClass( "marcado" );
    atualizaQtd();
}

function atualizaQtd(){
    $(".qtd-brancas > .qtd-selec").text($("#corpo-tabela-brancas > .marcado").length)
    $(".qtd-brancas > .qtd-total").text($("#corpo-tabela-brancas > tr").length)
    $(".qtd-pretas > .qtd-selec").text($("#corpo-tabela-pretas > .marcado").length)
    $(".qtd-pretas > .qtd-total").text($("#corpo-tabela-pretas > tr").length)
}

// Função que formata o texto inserido das cartas pretas e adiciona à tabela p/ impressão
function adicionaPretaPersonalizada(){
    let campo = $("#texto-personalizacao-pretas");
    let textos = campo.val().split("\n");

    textosCorrigidos = textos.map((texto)=>{
        return texto.replace(!/[()\w+]/g, "");
        //let textoLimpo = texto.replace(!/[()\w+]/g, "");
        //return textoLimpo.replace(/(?<!_)_(?!_)/g, "__________");
    })
    
    adicionaCartaNaTabela(textosCorrigidos, "p")
    campo.val("");
}

// Função que formata o texto inserido das cartas brancas e adiciona à tabela p/ impressão
function adicionaBrancaPersonalizada(){
    let campo = $("#texto-personalizacao-brancas");
    let textos = campo.val().split("\n");

    textosCorrigidos = textos.map((texto)=>{
        return texto.replace(!/[()\w+]/g, "");
    })

    adicionaCartaNaTabela(textosCorrigidos, "b")
    campo.val("");
}

// Função que adiciona as cartas personalizadas na tabela p/ impressão
function adicionaCartaNaTabela(textos, tipo){
    let items = "";
    for(key in textos){
        info = {texto: textos[key], tipo: tipo}
        items = items + novaLinhaTabela(info, "Minha carta", 1);
    }
    if (tipo == "b"){
        $( "#corpo-tabela-brancas" ).append(items);
    } else {
        $( "#corpo-tabela-pretas" ).append(items);
    }
    atualizaQtd()
}

//Listen para quando o usuário remove a linha/carta da tabela
$('tbody').on('click', '.btn-remover', function(e) {
    $(e.currentTarget).parents("tr").remove();;
})

// Função de selecionar todas as cartas na tabela
function selecionaTodas(tipo){
    $.each($("#corpo-tabela-"+ tipo).children("tr").not(".marcado"),(i, v)=>{
        marca($(v));
    })
}

// Função de desselecionar todas as cartas na tabela
function desselecionaTodas(tipo){
    $.each($("#corpo-tabela-"+ tipo).children("tr.marcado"),(i, v)=>{
        marca($(v));
    })
}

// Listen para o botão de troca da cor de fundo
$("#cor-fundo").change((e)=>{
    impressao.cor = $(e.currentTarget).val();
    trocaCorPreta();
})

//Listen para os radios de padrão das cartas
$('#tipo-fundo .form-check-input').on('change', () => {
   impressao.verso = $('input[name=tipo-fundo]:checked').val();
   $(".carta-exemplo.preta").toggleClass( "economico" );
   trocaCorPreta();
});

// Função que troca as cores da carta de exemplo
function trocaCorPreta(){
    if (impressao.verso == "padrao"){
        $(".fundo-preta-exemplo").css("background-color", impressao.cor || "#000");

    } else {
        $(".fundo-preta-exemplo").css("background-color", "#fff");
        $(".rodape-economico").css("background-color", impressao.cor || "#000");
        $(".fundo-economico").css("background-color", impressao.cor || "#000");
    }
}

//Listen para o texto personalizado
$("#texto-rodape").on("input", (e) => {
    impressao.textoPers = $(e.currentTarget).val() || "Cartas Radioativas";
    $(".texto-cartas").text(impressao.textoPers);
})

// Função que monta as linhas de corte
function montaLinhasDeCorte(doc){
    doc.setDrawColor(0);
    doc.setLineWidth(0.1);
    
    for (key in coordImpressao.padrao.corte.x){
        let x = coordImpressao.padrao.corte.x;
        doc.line(x[key], 0, x[key], 5)
        doc.line(x[key], 292, x[key], 297)
    }
    for (key in coordImpressao.padrao.corte.y){
        let y = coordImpressao.padrao.corte.y;
        doc.line(0, y[key], 5, y[key])
        doc.line(205, y[key], 210, y[key])
    }
}

// Função que cria os fundos das cartas
function fundoCarta(doc){
    let x = coordImpressao.padrao[impressao.cont].fora[0];
    let y = coordImpressao.padrao[impressao.cont].fora[1];
    doc.roundedRect(x, y, 63.5, 88, 3, 3, "FD");
}

function atualizaImpCont(doc){
    if(impressao.cont == 9){
        impressao.cont = 1;
        doc.addPage();
        montaLinhasDeCorte(doc)
    } else {
        impressao.cont = ++impressao.cont
    }
}

// Função que monta a parte da frente das cartas
function montaFrentes(tipo, val, doc){
    let xTextoDentro = coordImpressao.padrao[impressao.cont].dentro[0][0];
    let yTextoDentro = coordImpressao.padrao[impressao.cont].dentro[0][1];
    let xRodapeDentro = coordImpressao.padrao[impressao.cont].dentro[2][0];
    let yRodapeDentro = coordImpressao.padrao[impressao.cont].dentro[2][1];
    let maxText = coordImpressao.padrao[impressao.cont].dentro[1][0]-xTextoDentro;
    let xfora = coordImpressao.padrao[impressao.cont].fora[0];

    doc.setDrawColor(255);

// let texto = [po,po]
// val = val.toString();
// console.log("1: " + val == texto);
// console.log("2: " + val === texto);

val = val.replace(/\\n /g, '\n').replace(/\\n/g, '\n').replace(/(?<!_)_(?!_)/g, '\n_________________\n');

    let textoCarta = doc.setFontSize(16).splitTextToSize(val, 53.5);
// console.log(val);
// textoCarta = val.split("\n");
// console.log(textoCarta);
    if (tipo != "branca" && impressao.verso == "padrao"){
        doc.setFillColor(impressao.cor || 0); //dentro
        doc.setTextColor(255);
        fundoCarta(doc)

        doc.text(textoCarta, xTextoDentro, yTextoDentro);

        //rodapé
        doc.setFontSize(10);
        doc.text($("#texto-rodape").val() || "Cartas Radioativas", xRodapeDentro + 8, yRodapeDentro-1)
        doc.addImage("imgs/biohazard-branco.png", "png", xRodapeDentro, yRodapeDentro-5, 5, 5);
    } else {
        doc.setFillColor(255);
        doc.setTextColor(0);
        fundoCarta(doc)

        doc.text(textoCarta, xTextoDentro, yTextoDentro);

        //rodapé

        if (tipo == "branca"){
            doc.addImage("imgs/biohazard-preto.png", "png", xRodapeDentro, yRodapeDentro-5, 5, 5);
        } else {
            doc.setFillColor(impressao.cor || 0);
            doc.rect(xfora, yRodapeDentro-7, 63.5, 9, "F");
            doc.setTextColor(255);
            doc.addImage("imgs/biohazard-branco.png", "png", xRodapeDentro, yRodapeDentro-5, 5, 5);
        }

        doc.setFontSize(10);
        doc.text($("#texto-rodape").val() || "Cartas Radioativas", xRodapeDentro + 7, yRodapeDentro-1.5)
    }
    
    atualizaImpCont(doc);
    
}

// Função que monta a parte de trás das cartas
function montaVerso(tipo, doc){
    let xDentro = coordImpressao.padrao[impressao.cont].dentro[0][0];
    let yDentro = coordImpressao.padrao[impressao.cont].dentro[0][1];
    let xFora = coordImpressao.padrao[impressao.cont].fora[0]

    let tamImagem = 15;
    
    let logoDentro = [xFora+31.75-(tamImagem/2), yDentro+5];

    doc.setDrawColor(255);

    if (tipo != "branca" && impressao.verso == "padrao"){
        doc.setFillColor(impressao.cor || 0);
        doc.setTextColor(255);
        fundoCarta(doc)
        doc.addImage("imgs/biohazard-branco.png", "png", logoDentro[0], logoDentro[1], tamImagem, tamImagem);
    } else {
        doc.setFillColor(255);
        fundoCarta(doc)

        if (tipo == "branca"){
            doc.setTextColor(0);
            doc.addImage("imgs/biohazard-preto.png", "png", logoDentro[0], logoDentro[1], tamImagem, tamImagem);
        } else {
            doc.setTextColor(255);
            doc.setFillColor(impressao.cor || 0);
            doc.rect(xFora, yDentro, 63.5, 35, "F");
            doc.addImage("imgs/biohazard-branco.png", "png", logoDentro[0], logoDentro[1], tamImagem, tamImagem);
        }        
    }

    doc.setFontSize(16);
    doc.text(impressao.textoPers, xFora+31.75, logoDentro[1]+tamImagem+10, null, null, "center");

    atualizaImpCont(doc);
}

// Função que monta o PDF
function montaPDF(){
    impressao.cont = 1;

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    montaLinhasDeCorte(doc);

    //Pega os textos das cartas nas tabelas
    impressao.brancas = $.map($("#corpo-tabela-brancas > tr.marcado"), (val,i)=>{
        return $(val).children("td.carta-texto").text()
    })
    impressao.pretas = $.map($("#corpo-tabela-pretas > tr.marcado"), (val,i)=>{
        return $(val).children("td.carta-texto").text()
    })
    
    var totalDeCartas = impressao.brancas.length + impressao.pretas.length;

    //Monta as frentes
    $.each(impressao.brancas, (i, val) => montaFrentes("branca", val, doc))
    $.each(impressao.pretas, (i, val) => montaFrentes("preta", val, doc))

    doc.addPage();
    montaLinhasDeCorte(doc);
    impressao.cont = 1;

    //Monta as costas
    $.each(impressao.brancas, () => montaVerso("branca", doc))
    $.each(impressao.pretas, () => montaVerso("preta", doc))

    doc.output('dataurlnewwindow');
}

// Função que salva as cartas do usuário
function salvaCartasBD(){

    let cartas = []

    $.each($("tr[categoria='Minha carta']"), (i,v) => {
        cartas.push({texto: $(v).attr("texto"), tipo: $(v).attr("tipo")});
    })

    $.post( "server/cartas.php", { "cartas": cartas })
        .done(function( data ) {
            console.log(data);
        })
        .fail(function(e) {
            console.log(e)
    });
}

// Função para gerar o PDF
function gerarPDF(){

    if ($("tr.marcado").length == 0) {
        Swal.fire({
            icon: 'error',
            title: 'Ops...',
            text: 'Você se esqueceu de selecionar as cartas para impressão!',
        })
        return;
    };

    if ($("tr[categoria='Minha carta']").length > 0){
        Swal.fire({
            title: 'Podemos salvar suas cartas?',
            html: 'Tudo que é ruim deve ser compartilhado.<br>Podemos salvar as suas cartas para a galera desfrutar/sofrer também?!<br><span class="fs-6 text-black-50"><em>As cartas serão avaliadas e caso aprovadas aparecerão na categoria de cartas "personalizadas"</em></span>',
            icon: 'question',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: `<i class="fa fa-thumbs-up"></i> Claro, pode salvar`,
            denyButtonText: `<i class="fa fa-thumbs-down"></i> Não, só gere meu PDF`,
            cancelButtonText: `Espera, ainda não estou pronto`,
            }).then((result) => {

            if (result.isConfirmed) {
                salvaCartasBD();
                montaPDF();
            } else if (result.isDenied) {
                montaPDF();
            } else if (result.isDismissed) {
                return;
            }
        })

    } else {
        montaPDF();
    }
}

// $("#instr-cartas").click((e)=>{
//     console.log("clicou!");
//     e.preventDefault();
//     $("#modal-instr-cartas").focus();
// })





// Regex = https://regex101.com/r/yV6qE5/1
// jsPDF = https://raw.githack.com/MrRio/jsPDF/master/docs/jsPDF.html
// SVGToPNG = https://svgtopng.com/pt/
// SweetAlert = https://sweetalert2.github.io/
// P/ trocar cor do png, basta abrir o arquivo em um editor de texto e trocar o fillcolor.