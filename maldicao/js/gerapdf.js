var coordImpressao = {
    corte: {
        x: [10, 73.5, 137, 200.5],
        y: [17, 105, 193, 281],
    },
    qtdCartas: 9,
    tamanhoCarta: [63.5, 88],
    sangria: 3,
    margem: [5, 10],
    margemRodape: [2, 83],
    tamanhoLogo: [5, 5],
    tamanhoLogoVerso: [18, 18],
    fonteCarta: 16,
    fonteRodape: 11,
    tamanhoFonte: 6,
    tamanhoFonteRodape: 2.2,
    correcaoRodape: 1.5,
    corPrimaria: "#2d0040",
    1: [10, 17],
    2: [73.5, 17],
    3: [137, 17],
    4: [10, 105],
    5: [73.5, 105],
    6: [137, 105],
    7: [10, 193],
    8: [73.5, 193],
    9: [137, 193],
};

const { jsPDF } = window.jspdf;

function montaLinhasDeCorte(doc) {
    doc.setDrawColor(0);
    doc.setLineWidth(0.1);

    for (let key in coordImpressao.corte.x) {
        let x = coordImpressao.corte.x;
        doc.line(x[key], 0, x[key], 5);
        doc.line(x[key], 292, x[key], 297);
    }
    for (let key in coordImpressao.corte.y) {
        let y = coordImpressao.corte.y;
        doc.line(0, y[key], 5, y[key]);
        doc.line(205, y[key], 210, y[key]);
    }
}

function montaCarta(texto, doc) {
    let x = coordImpressao[impressao.cont][0];
    let y = coordImpressao[impressao.cont][1];
    let w = coordImpressao.tamanhoCarta[0];
    let h = coordImpressao.tamanhoCarta[1];
    let mg = coordImpressao.margem;
    let sg = coordImpressao.sangria;
    let cor = coordImpressao.corPrimaria;

    let tamanhoFonteCarta = coordImpressao.fonteCarta;
    let tamanhoFonteRodape = coordImpressao.fonteRodape;
    let tamanhoFonteRodapeMM = coordImpressao.tamanhoFonteRodape;
    let correcaoRodape = coordImpressao.correcaoRodape;
    let margemRodape = coordImpressao.margemRodape;
    let tamanhoLogo = coordImpressao.tamanhoLogo;

    let textoRodape = impressao.textoPers || "Maldição";
    let tamanhoMaxTexto = w - (mg[0] * 2);

    let tamRodape = doc.getStringUnitWidth(textoRodape) * tamanhoFonteRodape / (72 / 25.6);
    let maxRodape = w - (2 * mg[0]) - tamanhoLogo[0] - margemRodape[0];
    let textoRodapeX = x + mg[0] + tamanhoLogo[0] + margemRodape[0];
    let rodapeLinhas = Math.ceil(Math.floor(tamRodape) / maxRodape);
    let textoRodapeY = y + margemRodape[1] - ((rodapeLinhas - 1) * tamanhoFonteRodapeMM) - correcaoRodape;

    // Fundo escuro (com sangria)
    doc.setFillColor(cor);
    doc.rect(x - sg, y - sg, w + (sg * 2), h + (sg * 2), "F");

    // Texto da carta
    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");

    let textoCarta = doc.setFontSize(tamanhoFonteCarta).splitTextToSize(texto, tamanhoMaxTexto);
    doc.text(textoCarta, x + mg[0], y + mg[1]);

    // Rodapé: ícone + texto
    doc.addImage(
        "../imgs/icones/radioativo-branco.png",
        "png",
        x + mg[0],
        y + margemRodape[1] - tamanhoLogo[1],
        tamanhoLogo[0],
        tamanhoLogo[1]
    );

    textoRodape = doc.setFontSize(tamanhoFonteRodape).splitTextToSize(textoRodape, maxRodape);
    doc.text(textoRodape, textoRodapeX, textoRodapeY);
}

function atualizaContPagina(doc) {
    if (impressao.cont == coordImpressao.qtdCartas) {
        if (impressao.paginas.atual < impressao.paginas.total) {
            impressao.cont = 1;
            doc.addPage();
            montaLinhasDeCorte(doc);
            impressao.paginas.atual++;
        }
    } else {
        impressao.cont++;
    }
}

function montaVersos(doc) {
    let qtd = coordImpressao.qtdCartas;
    let w = coordImpressao.tamanhoCarta[0];
    let h = coordImpressao.tamanhoCarta[1];
    let sg = coordImpressao.sangria;
    let cor = coordImpressao.corPrimaria;
    let mg = coordImpressao.margem;
    let tamanhoLogo = coordImpressao.tamanhoLogoVerso;
    let tamanhoTexto = coordImpressao.fonteCarta;
    let tamanhoFonte = coordImpressao.tamanhoFonte;
    let versoTexto = impressao.textoPers || "Maldição";
    let maxVersoText = w - mg[0] * 2;
    let correcao = 2;

    doc.addPage();

    for (let i = 1; i <= qtd; i++) {
        let cx = coordImpressao[i][0];
        let cy = coordImpressao[i][1];

        doc.setFillColor(cor);
        doc.rect(cx - sg, cy - sg, w + (sg * 2), h + (sg * 2), "F");

        let coordLogo = [
            cx - correcao + (w / 2) - tamanhoLogo[0] / 2,
            cy + mg[1] + (mg[1] / 2)
        ];

        doc.addImage(
            "../imgs/icones/radioativo-branco.png",
            "png",
            coordLogo[0],
            coordLogo[1],
            tamanhoLogo[0],
            tamanhoLogo[1]
        );

        doc.setTextColor(255);
        versoTexto = doc.setFontSize(tamanhoTexto).splitTextToSize(versoTexto, maxVersoText);
        doc.text(
            versoTexto,
            cx - correcao + (w / 2),
            coordLogo[1] + tamanhoLogo[1] + (mg[1] / 2) + (tamanhoFonte / 2),
            null, null, "center"
        );
    }
}

function montaPDF() {
    impressao.cont = 1;

    const doc = new jsPDF();

    montaLinhasDeCorte(doc);

    impressao.imprimir = $.map($("#corpo-tabela-brancas > tr.marcado"), (val) => {
        return $(val).attr("texto");
    });

    impressao.paginas = {
        total: Math.ceil(impressao.imprimir.length / coordImpressao.qtdCartas),
        atual: 1
    };

    $.each(impressao.imprimir, (i, texto) => {
        montaCarta(texto, doc);
        atualizaContPagina(doc);
    });

    montaVersos(doc);

    doc.setProperties({
        title: "Maldição",
        subject: "Jogo Maldição - Would You Rather",
        author: "lvmasterrj",
        creator: "cartasradioativas.epizy.com"
    });

    doc.save("maldicao.pdf");
}
