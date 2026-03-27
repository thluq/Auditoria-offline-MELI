let qrcode;

document.addEventListener("DOMContentLoaded", () => {
    const qrElement = document.getElementById("qrcode");
    if (qrElement) {
        qrcode = new QRCode(qrElement, {
            width: 70, height: 70, correctLevel: QRCode.CorrectLevel.H
        });
    }
    carregarDados();
    updateLabel();
});

function updateLabel() {
    // Captura de Inputs
    const headerText = document.getElementById('in-header-free').value;
    const recipientText = document.getElementById('in-recipient-free').value;
    const ssp = document.getElementById('in-ssp').value.trim();
    const fsp = document.getElementById('in-fsp').value.trim();
    const id = document.getElementById('in-id').value.trim();
    const clusterNum = document.getElementById('in-cluster').value.trim();
    const promiseDateInput = document.getElementById('in-date').value.trim();
    
    const addressType = document.querySelector('input[name="address-type"]:checked')?.value || "R";

    // --- PLACEHOLDERS VISUAIS ---
    const placeholderRemetente = "MELI MELI - #100000010\nAv. Gustavo Machado 1234 Empresarial\nCajamar BR-SP 00000001\nVenda: 40028922";
    const placeholderDestinatario = "DADOS FICITICIOS!!! THIAGO LUCAS\nEndereço: Rua Allan 666, Jardim Ibiti do Paço \nCEP: 1800-000\n Cidade de Destino: Sorocaba, São Paulo\n Complemento: Apto 1234";

    document.getElementById('out-header-free').innerText = headerText || placeholderRemetente;
    document.getElementById('out-recipient-free').innerText = recipientText || placeholderDestinatario;
    document.getElementById('out-ssp').innerText = ssp || "SSP20";
    document.getElementById('out-fsp').innerText = fsp || "FSP04";
    document.getElementById('out-address-type').innerText = addressType;

    //  Cluster Combinado
    const valFSP = fsp || "FSP04";
    const valSSP = ssp || "SSP20";
    const valCluster = clusterNum || "45";
    document.getElementById('out-cluster-combined').innerHTML = 
        `${valFSP} > ${valSSP} > <span class="cluster-number-bold">${valCluster}</span>`;

    // Lógica da Data de Promessa
    if (!promiseDateInput) {
        const dias = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
        const hoje = new Date();
        const diaSemana = dias[hoje.getDay()];
        const dataFormatada = hoje.toLocaleDateString('pt-BR'); 
        document.getElementById('out-date').innerText = `${diaSemana} ${dataFormatada}`;
    } else {
        document.getElementById('out-date').innerText = promiseDateInput.toUpperCase();
    }

    // Destaque nos últimos 5 dígitos
    const textManual = document.getElementById('barcode-text-manual');

    if (id) {
        //Gera códigos com o valor digitado
        JsBarcode("#barcode", id, {
            format: "CODE128", lineColor: "#000", width: 2.2, height: 100, displayValue: false, margin: 0
        });

        const startPart = id.substring(0, id.length - 5);
        const lastFive = id.substring(id.length - 5);
        textManual.innerHTML = `${startPart}<span class="id-last-five-highlight">${lastFive}</span>`;
        textManual.style.color = "#000";

        if (qrcode) { qrcode.clear(); qrcode.makeCode(id); }
    } else {
        // Placeholder 40000000001 em cinza
        JsBarcode("#barcode", "40000000001", {
            format: "CODE128", lineColor: "#ccc", width: 2.2, height: 100, displayValue: false, margin: 0
        });
        textManual.innerHTML = `400000<span class="id-last-five-highlight">00001</span>`;
        textManual.style.color = "#ccc";
        if (qrcode) qrcode.clear();
    }
    
    salvarDados();
}

function salvarDados() {
    const fields = ['in-header-free', 'in-recipient-free', 'in-ssp', 'in-fsp', 'in-cluster', 'in-date', 'in-id'];
    fields.forEach(fId => {
        const el = document.getElementById(fId);
        if (el) localStorage.setItem('etq_' + fId, el.value);
    });
    const type = document.querySelector('input[name="address-type"]:checked')?.value;
    if (type) localStorage.setItem('etq_type', type);
}

function carregarDados() {
    const fields = ['in-header-free', 'in-recipient-free', 'in-ssp', 'in-fsp', 'in-cluster', 'in-date', 'in-id'];
    fields.forEach(fId => {
        const val = localStorage.getItem('etq_' + fId);
        if (val !== null) document.getElementById(fId).value = val;
    });
    const savedType = localStorage.getItem('etq_type') || "R";
    const rb = document.querySelector(`input[name="address-type"][value="${savedType}"]`);
    if (rb) rb.checked = true;
}