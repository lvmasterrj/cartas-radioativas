const { jsPDF } = window.jspdf;

$(document).ready(() => {
    criaPdf();
});

function criaPdf() {
    const doc = new jsPDF();
    doc.rect(20, 20, 10, 10);

    //doc.output("dataurlnewwindow", "cartas-radioativas.pdf"); // Exibe o pdf mas não salva
    window.open(doc.output('bloburl', "sem-pensar.pdf"), '_blank'); // Funciona mas o nome do arquivo fica ruim
    //  doc.save("cartas-radioativas"); // Salva com o nome correto,mas não faz preview
    console.log("OK")
}