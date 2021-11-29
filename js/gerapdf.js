var coordImpressao = {
    padrao: {
        corte: {
            x: [10, 73.5, 137, 200.5],
            y: [17, 105, 193, 281],
        },
        1: {
            fora: [10, 17],
            dentro: [
                [15, 27],
                [68.5, 22],
                [15, 100],
                [68.5, 100],
            ],
        },
        2: {
            fora: [73.5, 17],
            dentro: [
                [78.5, 27],
                [132, 22],
                [78.5, 100],
                [132, 100],
            ],
        },
        3: {
            fora: [137, 17],
            dentro: [
                [142, 27],
                [195.5, 22],
                [142, 100],
                [195.5, 100],
            ],
        },
        4: {
            fora: [10, 105],
            dentro: [
                [15, 115],
                [68.5, 110],
                [15, 188],
                [68.5, 188],
            ],
        },
        5: {
            fora: [73.5, 105],
            dentro: [
                [78.5, 115],
                [132, 110],
                [78.5, 188],
                [132, 188],
            ],
        },
        6: {
            fora: [137, 105],
            dentro: [
                [142, 115],
                [195.5, 110],
                [142, 188],
                [195.5, 188],
            ],
        },
        7: {
            fora: [10, 193],
            dentro: [
                [15, 203],
                [68.5, 198],
                [15, 276],
                [68.5, 276],
            ],
        },
        8: {
            fora: [73.5, 193],
            dentro: [
                [78.5, 203],
                [132, 198],
                [78.5, 276],
                [132, 276],
            ],
        },
        9: {
            fora: [137, 193],
            dentro: [
                [142, 203],
                [195.5, 198],
                [142, 276],
                [195.5, 276],
            ],
        },
    },
};

// Função que monta as linhas de corte
function montaLinhasDeCorte(doc) {
    doc.setDrawColor(0);
    doc.setLineWidth(0.1);

    for (key in coordImpressao.padrao.corte.x) {
        let x = coordImpressao.padrao.corte.x;
        doc.line(x[key], 0, x[key], 5);
        doc.line(x[key], 292, x[key], 297);
    }
    for (key in coordImpressao.padrao.corte.y) {
        let y = coordImpressao.padrao.corte.y;
        doc.line(0, y[key], 5, y[key]);
        doc.line(205, y[key], 210, y[key]);
    }
}

// Função que desenha o fundo das cartas
function fundoCarta(doc) {
    let x = coordImpressao.padrao[impressao.cont].fora[0];
    let y = coordImpressao.padrao[impressao.cont].fora[1];
    doc.roundedRect(x, y, 63.5, 88, 3, 3);
}

//Função que atualiza a quantidade de impressão para pular a página
function atualizaImpCont(doc) {
    if (impressao.cont == 9) {
        if (impressao.paginas.atual != impressao.paginas.total) {
            impressao.cont = 1;
            doc.addPage();
            montaLinhasDeCorte(doc);
            impressao.paginas.atual = ++impressao.paginas.atual;
        }
    } else {
        impressao.cont = ++impressao.cont;
    }
}

// Função que monta a parte da frente das cartas
function montaFrentes(tipo, val, doc) {
    let xTextoDentro = coordImpressao.padrao[impressao.cont].dentro[0][0];
    let yTextoDentro = coordImpressao.padrao[impressao.cont].dentro[0][1];
    let xRodapeDentro = coordImpressao.padrao[impressao.cont].dentro[2][0];
    let yRodapeDentro = coordImpressao.padrao[impressao.cont].dentro[2][1];
    //let maxText = coordImpressao.padrao[impressao.cont].dentro[1][0] - xTextoDentro;
    let xfora = coordImpressao.padrao[impressao.cont].fora[0];
    let yfora = coordImpressao.padrao[impressao.cont].fora[1];

    let tamImagemWidth = 6;
    let tamImagemHeight = 5.33;

    doc.setDrawColor(255);

    val = val
        .replace(/\\n /g, "\n")
        .replace(/\\n/g, "\n")
        .replace(/(?<!_)_(?!_)/g, "\n_________________\n");


    let textoRodape = $("#texto-rodape").val() || "Cartas Radioativas";

    let tamRodape = doc.getStringUnitWidth(textoRodape) * 11 / (72 / 25.6);
    let maxRodape = 45;
    let textoRodapeX = xRodapeDentro + 8;

    //Cálculo da quantidade de linhas do rodapé para ajustar a altura
    let rodapeLinhas = Math.ceil(Math.floor(tamRodape) / maxRodape);

    //A linha do rodapé tem 3mm;
    let textoRodapeY = yRodapeDentro - ((rodapeLinhas - 1) * 2) - 1;

    let textoCarta = doc.setFontSize(16).splitTextToSize(val, 53.5);

    if (tipo != "branca" && impressao.verso == "padrao") {
        doc.setFillColor(impressao.cor || 0); //dentro
        doc.setTextColor(255);
        doc.rect(xfora - 2, yfora - 2, 67.5, 92, "F");
        //fundoCarta(doc);

        doc.text(textoCarta, xTextoDentro, yTextoDentro);

        //rodapé
        textoRodape = doc.setFontSize(11).splitTextToSize(textoRodape, maxRodape);
        doc.text(
            textoRodape,
            textoRodapeX,
            textoRodapeY
        );
        doc.addImage(
            "imgs/biohazard-branco.png",
            "png",
            xRodapeDentro,
            yRodapeDentro - 5,
            tamImagemWidth,
            tamImagemHeight
        );
    } else {
        doc.setFillColor(255);
        doc.setTextColor(0);
        fundoCarta(doc);

        doc.text(textoCarta, xTextoDentro, yTextoDentro);

        //rodapé

        if (tipo == "branca") {
            doc.addImage(
                "imgs/biohazard-preto.png",
                "png",
                xRodapeDentro,
                yRodapeDentro - 5,
                tamImagemWidth,
                tamImagemHeight
            );
        } else {
            doc.setFillColor(impressao.cor || 0);
            doc.rect(xfora - 5, yRodapeDentro - 7, 73.5, 9, "F");
            doc.setTextColor(255);
            doc.addImage(
                "imgs/biohazard-branco.png",
                "png",
                xRodapeDentro,
                yRodapeDentro - 5,
                tamImagemWidth,
                tamImagemHeight
            );
        }

        textoRodape = doc.setFontSize(11).splitTextToSize(textoRodape, maxRodape);
        doc.text(
            textoRodape,
            textoRodapeX,
            textoRodapeY
        );
    }

    atualizaImpCont(doc);
}

function montaVersos(doc) {

    let tamImagemWidth = 18;
    let tamImagemHeight = 16;

    let maxLogoText = 53.5;
    let logoTexto = impressao.textoPers;

    // Brancas
    if (impressao.brancas.length > 0) {
        doc.addPage();
        montaLinhasDeCorte(doc);

        doc.setTextColor(0);

        for (let i = 1; i < 10; i++) {

            // doc.setDrawColor(0); ///////////////////////////////
            // fundoCarta(doc); /////////////////////////////////
            // atualizaImpCont(doc); ////////////////////// REMOVER

            let xFora = coordImpressao.padrao[i].fora[0];
            let yDentro = coordImpressao.padrao[i].dentro[0][1];
            let logoDentro = [xFora + 31.75 - tamImagemWidth / 2, yDentro + 5];

            logoTexto = doc.setFontSize(16).splitTextToSize(logoTexto, maxLogoText);

            doc.addImage(
                "imgs/biohazard-preto.png",
                "png",
                logoDentro[0],
                logoDentro[1],
                tamImagemWidth,
                tamImagemHeight
            );

            doc.text(
                logoTexto,
                xFora + 31.75,
                logoDentro[1] + tamImagemWidth + 10,
                null,
                null,
                "center"
            );
        }
    }

    // Pretas
    if (impressao.pretas.length > 0) {
        doc.addPage();
        montaLinhasDeCorte(doc);

        doc.setFillColor(impressao.cor || 0);
        doc.setTextColor(255);

        let x = coordImpressao.padrao.corte.x;
        let y = coordImpressao.padrao.corte.y;

        if (impressao.verso == "padrao") {
            doc.rect(5, 5, 200, 287, "F");

        } else {
            for (let i = 0; i < 3; i++) {
                doc.rect(5, y[i] + 10, 200, 35, "F");
            }
        }

        for (let i = 1; i < 10; i++) {

            // doc.setDrawColor(0); ///////////////////////////////
            // fundoCarta(doc); /////////////////////////////////
            // atualizaImpCont(doc); ////////////////////// REMOVER
            let xFora = coordImpressao.padrao[i].fora[0];
            let yDentro = coordImpressao.padrao[i].dentro[0][1];
            let logoDentro = [xFora + 31.75 - tamImagemWidth / 2, yDentro + 5];

            doc.setTextColor(255);
            doc.addImage(
                "imgs/biohazard-branco.png",
                "png",
                logoDentro[0],
                logoDentro[1],
                tamImagemWidth,
                tamImagemHeight
            );

            logoTexto = doc.setFontSize(16).splitTextToSize(logoTexto, maxLogoText);
            doc.text(
                logoTexto,
                xFora + 31.75,
                logoDentro[1] + tamImagemWidth + 10,
                null,
                null,
                "center"
            );
        }
    }
}

// Função que monta o PDF
function montaPDF() {

    impressao.cont = 1;

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    montaLinhasDeCorte(doc);

    //Pega os textos das cartas nas tabelas
    impressao.brancas = $.map(
        $("#corpo-tabela-brancas > tr.marcado"),
        (val, i) => {
            return $(val).children("td.carta-texto").text();
        }
    );
    impressao.pretas = $.map($("#corpo-tabela-pretas > tr.marcado"), (val, i) => {
        return $(val).children("td.carta-texto").text();
    });

    //Pega o número de páginas
    impressao.paginas = {
        total: Math.ceil(impressao.brancas.length / 9) + Math.ceil(impressao.pretas.length / 9),
        atual: 1
    };

    //Monta as frentes brancas
    if (impressao.brancas.length > 0)
        $.each(impressao.brancas, (i, val) => montaFrentes("branca", val, doc));

    if (impressao.pretas.length > 0) {
        if (impressao.brancas.length % 9 != 0) {
            console.log(impressao.brancas.length)
            doc.addPage();
            montaLinhasDeCorte(doc);
        }

        impressao.cont = 1;

        //Monta as frentes pretas
        $.each(impressao.pretas, (i, val) => montaFrentes("preta", val, doc));
    }

    //Monta os versos
    montaVersos(doc);

    doc.output("dataurlnewwindow");
}