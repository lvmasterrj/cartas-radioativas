var coordImpressao = {
    padrao: {
        corte: {
            x: [10, 73.5, 137, 200.5],
            y: [17, 105, 193, 281],
        },
        qtdCartas: 9,
        tamanhoCarta: [63.5, 88],
        margemCarta: [5, 10],
        margemRodape: [2, 83],
        tamanhoLogo: [5, 5],
        tamanhoLogoVerso: [18, 18],
        fonteCarta: 16,
        fonteRodape: 11,
        tamanhoFonte: 6, //mm
        tamanhoFonteRodape: 2.2, //mm
        correcaoRodape: 1.5,
        sangria: 3,
        1: [10, 17],
        2: [73.5, 17],
        3: [137, 17],
        4: [10, 105],
        5: [73.5, 105],
        6: [137, 105],
        7: [10, 193],
        8: [73.5, 193],
        9: [137, 193],
    },
    menor: {
        corte: {
            x: [23, 64, 105, 146, 187],
            y: [23, 86, 149, 212, 275],
        },
        qtdCartas: 16,
        tamanhoCarta: [41, 63],
        margemCarta: [3, 5],
        margemRodape: [1, 58],
        tamanhoLogo: [4, 4],
        tamanhoLogoVerso: [9, 9],
        fonteCarta: 10,
        fonteRodape: 7.5,
        tamanhoFonte: 3, //mm
        tamanhoFonteRodape: 1.5, //mm
        correcaoRodape: 1.3,
        sangria: 2,
        1: [23, 23],
        2: [64, 23],
        3: [105, 23],
        4: [146, 23],
        5: [23, 86],
        6: [64, 86],
        7: [105, 86],
        8: [146, 86],
        9: [23, 149],
        10: [64, 149],
        11: [105, 149],
        12: [146, 149],
        13: [23, 212],
        14: [64, 212],
        15: [105, 212],
        16: [146, 212],
    },
};

function emMM(tam, fontSize) {
    return (tam * fontSize / (72 / 25.6));
}
// Função que monta as linhas de corte
function montaLinhasDeCorte(doc, cor = "b") {
    doc.setLineWidth(0.1);
    console.log(cor);
    if (cor == "p") {
        doc.setDrawColor(255);
    } else {
        doc.setDrawColor(0);
    }

    // Linhas verticais
    for (keyx in coordImpressao[impressao.tamanho].corte.x) {
        let x = coordImpressao[impressao.tamanho].corte.x;
        for (keyy in coordImpressao[impressao.tamanho].corte.y) {
            let y = coordImpressao[impressao.tamanho].corte.y;
            doc.line(x[keyx], y[keyy] - 1, x[keyx], y[keyy] + 1);
            //doc.line(x[keyx], 292, x[keyx], 297);
        }
    }

    // Linhas horizontais
    for (keyy in coordImpressao[impressao.tamanho].corte.y) {
        let y = coordImpressao[impressao.tamanho].corte.y;
        for (keyx in coordImpressao[impressao.tamanho].corte.x) {
            let x = coordImpressao[impressao.tamanho].corte.x;
            doc.line(x[keyx] - 1, y[keyy], x[keyx] + 1, y[keyy]);
            //doc.line(205, y[keyy], 210, y[keyy]);
        }
    }

    doc.setDrawColor(0);

    // Linhas de borda
    for (key in coordImpressao[impressao.tamanho].corte.x) {
        let x = coordImpressao[impressao.tamanho].corte.x;
        doc.line(x[key], 0, x[key], 5);
        doc.line(x[key], 292, x[key], 297);
    }
    for (key in coordImpressao[impressao.tamanho].corte.y) {
        let y = coordImpressao[impressao.tamanho].corte.y;
        doc.line(0, y[key], 5, y[key]);
        doc.line(205, y[key], 210, y[key]);
    }
}

// Função que desenha o fundo das cartas
function fundoCarta(doc) {
    let x = coordImpressao[impressao.tamanho][impressao.cont][0];
    let y = coordImpressao[impressao.tamanho][impressao.cont][1];
    doc.roundedRect(x, y, 63.5, 88, 3, 3);
}

//Função que atualiza a quantidade de impressão para pular a página
function atualizaImpCont(doc) {
    if (impressao.cont == coordImpressao[impressao.tamanho].qtdCartas) {
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

    let xfora = coordImpressao[impressao.tamanho][impressao.cont][0];
    let yfora = coordImpressao[impressao.tamanho][impressao.cont][1];
    let tamanhoCarta = coordImpressao[impressao.tamanho].tamanhoCarta;
    let margemCarta = coordImpressao[impressao.tamanho].margemCarta;
    let margemRodape = coordImpressao[impressao.tamanho].margemRodape;

    let tamanhoLogo = coordImpressao[impressao.tamanho].tamanhoLogo;

    let tamanhoFonteCarta = coordImpressao[impressao.tamanho].fonteCarta;
    let tamanhoFonteRodape = coordImpressao[impressao.tamanho].fonteRodape;
    let tamanhoFonteRodapeMM = coordImpressao[impressao.tamanho].tamanhoFonteRodape;
    let correcaoRodape = coordImpressao[impressao.tamanho].correcaoRodape;

    let tamanhoMaxTexto = tamanhoCarta[0] - (margemCarta[0] * 2);

    let sangria = coordImpressao[impressao.tamanho].sangria;

    doc.setDrawColor(255);

    let icone = impressao.categorias[val["categoria"]] || "radioativo";

    let textoRodape = $("#texto-rodape").val() || "Cartas Radioativas";

    let tamRodape = doc.getStringUnitWidth(textoRodape) * tamanhoFonteRodape / (72 / 25.6);
    let maxRodape = tamanhoCarta[0] - (2 * margemCarta[0]) - tamanhoLogo[0] - margemRodape[0];
    let textoRodapeX = xfora + margemCarta[0] + tamanhoLogo[0] + margemRodape[0]; //xRodapeDentro + 8;

    //Cálculo da quantidade de linhas do rodapé para ajustar a altura
    let rodapeLinhas = Math.ceil(Math.floor(tamRodape) / maxRodape);

    //Ajusta o y do rodapé no caso de multiplas linhas
    let textoRodapeY = yfora + margemRodape[1] - ((rodapeLinhas - 1) * tamanhoFonteRodapeMM) - correcaoRodape;

    textoCarta = val["texto"].replace(/<</g, "\\n<<").replace(/>>/g, ">>\\n").split("\\n") //quebra as linhas nos "\n"

    textoCarta = textoCarta.flatMap((linha, i) => {
        if (linha.indexOf("<<") !== -1 && linha.indexOf(">>") !== -1) {
            linha = linha.replace(/<</g, "").replace(/>>/g, "").trim();
            let tamanhoUnderline = emMM(doc.getCharWidthsArray("_"), tamanhoFonteCarta); //Pega o tamanho do "_" em mm
            let tamanhoLinha = emMM(doc.getStringUnitWidth(linha), tamanhoFonteCarta); // Pega o tamanho da linha em mm
            let espaco = tamanhoMaxTexto - tamanhoLinha; //Pega o espaço restante na linha
            let qtdUnderlinesAdicionar = Math.ceil(espaco / tamanhoUnderline); //Calcula quantos "_" podem ser adicionados
            linha = linha.replace(/_/g, "_".repeat(qtdUnderlinesAdicionar)); //Insere o nro de "_" suficientes para preencher a linha toda.

        } else {
            linha = trocaUnderline(linha);
        }

        linha = linha.split("\\n")
        linha = linha.map((elem) => elem.trim()); // Remove os espaços em cada linha
        linha = linha.filter((elem) => elem != ""); //Limpa as linhas vazias
        linha = doc.setFontSize(tamanhoFonteCarta).splitTextToSize(linha, tamanhoMaxTexto);

        return linha;
    })

    if (tipo != "branca" && impressao.verso == "padrao") {
        doc.setFillColor(impressao.cor || 0); //dentro
        doc.setTextColor(255);
        doc.rect(xfora - sangria, yfora - sangria, tamanhoCarta[0] + (sangria * 2), tamanhoCarta[1] + (sangria * 2), "F");
        //fundoCarta(doc);

        doc.text(textoCarta, xfora + margemCarta[0], yfora + margemCarta[1]);

        //rodapé
        textoRodape = doc.setFontSize(tamanhoFonteRodape).splitTextToSize(textoRodape, maxRodape);
        doc.text(
            textoRodape,
            textoRodapeX,
            textoRodapeY
        );
        doc.addImage(
            "imgs/icones/" + icone + "-branco.png",
            "png",
            xfora + margemCarta[0],
            yfora + margemRodape[1] - tamanhoLogo[1],
            tamanhoLogo[0],
            tamanhoLogo[1]
        );
    } else {
        doc.setFillColor(255);
        doc.setTextColor(0);
        fundoCarta(doc);

        doc.text(textoCarta, xfora + margemCarta[0], yfora + margemCarta[1]);

        //rodapé

        if (tipo == "branca") {
            doc.addImage(
                "imgs/icones/" + icone + "-preto.png",
                "png",
                xfora + margemCarta[0],
                yfora + margemRodape[1] - tamanhoLogo[1],
                tamanhoLogo[0],
                tamanhoLogo[1]
            );
        } else {
            doc.setFillColor(impressao.cor || 0);
            doc.rect(xfora - sangria, yfora + margemRodape[1] - tamanhoLogo[1] - (tamanhoLogo[1] / 2), tamanhoCarta[0] + (2 * sangria), tamanhoLogo[1] * 2, "F");
            doc.setTextColor(255);
            doc.addImage(
                "imgs/icones/" + icone + "-branco.png",
                "png",
                xfora + margemCarta[0],
                yfora + margemRodape[1] - tamanhoLogo[1],
                tamanhoLogo[0],
                tamanhoLogo[1]
            );
        }

        textoRodape = doc.setFontSize(tamanhoFonteRodape).splitTextToSize(textoRodape, maxRodape);
        doc.text(
            textoRodape,
            textoRodapeX,
            textoRodapeY
        );
    }

    atualizaImpCont(doc);
}

function montaVersos(doc) {

    let tamanhoLogo = coordImpressao[impressao.tamanho].tamanhoLogoVerso;

    let tamanhoCarta = coordImpressao[impressao.tamanho].tamanhoCarta;
    let margemCarta = coordImpressao[impressao.tamanho].margemCarta;
    let maxVersoText = coordImpressao[impressao.tamanho].tamanhoCarta[0] - coordImpressao[impressao.tamanho].margemCarta[0] * 2;
    let versoTexto = impressao.textoPers;
    let tamanhoTexto = coordImpressao[impressao.tamanho].fonteCarta;
    let tamanhoFonte = coordImpressao[impressao.tamanho].tamanhoFonte;

    let tamLogoTexto = doc.getStringUnitWidth(versoTexto) * tamanhoTexto / (72 / 25.6);
    let maxLogoTexto = tamanhoCarta[0] - (2 * margemCarta[0]);
    let correcao = 2;

    //Cálculo da quantidade de linhas do rodapé para ajustar a altura
    let rodapeLinhas = Math.ceil(Math.floor(tamLogoTexto) / maxLogoTexto);

    qtdCartas = coordImpressao[impressao.tamanho].qtdCartas;

    // Brancas
    if (impressao.brancas.length > 0) {
        doc.addPage();
        //montaLinhasDeCorte(doc);

        doc.setTextColor(0);

        for (let i = 1; i < qtdCartas + 1; i++) {

            // doc.setDrawColor(0); ///////////////////////////////
            // fundoCarta(doc); /////////////////////////////////
            // atualizaImpCont(doc); ////////////////////// REMOVER

            let coordCarta = coordImpressao[impressao.tamanho][i];
            let coordLogo = [coordCarta[0] - correcao + (tamanhoCarta[0] / 2) - tamanhoLogo[0] / 2, coordCarta[1] + margemCarta[1] + (margemCarta[1] / 2)];


            versoTexto = doc.setFontSize(tamanhoTexto).splitTextToSize(versoTexto, maxVersoText);

            doc.addImage(
                "imgs/icones/radioativo-preto.png",
                "png",
                coordLogo[0],
                coordLogo[1],
                tamanhoLogo[0],
                tamanhoLogo[1]
            );

            doc.text(
                versoTexto,
                coordCarta[0] - correcao + (tamanhoCarta[0] / 2),
                coordLogo[1] + tamanhoLogo[1] + (margemCarta[1] / 2) + (tamanhoFonte / 2),
                null,
                null,
                "center"
            );
        }
    }

    //Pretas
    if (impressao.pretas.length > 0) {
        doc.addPage();
        //montaLinhasDeCorte(doc);

        doc.setFillColor(impressao.cor || 0);
        doc.setTextColor(255);

        let x = coordImpressao[impressao.tamanho].corte.x;
        let y = coordImpressao[impressao.tamanho].corte.y;

        if (impressao.verso == "padrao") {
            doc.rect(5, 5, 200, 287, "F");

        } else {
            for (let i = 0; i < x.length - 1; i++) {
                doc.rect(5, y[i] + margemCarta[1], 200, tamanhoLogo[1] + margemCarta[1] + (rodapeLinhas * tamanhoFonte) + (tamanhoFonte / 2), "F");
                // doc.rect(5, y[i] + margemCarta[1], 200, tamanhoLogo[1] * 2 + margemCarta[1], "F");
            }
        }

        for (let i = 1; i < qtdCartas + 1; i++) {

            // doc.setDrawColor(0); ///////////////////////////////
            // fundoCarta(doc); /////////////////////////////////
            // atualizaImpCont(doc); ////////////////////// REMOVER
            let coordCarta = coordImpressao[impressao.tamanho][i];
            let coordLogo = [coordCarta[0] - correcao + (tamanhoCarta[0] / 2) - tamanhoLogo[0] / 2, coordCarta[1] + margemCarta[1] + (margemCarta[1] / 2)];

            doc.setTextColor(255);
            doc.addImage(
                "imgs/icones/radioativo-branco.png",
                "png",
                coordLogo[0],
                coordLogo[1],
                tamanhoLogo[0],
                tamanhoLogo[1]
            );

            versoTexto = doc.setFontSize(tamanhoTexto).splitTextToSize(versoTexto, maxVersoText);
            doc.text(
                versoTexto,
                coordCarta[0] - correcao + (tamanhoCarta[0] / 2),
                coordLogo[1] + tamanhoLogo[1] + (margemCarta[1] / 2) + (tamanhoFonte / 2),
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

    const doc = new jsPDF();

    montaLinhasDeCorte(doc);

    //Pega os textos das cartas nas tabelas
    impressao.brancas = $.map($("#corpo-tabela-brancas > tr.marcado"), (val, i) => {
        return {
            texto: $(val).children("td.carta-texto").text(),
            categoria: $(val).children("td.carta-categoria").text()
        };
    });
    impressao.pretas = $.map($("#corpo-tabela-pretas > tr.marcado"), (val, i) => {
        return {
            texto: $(val).children("td.carta-texto").text(),
            categoria: $(val).children("td.carta-categoria").text()
        };
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
            doc.addPage();
            montaLinhasDeCorte(doc, "p");
        }
        ////////// COLOCAR LINHAS DE CORTE BRANCAS NO MEIO DAS CARTAS PRETAS!!!!
        impressao.cont = 1;

        //Monta as frentes pretas
        $.each(impressao.pretas, (i, val) => montaFrentes("preta", val, doc));
    }

    //Monta os versos
    montaVersos(doc);

    doc.setProperties({
        title: "Cartas Radioativas",
        subject: "Jogo Cartas Radioativas",
        author: "lvmasterrj",
        creator: "cartasradioativas.epizy.com"
    });

    //doc.output("dataurlnewwindow", "cartas-radioativas.pdf"); // Exibe o pdf mas não salva
    //window.open(doc.output('bloburl', "cartas-radioativas.pdf"), '_blank'); // Funciona mas o nome do arquivo fica ruim
    doc.save("cartas-radioativas"); // Salva com o nome correto,mas não faz preview

}