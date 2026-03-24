let basePrevista = []; 
let bipsRealizados = new Set();
let bipsExtras = []; 

// --. MENU ---
function toggleMenu(e) {
    if (e) e.stopPropagation();
    const drop = document.getElementById('dropdown');
    const isVisible = drop.style.display === 'block';
    drop.style.display = isVisible ? 'none' : 'block';
}

window.addEventListener('click', function(event) {
    const drop = document.getElementById('dropdown');
    if (drop && !event.target.matches('.dots-btn')) {
        drop.style.display = 'none';
    }
});

// --- CRIAÇÃO DA BASE  ---
function iniciarAuditoria() {
    const rawText = document.getElementById('base-ids').value;
    // Pega qualquer sequência de 11 dígitos que inicie com 4 (fatiando se necessário)
    const regexBase = /4\d{10}/g; 
    const idsExtraidos = rawText.match(regexBase);

    if (!idsExtraidos) return alert("Erro: Nenhum ID válido encontrado.");

    basePrevista = [...new Set(idsExtraidos)];
    bipsRealizados = new Set();
    bipsExtras = [];

    document.getElementById('step-config').classList.add('hidden');
    document.getElementById('step-audit').classList.remove('hidden');
    renderizarListaCompleta();
    atualizarResumo();
    setTimeout(() => document.getElementById('scanInput').focus(), 100);
}

function lerArquivo(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('base-ids').value = e.target.result.trim();
        iniciarAuditoria();
    };
    reader.readAsText(file);
}

// ---AUDITORIA ATIVA (Bipagem) ---
function adicionarBip(idSujo) {
    // Bloqueio Rigoroso de DANFE (44 dígitos puramente numéricos)
    if (/^\d{44}$/.test(idSujo)) {
        bipsExtras.unshift({ id: "DANFE DETECTADA", idFull: idSujo, tipo: 'Inválido', cor: '#f23d4f' });
    } 
    else {
        // limpeza de QR Code: busca 4+10 no meio de qualquer texto
        const matchMeli = idSujo.match(/4\d{10}/);
        
        if (matchMeli) {
            const idLimpo = matchMeli[0];
            
            if (bipsRealizados.has(idLimpo)) {
                alert("ID " + idLimpo + " já foi escaneado!");
                return;
            }

            if (basePrevista.includes(idLimpo)) {
                bipsRealizados.add(idLimpo);
            } else {
                bipsRealizados.add(idLimpo);
                bipsExtras.unshift({ id: idLimpo, idFull: idLimpo, tipo: 'A Mais', cor: '#ff9800' });
            }
        } else {
            // Caso não encontre padrão de ID válido
            const display = idSujo.length > 20 ? idSujo.substring(0, 20) + "..." : idSujo;
            bipsExtras.unshift({ id: display, idFull: idSujo, tipo: 'Inválido', cor: '#f23d4f' });
        }
    }
    renderizarListaCompleta();
    atualizarResumo();
}

// --- RENDERIZAÇÃO E HISTÓRICO ---
function renderizarListaCompleta() {
    const container = document.getElementById('visualList');
    container.innerHTML = '';
    
    // Erros e Extras (Sempre no topo)
    bipsExtras.forEach(e => {
        const item = document.createElement('div');
        item.className = 'bip-item';
        item.innerHTML = `
            <span class="status-dot" style="background:${e.cor};color:white">!</span>
            <div style="flex:1"><strong>${e.id}</strong></div>
        `;
        container.appendChild(item);
    });

    // 2. MEIO: IDs Corretos (O último bipado fica no topo desta seção)
    const concluidos = Array.from(bipsRealizados)
        .filter(id => basePrevista.includes(id))
        .reverse(); 

    concluidos.forEach(id => {
        const item = document.createElement('div');
        item.className = 'bip-item';
        item.innerHTML = `
            <span class="status-dot" style="background:#00a650;color:white">✓</span>
            <div style="flex:1; opacity:1"><strong>${id}</strong></div>
        `;
        container.appendChild(item);
    });

    //  IDs Pendentes (Cinza opaco)
    const pendentes = basePrevista.filter(id => !bipsRealizados.has(id));
    pendentes.forEach(id => {
        const item = document.createElement('div');
        item.className = 'bip-item';
        item.innerHTML = `
            <span class="status-dot" style="background:#ccc;color:white"></span>
            <div style="flex:1; opacity:0.5"><strong>${id}</strong></div>
        `;
        container.appendChild(item);
    });
}

// --- EXPORTAÇÃO E RESUMO ---
function atualizarResumo() {
    const corretos = basePrevista.filter(id => bipsRealizados.has(id)).length;
    document.getElementById('countBase').innerText = basePrevista.length;
    document.getElementById('countCorretos').innerText = corretos;
    document.getElementById('countFaltante').innerText = basePrevista.length - corretos;
    document.getElementById('countAMais').innerText = bipsExtras.filter(e => e.tipo === 'A Mais').length;
}

function exportarCSV() {
    let csv = "ID,Status\n";
    basePrevista.forEach(id => {
        const status = bipsRealizados.has(id) ? 'Correto' : 'Faltante';
        csv += `${id},${status}\n`;
    });
    bipsExtras.forEach(e => {
        csv += `${e.idFull || e.id},${e.tipo}\n`;
    });

    const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria_meli_${new Date().getTime()}.csv`;
    a.click();
    toggleMenu();
}

function voltarParaConfig() {
    document.getElementById('step-config').classList.remove('hidden');
    document.getElementById('step-audit').classList.add('hidden');
    toggleMenu();
}

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('scanInput');
    if(input) {
        input.addEventListener('keydown', (e) => {
            if(e.key === 'Enter') {
                const val = e.target.value.trim();
                if(val) { adicionarBip(val); e.target.value = ''; }
            }
        });
    }
});