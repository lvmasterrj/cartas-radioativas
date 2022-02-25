var coordImpressao = {
    corteCartas: {
        x: [17, 105, 193, 281],
        y: [10, 73.5, 137, 200.5],
    },
    cores: [
        [255, 0, 0],
        [0, 255, 0],
        [0, 0, 255],
        [255, 255, 0],
        [255, 0, 255],
        [0, 255, 255],
        [0, 0, 0],
        [100, 100, 100],
    ],
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
        //   doc.line(205, y[key], 210, y[key]);
        doc.line(292, y[key], 297, y[key]);
    }


}

function desenhaCartasRespostas(doc) {
    desenhaLinhasDeCorteCartas(doc);

    let carta = [0, 0];

    for (let i = 0; i < coordImpressao.qtdCartas; i++) {
        let x = coordImpressao.corteCartas.x[carta[0]];
        let y = coordImpressao.corteCartas.y[carta[1]];

        doc.setFillColor(coordImpressao.cores[i]);

        doc.rect(x, y, coordImpressao.tamanhoCarta[0], coordImpressao.tamanhoCarta[1], "F");

        if (carta[1] < 2) {
            carta[1] = carta[1] + 1;
        } else {
            carta = [carta[0] + 1, 0];
        }
        console.log(carta);
    }
}

function criaPdf() {
    const doc = new jsPDF({
        orientation: "landscape"
    });


    desenhaCartasRespostas(doc);

    //  for (key in coordImpressao) {
    //      if (Object.hasOwnProperty.call(object, key)) {
    //          const element = object[key];

    //      }
    //  }

    //doc.output("dataurlnewwindow", "cartas-radioativas.pdf"); // Exibe o pdf mas não salva
    window.open(doc.output('bloburl', "sem-pensar.pdf"), '_blank'); // Funciona mas o nome do arquivo fica ruim
    //  doc.save("cartas-radioativas"); // Salva com o nome correto,mas não faz preview
    console.log("OK")
}