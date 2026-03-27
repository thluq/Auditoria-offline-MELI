let basePrevista = []; 
let bipsRealizados = new Set();
let bipsExtras = []; 

// --- CONTROLE DA INTERFACE ---
function toggleDrawer() {
    const drawer = document.getElementById('drawer');
    if (drawer) {
        drawer.classList.toggle('open');
    }
}

function atualizarTelaStatus(tipo, id = "") {
    const screen = document.getElementById('status-screen');
    const icon = document.getElementById('feedback-icon');
    const title = document.getElementById('feedback-title');
    const msg = document.getElementById('feedback-msg');

    if (!screen) return;

    // Remove as classes de cores anteriores
    screen.className = '';

    if (tipo === 'correto') {
        screen.classList.add('status-ok');
        icon.innerHTML = '<img src="icons/audit-package-icon.svg" style="filter: brightness(0) invert(1);">';
        title.innerText = "Correto";
        msg.innerText = id;
    } else if (tipo === 'amais') {
        screen.classList.add('status-warning');
        icon.innerHTML = '<img src="icons/audit-package-icon.svg" style="filter: brightness(0) invert(1);">';
        title.innerText = id.includes("DUPLICADO") ? "Duplicado" : "A Mais";
        msg.innerText = id;
    } else if (tipo === 'invalido') {
        screen.classList.add('status-error');
        icon.innerHTML = '<img src="icons/audit-package-icon.svg" style="filter: brightness(0) invert(1);">';
        title.innerText = "Inválido";
        msg.innerText = id;
    } else {
        screen.classList.add('status-screen-default');
        icon.innerHTML = '<img src="icons/audit-package-icon.svg">';
        title.innerText = "Escaneie o código";
        msg.innerText = "Aguardando bipagem...";
    }

    // Retorna ao estado padrão após 2 segundos
    if (tipo !== 'default') {
        setTimeout(() => {
            const drawer = document.getElementById('drawer');
            if (drawer && !drawer.classList.contains('open')) {
                atualizarTelaStatus('default');
            }
        }, 2000);
    }
}

// --- LÓGICA DE AUDITORIA ---
function adicionarBip(idSujo) {
    const idLimpoMatch = idSujo.match(/4\d{10}/);
    let idFinal = idSujo;
    let tipoResult = 'invalido';

    if (idLimpoMatch) {
        const idLimpo = idLimpoMatch[0];
        idFinal = idLimpo;

        if (bipsRealizados.has(idLimpo)) {
            atualizarTelaStatus('amais', idLimpo + " (DUPLICADO)");
            return;
        }

        bipsRealizados.add(idLimpo);

        if (basePrevista.includes(idLimpo)) {
            tipoResult = 'correto';
        } else {
            bipsExtras.unshift({ id: idLimpo, tipo: 'A Mais', cor: '#ff9800' });
            tipoResult = 'amais';
        }
    } else {
        bipsExtras.unshift({ id: idSujo.substring(0, 11), tipo: 'Inválido', cor: '#f23d4f' });
        tipoResult = 'invalido';
    }

    atualizarTelaStatus(tipoResult, idFinal);
    renderizarListaCompleta();
    atualizarResumo();
}

function atualizarResumo() {
    const total = basePrevista.length;
    const corretos = Array.from(bipsRealizados).filter(id => basePrevista.includes(id)).length;
    const elementoContador = document.getElementById('progresso-concluido');
    if (elementoContador) {
        elementoContador.innerText = `${corretos}/${total}`;
    }
}

function renderizarListaCompleta() {
    const container = document.getElementById('visualList');
    if (!container) return;
    container.innerHTML = '';

    // ERROS E EXTRAS (Topo)
    bipsExtras.forEach(e => {
        container.innerHTML += `
            <div class="bip-item">
                <span class="status-dot" style="background:${e.cor}">!</span>
                <div style="flex:1"><strong>${e.id}</strong><br><small style="color:#666">${e.tipo}</small></div>
            </div>`;
    });

    //  CORRETOS (Meio)
    const concluidos = Array.from(bipsRealizados).filter(id => basePrevista.includes(id)).reverse();
    concluidos.forEach(id => {
        container.innerHTML += `
            <div class="bip-item">
                <span class="status-dot" style="background:#00a650">✓</span>
                <div style="flex:1"><strong>${id}</strong></div>
            </div>`;
    });

    //  PENDENTES (Fundo)
    const pendentes = basePrevista.filter(id => !bipsRealizados.has(id));
    pendentes.forEach(id => {
        container.innerHTML += `
            <div class="bip-item" style="opacity:0.5">
                <span class="status-dot" style="background:#ccc"></span>
                <div style="flex:1"><strong>${id}</strong><br><small>Pendente</small></div>
            </div>`;
    });
}

function iniciarAuditoria() {
    const rawText = document.getElementById('base-ids').value;
    const idsExtraidos = rawText.match(/4\d{10}/g);

    if (!idsExtraidos) return alert("Erro: Nenhum ID válido encontrado.");

    basePrevista = [...new Set(idsExtraidos)];
    bipsRealizados = new Set();
    bipsExtras = [];

    document.getElementById('step-config').classList.add('hidden');
    document.getElementById('step-audit').classList.remove('hidden');
    document.getElementById('header-menu').classList.remove('hidden');

    atualizarTelaStatus('default');
    renderizarListaCompleta();
    atualizarResumo();
    manterFoco();
}

// --- AUXILIARES ---
function manterFoco() {
    const input = document.getElementById('scanInput');
    input.focus();
    input.onblur = () => setTimeout(() => input.focus(), 10);
    input.onkeydown = (e) => {
        if (e.key === 'Enter') {
            if (input.value.trim()) adicionarBip(input.value.trim());
            input.value = '';
        }
    };
}

function toggleMenu(event) {
    event.stopPropagation();
    document.getElementById('dropdown').classList.toggle('show');
}

window.onclick = (e) => {
    if (!e.target.matches('.dots-btn')) {
        document.getElementById('dropdown').classList.remove('show');
    }
};

function voltarParaConfig() { location.reload(); }

function exportarCSV() {
    let csv = "ID;Status\n";
    bipsExtras.forEach(e => csv += `${e.id};${e.tipo}\n`);
    bipsRealizados.forEach(id => {
        if (basePrevista.includes(id)) csv += `${id};Correto\n`;
    });
    basePrevista.forEach(id => {
        if (!bipsRealizados.has(id)) csv += `${id};Pendente\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria_${new Date().getTime()}.csv`;
    a.click();
}