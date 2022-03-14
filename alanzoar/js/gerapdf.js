var coordImpressao = {
    corteCartas: {
        x: [17, 105, 193, 281],
        y: [10, 73.5, 137, 200.5],
    },
    cores: ["#2F3787", "#009DE0", "#289548", "#FFED00", "#CD5B1B", "#C20B19", "#C4007A", "#723888"],
    //  qtdCartas: 8,
    qtdJogadores: 8,
    tamanhoCarta: [63.5, 88],
    margemCarta: 5,
    tamanhoLogoVerso: [18, 18],
    fonteCarta: 16,
    fonteRodape: 11,
    tamanhoFonte: 6, //mm
    tamanhoFonteRodape: 2.2, //mm
    correcaoRodape: 1.5,
    sangria: 3,
    1: [17, 10],
    2: [17, 73.5],
    3: [17, 137],
    4: [105, 10],
    5: [105, 73.5],
    6: [105, 137],
    7: [193, 10],
    8: [193, 73.5],
    9: [193, 137],
};

var cartas = {

}

const { jsPDF } = window.jspdf;

// $(document).ready(() => {
//     criaPdf();
// });

function desenhaLinhasDeCorteCartas(doc) {
    doc.setDrawColor(0);
    doc.setLineWidth(0.1);

    for (key in coordImpressao.corteCartas.x) {
        let x = coordImpressao.corteCartas.x;
        doc.line(x[key], 0, x[key], 5);
        doc.line(x[key], 205, x[key], 210);
    }
    for (key in coordImpressao.corteCartas.y) {
        let y = coordImpressao.corteCartas.y;
        doc.line(0, y[key], 5, y[key]);
        doc.line(292, y[key], 297, y[key]);
    }
}

// function desenhaLinhasDeCorteQuadro(doc) {
//     doc.setDrawColor(0);
//     doc.setLineWidth(0.1);

//     for (key in coordImpressao.corteCartas.x) {
//         let x = coordImpressao.corteCartas.y;
//         doc.line(x[key], 0, x[key], 5);
//         doc.line(x[key], 292, x[key], 297);
//     }
//     for (key in coordImpressao.corteCartas.y) {
//         let y = coordImpressao.corteCartas.x;
//         doc.line(0, y[key], 5, y[key]);
//         doc.line(205, y[key], 210, y[key]);
//     }
// }

function desenhaCartasRespostas(doc) {
    desenhaLinhasDeCorteCartas(doc);

    let carta = [0, 0],
        tamCarta = [coordImpressao.tamanhoCarta[1], coordImpressao.tamanhoCarta[0]];

    for (let i = 0; i < coordImpressao.qtdJogadores; i++) {
        let x = coordImpressao.corteCartas.x[carta[0]];
        let y = coordImpressao.corteCartas.y[carta[1]];

        doc.setFillColor(coordImpressao.cores[i]);
        doc.rect(x, y, tamCarta[0], tamCarta[1], "F");
        doc.setFillColor("#ffffff");
        doc.roundedRect(x + 5, y + 5, tamCarta[0] - 10, tamCarta[1] - 10, 5, 5, "F")

        if (carta[0] < 2) carta[0] = carta[0] + 1;
        else carta = [0, carta[1] + 1];
    }
}

function desenhaQuadroPontos(doc) {
    desenhaLinhasDeCorteCartas(doc);

    let margemCarta = 5, //mm
        margemInterna = 1, //mm
        tamanho = [12.2, 13], //mm
        rodadas = 12,
        jogadores = 8,
        inicio = [coordImpressao.corteCartas.x[0] + margemCarta, coordImpressao.corteCartas.y[0] + margemCarta],
        tamanhoCarta = coordImpressao.tamanhoCarta,
        qtdCartas = [2, 2];

    //Cria as linhas de fundo
    for (let i = 0; i < jogadores; i++) {
        let tamanhoLinha = [
            tamanhoCarta[1] * qtdCartas[0] - qtdCartas[0] * margemCarta,
            tamanho[1]
        ]

        doc.setFillColor(coordImpressao.cores[i]);
        doc.roundedRect(inicio[0], inicio[1] + (i * tamanho[1]) + tamanho[1], tamanhoLinha[0], tamanhoLinha[1], 2, 2, "F")
    }

    //Cria os espaços para escrever os pontos de cada rodada
    let cont = [0, 0];
    for (let i = 0; i < (rodadas * jogadores); i++) {
        let x = inicio[0] + margemInterna + cont[0] * tamanho[0];
        let y = inicio[1] + margemInterna + cont[1] * tamanho[1] + tamanho[1];
        let tamX = tamanho[0];
        let tamY = tamanho[1] - 2 * margemInterna;

        doc.setFillColor("ffffff");
        doc.roundedRect(x, y, tamX, tamY, 1, 1, "F")

        if (cont[0] < rodadas - 1) cont[0] = cont[0] + 1;
        else cont = [0, cont[1] + 1];
    }

    // Cria os espaços para escrever os totais
    for (let i = 0; i < jogadores; i++) {
        let x = inicio[0] + 2 * margemInterna + rodadas * tamanho[0];
        let y = inicio[1] + margemInterna + i * tamanho[1] + tamanho[1];
        let tamX = tamanho[0] + 4;
        let tamY = tamanho[1] - 2 * margemInterna;

        doc.setFillColor("ffffff");
        doc.roundedRect(x, y, tamX, tamY, 1, 1, "F")
    }

    // Coloca o logo
    doc.addImage("imgs/logo.png", "PNG", inicio[0] + 3, inicio[1] - 3, 30, 8.1)

    // Cria os textos
    let y = inicio[1] + tamanho[1] - 1;
    doc.setTextColor("#4D4E53");

    doc.setFont("helvetica", "bold")
    doc.text(" - QUADRO DE PONTOS", inicio[0] + 33, inicio[1] + 3);

    doc.setFont("helvetica", "normal")
    doc.setTextColor("#555555");
    doc.setFontSize(12);

    for (let i = 0; i < rodadas; i++) {
        let x = inicio[0] + margemInterna + i * tamanho[0] + tamanho[0] / 2;

        doc.text(`${i + 1}`, x, y, null, null, "center");
    }
    doc.text("Total", inicio[0] + margemInterna + rodadas * tamanho[0] + (tamanho[0] + 4) / 2, y, null, null, "center");

}

// Cria o quadro de seleção
function desenhaQuadroSelecao(doc) {
    let raio = 7.7,
        margem = [6.3, 30],
        espaco = 5,
        contCor = 0,
        contMoeda = [0, 0],
        jogadores = 8;

    for (let i = 0; i < jogadores; i++) {
        let x = coordImpressao.corteCartas.x[2] + margem[0] + raio + contMoeda[0] * (raio * 2 + espaco);
        let y = coordImpressao.corteCartas.y[0] + margem[1] + contMoeda[1] * (raio * 2 + espaco);

        doc.setFillColor(coordImpressao.cores[contCor])
        doc.circle(x, y, raio, "F");
        doc.setFillColor("ffffff");
        doc.circle(x, y, raio - 2, "F");

        contCor = contCor + 1;

        if (contMoeda[0] < jogadores / 2 - 1) contMoeda[0] = contMoeda[0] + 1;
        else contMoeda = [0, contMoeda[1] + 1];

    }

    // Coloca o logo
    doc.addImage("imgs/logo.png", "PNG", coordImpressao.corteCartas.x[2] + margem[0], coordImpressao.corteCartas.y[0] + 2, 30, 8.1)

    // Cria os textos
    doc.setTextColor("#4D4E53");

    doc.setFont("helvetica", "bold")
    doc.setFontSize(13);
    doc.text(" - QUEM GANHOU?", coordImpressao.corteCartas.x[2] + margem[0] + 31, coordImpressao.corteCartas.y[0] + 8);
}

//Cria as moedas
function desenhaAsMoedas(doc) {
    let raio = 11,
        margem = 10,
        contCor = 0,
        contMoeda = [0, 0],
        jogadores = 8;

    for (let i = 0; i < jogadores * 2; i++) {
        let x = coordImpressao.corteCartas.x[0] + margem + raio + contMoeda[0] * (raio * 2 + margem);
        let y = coordImpressao.corteCartas.y[2] + 7 + raio + contMoeda[1] * (raio * 2 + margem);
        doc.setFillColor(coordImpressao.cores[contCor])
        doc.circle(x, y, raio, "F");
        doc.setDrawColor("ffffff");
        doc.circle(x, y, raio / 1.5, "S");

        if (i % 2 != 0) contCor = contCor + 1;

        if (contMoeda[0] < jogadores - 1) contMoeda[0] = contMoeda[0] + 1;
        else contMoeda = [0, contMoeda[1] + 1];
    }
}

function montaFrenteCardsPerguntas(doc) {
    let carta = [0, 0],
        tamCarta = [coordImpressao.tamanhoCarta[1], coordImpressao.tamanhoCarta[0]],
        pergunta = 0,
        contCarta = 1,
        resto = impressao.imprimir.length % 5;


    for (let i = 0; i < coordImpressao.qtdCartas.total; i++) {
        let x = coordImpressao.corteCartas.x[carta[0]];
        let y = coordImpressao.corteCartas.y[carta[1]];
        let margem = 2;

        //Monta a borda da carta
        doc.setFillColor("#323639");
        doc.rect(x, y, tamCarta[0], tamCarta[1], "F");
        doc.setFillColor("#ffffff");
        doc.roundedRect(x + margem, y + margem, tamCarta[0] - 4, tamCarta[1] - 4, 3, 3, "F")

        console.log("Cont = " + contCarta + " | qtdCartasTotal = " + coordImpressao.qtdCartas.total);
        console.log("Resto = " + resto);

        if (contCarta != coordImpressao.qtdCartas.total || resto == 0) {
            for (let j = 0; j < 5; j++) {
                criaTexto(doc, x, y, margem, j, contCarta);
            }
        } else {
            for (let j = 0; j < resto; j++) {
                criaTexto(doc, x, y, margem, j, contCarta);
            }
        }

        //   Monta os textos
        //  for (let i = 0; i < 5; i++) {
        //      doc.setFillColor("#323639");

        //      doc.triangle(
        //              x + margem + 2, y + margem + 3.95 + (i * 11.9),
        //              x + margem + 2, y + margem + 3.95 + (i * 11.9) + 4,
        //              x + margem + 2 + 3.46, y + margem + 3.95 + (i * 1.9) + 2,
        //              "F"
        //          )
        //          // doc.rect(x, y, tamCarta[0], tamCarta[1], "F");

        //  }

        if (carta[0] < 2) carta[0] = carta[0] + 1;
        else carta = [0, carta[1] + 1];
        contCarta = contCarta + 1;
    }
}

function criaTexto(doc, x, y, margem, j, contCarta) {
    doc.setFillColor("#323639");
    let pontosTriangulo = {
        x: [
            x + margem + 2,
            x + margem + 2,
            x + margem + 2 + 3.46,
        ],
        y: [
            y + margem + 3.95 + (j * 11.9),
            y + margem + 3.95 + (j * 11.9) + 4,
            y + margem + 3.95 + (j * 11.9) + 2,
        ]
    }

    doc.triangle(
        pontosTriangulo.x[0], pontosTriangulo.y[0],
        pontosTriangulo.x[1], pontosTriangulo.y[1],
        pontosTriangulo.x[2], pontosTriangulo.y[2],
        "F"
    )


    let texto = impressao.imprimir[(contCarta - 1) * 5 + j];
    let tamanhoMaxTexto = coordImpressao.tamanhoCarta[0] - pontosTriangulo.x[2] - margem - 2;
    doc.setFontSize(11).splitTextToSize(texto, tamanhoMaxTexto);

    doc.text(texto, pontosTriangulo.x[2] + 2, pontosTriangulo.y[1])
}

function criaPdf() {
    const doc = new jsPDF({
        orientation: "landscape"
    });


    //Pega as cartas selecionadas para impressao
    impressao.imprimir = [];
    $.map($("#corpo-tabela-brancas > tr.marcado"), (val, i) => {
        impressao.imprimir.push($(val).children("td.carta-texto").text())
    });

    //CRIA os blocos de impressão
    //  let cont = 0,
    //      bloco = 1;
    //  for (let i = 0; i < impressao.imprimir.length; i++) {
    //      impressao.blocos[bloco] = [].push(impressao.imprimir[i]);

    //      if (cont < 5) {
    //          cont = cont + 1;
    //      } else {
    //          bloco = bloco + 1;
    //          cont = 0;
    //      }
    //  }

    // console.log(impressao.blocos);

    //Pega o número de páginas (Cabem 5 perguntas em cada carta e 9 cartas em cada página)
    //  impressao.paginas = {
    //      total: Math.ceil(impressao.imprimir.length / 5 / 9),
    //      atual: 1
    //  };

    //Pega o número de cartas (5 perguntas em cada carta)
    //console.log("Impresssão.imprimir.length = " + impressao.imprimir.length);
    coordImpressao.qtdCartas = {
        total: Math.ceil(impressao.imprimir.length / 5),
        atual: 1
    };



    desenhaLinhasDeCorteCartas(doc);

    //Monta as cartas de perguntas
    montaFrenteCardsPerguntas(doc);

    //doc.addPage();

    //desenhaFundoCardsPerguntas(doc);

    doc.addPage();

    desenhaCartasRespostas(doc);

    doc.addPage();

    desenhaQuadroPontos(doc);
    desenhaQuadroSelecao(doc);
    desenhaAsMoedas(doc);

    //doc.output("dataurlnewwindow", "cartas-radioativas.pdf"); // Exibe o pdf mas não salva
    window.open(doc.output('bloburl', "sem-pensar.pdf"), '_blank'); // Funciona mas o nome do arquivo fica ruim
    //  doc.save("cartas-radioativas"); // Salva com o nome correto,mas não faz preview
    console.log("OK")
}