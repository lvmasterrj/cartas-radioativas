var coordImpressao = {
    corteCartas: {
        x: [17, 105, 193, 281],
        y: [10, 73.5, 137, 200.5],
    },
    cores: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#000000", "#555555"],
    qtdCartas: 8,
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

$(document).ready(() => {
    criaPdf();
});

function desenhaLinhasDeCorteCartas(doc) {
    doc.setDrawColor(0);
    doc.setLineWidth(0.1);

    for (key in coordImpressao.corteCartas.x) {
        let x = coordImpressao.corteCartas.x;
        doc.line(x[key], 0, x[key], 5);
    }
    for (key in coordImpressao.corteCartas.y) {
        let y = coordImpressao.corteCartas.y;
        doc.line(0, y[key], 5, y[key]);
        doc.line(292, y[key], 297, y[key]);
    }
}

function desenhaLinhasDeCorteQuadro(doc) {
    doc.setDrawColor(0);
    doc.setLineWidth(0.1);

    for (key in coordImpressao.corteCartas.x) {
        let x = coordImpressao.corteCartas.y;
        doc.line(x[key], 0, x[key], 5);
        doc.line(x[key], 292, x[key], 297);
    }
    for (key in coordImpressao.corteCartas.y) {
        let y = coordImpressao.corteCartas.x;
        doc.line(0, y[key], 5, y[key]);
        doc.line(205, y[key], 210, y[key]);
    }
}

function desenhaCartasRespostas(doc) {
    desenhaLinhasDeCorteCartas(doc);

    let carta = [0, 0],
        tamCarta = [coordImpressao.tamanhoCarta[1], coordImpressao.tamanhoCarta[0]];

    for (let i = 0; i < coordImpressao.qtdCartas; i++) {
        let x = coordImpressao.corteCartas.x[carta[0]];
        let y = coordImpressao.corteCartas.y[carta[1]];

        doc.setFillColor(coordImpressao.cores[i]);
        doc.rect(x, y, tamCarta[0], tamCarta[1], "F");
        doc.setFillColor("#ffffff");
        doc.roundedRect(x + 5, y + 5, tamCarta[0] - 10, tamCarta[1] - 10, 5, 5, "F")

        if (carta[1] < 2) carta[1] = carta[1] + 1;
        else carta = [carta[0] + 1, 0];
    }
}

function desenhaQuadroPontos(doc) {
    desenhaLinhasDeCorteCartas(doc);

    let margemCarta = 5, //mm
        margemInterna = 1, //mm
        tamanho = [12.5, 13], //mm
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
        let y = inicio[1] + margemInterna + cont[1] * tamanho[1];

        doc.setFillColor("ffffff");
        doc.roundedRect(x, y, tamanho[0] - margemInterna, tamanho[1] - 2 * margemInterna, 1, 1, "F")

        if (cont[1] < rodadas - 1) cont[1] = cont[1] + 1;
        else cont = [cont[0] + 1, 0];
    }
}

function criaPdf() {
    const doc = new jsPDF({
        orientation: "landscape"
    });


    desenhaCartasRespostas(doc);

    doc.addPage();

    desenhaQuadroPontos(doc);

    //doc.output("dataurlnewwindow", "cartas-radioativas.pdf"); // Exibe o pdf mas não salva
    window.open(doc.output('bloburl', "sem-pensar.pdf"), '_blank'); // Funciona mas o nome do arquivo fica ruim
    //  doc.save("cartas-radioativas"); // Salva com o nome correto,mas não faz preview
    console.log("OK")
}