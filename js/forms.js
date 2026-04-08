/**
 * MECÂNICA BMI - FORMS & WEBHOOK ENGINE
 * Lógica isolada para a página de serviços (servicos.html)
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==============================================================
       0. CREDENCIAIS E LINKS ÚTEIS (COLOQUE SEUS LINKS AQUI)
       ============================================================== */
    
    const CONFIG = {
        // [!] Substitua pelas URLs geradas no seu servidor do Discord
        WEBHOOK_PAGAMENTO: "URL_DO_WEBHOOK_PAGAMENTO",
        WEBHOOK_CARGOS: "URL_DO_WEBHOOK_CARGOS",
        WEBHOOK_HORAS: "URL_DO_WEBHOOK_HORAS",
        WEBHOOK_JUSTIFICATIVA: "URL_DO_WEBHOOK_JUSTIFICATIVAS",
        
        // [!] Configurações do seu Cloudinary para Upload Mágico de Imagens
        CLOUDINARY_URL: "https://api.cloudinary.com/v1_1/SEU_CLOUD_NAME/image/upload",
        CLOUDINARY_UPLOAD_PRESET: "SEU_PRESET_AQUI"
    };

    /* ==============================================================
       1. SISTEMA DE TABS (Navegação entre os Formulários)
       ============================================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const formPanels = document.querySelectorAll('.form-panel:not(.form-success)');
    const successMsg = document.getElementById('form-success-msg');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove ativação
            tabBtns.forEach(b => b.classList.remove('active'));
            formPanels.forEach(p => p.classList.add('hidden'));
            if(successMsg) successMsg.classList.add('hidden'); 

            // Ativa alvo
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            const targetPanel = document.getElementById(targetId);
            
            if (targetPanel) {
                targetPanel.classList.remove('hidden');
            }
        });
    });

    const btnVoltar = document.getElementById('btn-voltar-form');
    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            successMsg.classList.add('hidden');
            if(tabBtns.length > 0) {
                const firstId = tabBtns[0].getAttribute('data-tab');
                const firstPanel = document.getElementById(firstId);
                if(firstPanel) firstPanel.classList.remove('hidden');
                
                tabBtns.forEach(b => b.classList.remove('active'));
                tabBtns[0].classList.add('active');
            }
        });
    }

    /* ==============================================================
       2. CALCULADORAS AUTOMÁTICAS E UI LÓGICA
       ============================================================== */

    // A. Calculadora de Pagamento (Puxar salário do Cargo)
    const pgtoCargoSelect = document.getElementById('pagamento-cargo');
    const pgtoSalarioInput = document.getElementById('pagamento-salario');
    
    if (pgtoCargoSelect && pgtoSalarioInput) {
        pgtoCargoSelect.addEventListener('change', (e) => {
            const selectedOpt = e.target.options[e.target.selectedIndex];
            const salario = selectedOpt.getAttribute('data-salario');
            pgtoSalarioInput.value = salario ? salario : '';
        });
    }

    // B. Calculadora de Compra de Cargo e Cupom
    const cargoDesejadoSelect = document.getElementById('cargo-desejado');
    const cargoCupomInput = document.getElementById('cargo-cupom');
    const cargoTotalView = document.getElementById('cargo-total-view');
    const cargoTotalHidden = document.getElementById('cargo-total-hidden');

    function updateCargoTotal() {
        if (!cargoDesejadoSelect || !cargoTotalView) return;
        
        const selectedOpt = cargoDesejadoSelect.options[cargoDesejadoSelect.selectedIndex];
        let valorBase = selectedOpt.getAttribute('data-custo') ? parseFloat(selectedOpt.getAttribute('data-custo')) : 0;
        
        // Simulação de Desconto
        const cupomDigitado = cargoCupomInput.value.toUpperCase().trim();
        if (cupomDigitado === "FENIX20" || cupomDigitado === "LOA20") {
            valorBase = valorBase * 0.8; // 20% desconto
        }

        cargoTotalView.innerText = valorBase > 0 ? `R$ ${valorBase.toFixed(2).replace('.', ',')}` : "R$ 0,00";
        if(cargoTotalHidden) cargoTotalHidden.value = valorBase.toFixed(2);
    }

    if (cargoDesejadoSelect) cargoDesejadoSelect.addEventListener('change', updateCargoTotal);
    if (cargoCupomInput) cargoCupomInput.addEventListener('input', updateCargoTotal);

    // C. Calculadora de Compra de Horas e Toggle Método Pagamento
    const horasQtyInput = document.getElementById('horas-qty');
    const horasMetodoSelect = document.getElementById('horas-metodo');
    const horasTotalView = document.getElementById('horas-total-view');
    const horasTotalHidden = document.getElementById('horas-total-hidden');
    const pixUiBlock = document.getElementById('pix-ui-block');

    function updateHorasTotal() {
        if (!horasQtyInput || !horasTotalView || !horasMetodoSelect) return;
        
        const qty = parseInt(horasQtyInput.value) || 0;
        const metodo = horasMetodoSelect.value;
        let resultado = "";

        if (qty > 0) {
            if (metodo === "PIX") {
                const totalPix = qty * 1.00; // R$ 1 por hora
                resultado = `R$ ${totalPix.toFixed(2).replace('.', ',')} (PIX)`;
                if(horasTotalHidden) horasTotalHidden.value = totalPix;
            } else if (metodo === "INGAME") {
                const totalInGame = qty * 100000; // 100k por hora
                resultado = `$ ${totalInGame.toLocaleString('pt-BR')} (Sujo)`;
                if(horasTotalHidden) horasTotalHidden.value = totalInGame;
            } else {
                resultado = "Selecione Método";
            }
        } else {
            resultado = "R$ 0,00";
        }
        
        horasTotalView.innerText = resultado;
    }

    if (horasQtyInput) horasQtyInput.addEventListener('input', updateHorasTotal);
    if (horasMetodoSelect) {
        horasMetodoSelect.addEventListener('change', (e) => {
            updateHorasTotal();
            if (e.target.value === "PIX") {
                pixUiBlock.classList.remove('hidden');
                // Opcional: Adicionar "required" no input file de comprovante
            } else {
                pixUiBlock.classList.add('hidden');
            }
        });
    }

    /* ==============================================================
       3. ENGINE DE SUBMISSÃO (Webhooks e Simulador UI)
       ============================================================== */
    const forms = document.querySelectorAll('.bmi-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            const submitBtn = form.querySelector('button[type="submit"]');
            const statusBox = form.querySelector('.form-status');
            const originalBtnText = submitBtn.innerHTML;
            
            // Estado de Loading UI
            submitBtn.innerHTML = '<i class="ph ph-spinner-gap" style="animation: spin 1s infinite linear;"></i> Processando...';
            submitBtn.disabled = true;
            statusBox.innerHTML = 'Enviando...';
            
            try {
                // 3.1: Captura os dados brutos do FormHTML
                const formData = new FormData(form);
                const formEntries = Object.fromEntries(formData.entries());
                const formId = form.getAttribute('id');
                
                let webhookTarget = "";
                if (formId === 'form-pagamento') webhookTarget = CONFIG.WEBHOOK_PAGAMENTO;
                else if (formId === 'form-cargo') webhookTarget = CONFIG.WEBHOOK_CARGOS;
                else if (formId === 'form-horas') webhookTarget = CONFIG.WEBHOOK_HORAS;
                else if (formId === 'form-justificativa') webhookTarget = CONFIG.WEBHOOK_JUSTIFICATIVA;

                // 3.2 Lógica Real (Comentada para Demo funcionar perfeitamente sem erros no Console)
                /*
                // A. FAZER UPLOAD DA IMAGEM SE TIVER
                let urlImagem = null;
                const inputFile = form.querySelector('input[type="file"]');
                if (inputFile && inputFile.files[0]) {
                    statusBox.innerHTML = 'Subindo comprovante para a nuvem...';
                    const cloudData = new FormData();
                    cloudData.append('file', inputFile.files[0]);
                    cloudData.append('upload_preset', CONFIG.CLOUDINARY_UPLOAD_PRESET);
                    
                    const resCloud = await fetch(CONFIG.CLOUDINARY_URL, { method: 'POST', body: cloudData });
                    const fileObj = await resCloud.json();
                    urlImagem = fileObj.secure_url;
                }

                // B. CONSTRUIR EMBED DISCORD
                statusBox.innerHTML = 'Despachando para o Discord...';
                let fields = [];
                for (const [key, value] of Object.entries(formEntries)) {
                    // Ignora o arquivo file bruto para não quebrar o payload
                    if (key !== "Comprovante" && value !== "") {
                        fields.push({ name: key.replace(/_/g, ' '), value: `**${value}**`, inline: true });
                    }
                }

                const discordPayload = {
                    username: "BMI MecaBOT",
                    avatar_url: "https://i.imgur.com/example.png",
                    embeds: [{
                        title: formEntries.Tipo || "Novo Registro Protocolado",
                        color: 16739072, // Laranja
                        fields: fields,
                        image: urlImagem ? { url: urlImagem } : null,
                        footer: { text: "Protocolo Gerado Automaticamente - Mecânica BMI" },
                        timestamp: new Date().toISOString()
                    }]
                };

                // C. EFETIVAR DISPARO
                if(webhookTarget && webhookTarget !== "URL_DO_WEBHOOK_XXX") {
                    await fetch(webhookTarget, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(discordPayload)
                    });
                }
                */

                // 3.3. Simulação Visual para o usuário final ter o comportamento completo
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    statusBox.innerHTML = 'Status: Aguardando envio...';
                    
                    formPanels.forEach(p => p.classList.add('hidden'));
                    if(successMsg) {
                        successMsg.classList.remove('hidden');
                    }
                    // Reset da calculadora se aplicável
                    if(horasTotalView) horasTotalView.innerText = "R$ 0,00";
                    if(cargoTotalView) cargoTotalView.innerText = "R$ 0,00";
                    if(pgtoSalarioInput) pgtoSalarioInput.value = "";
                    form.reset();
                }, 1500);

            } catch (error) {
                console.error("Erro no envio:", error);
                
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                statusBox.classList.remove('success');
                statusBox.classList.add('error');
                statusBox.innerHTML = 'Erro ao enviar. Consulte configurações internas.';
            }
        });
    });

});
