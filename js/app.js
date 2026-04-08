/**
 * MECÂNICA BMI - APP SCRIPT (SPA ROUTER & RADIO HUD)
 * Lógica para portal interativo e dashboard estático
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==============================================================
       1. ROUTER SPA (Hash Navigation)
       ============================================================== */
    const views = document.querySelectorAll('.view');
    const navBtns = document.querySelectorAll('.nav-btn');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const sidebar = document.querySelector('.sidebar');

    function router() {
        let hash = window.location.hash || '#inicio';
        
        // Evita links perdidos, forçando #inicio
        const targetViewId = 'view-' + hash.replace('#', '');
        const targetView = document.getElementById(targetViewId);
        
        if (!targetView) {
            hash = '#inicio';
            window.location.hash = hash;
            return;
        }

        // Esconder todas as views
        views.forEach(view => {
            view.classList.remove('active');
            // Remove as animações para resetar
            view.style.animation = 'none';
        });

        // Atualizar Botões do Menu
        navBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('href') === hash) {
                btn.classList.add('active');
            }
        });

        // Puxar a página pro topo (como num app real que muda tela)
        document.querySelector('.main-content').scrollTo(0,0);

        // Mostrar View alvo com animação
        targetView.classList.add('active');
        // Gatilho visual de animação limpa CSS
        targetView.offsetHeight; 
        targetView.style.animation = 'fadeInUp 0.6s ease forwards';
        
        // Auto-fechar sidebar no mobile se estiver aberta
        if (window.innerWidth <= 900 && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    }

    // Ouvinte universal de mudança de rota
    window.addEventListener('hashchange', router);
    
    // Inicializar o Router no primeiro carregamento
    router();


    /* ==============================================================
       2. MOBILE SIDEBAR TOGGLE
       ============================================================== */
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    /* ==============================================================
       3. TABS INTERNAS (Aba de Serviços)
       ============================================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const formPanels = document.querySelectorAll('.form-panel:not(.form-success)');
    const successMsg = document.getElementById('form-success-msg');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            formPanels.forEach(p => p.classList.add('hidden'));
            if(successMsg) successMsg.classList.add('hidden'); 

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            const targetPanel = document.getElementById(targetId);
            
            if (targetPanel) {
                targetPanel.classList.remove('hidden');
                targetPanel.style.animation = 'none';
                targetPanel.offsetHeight;
                targetPanel.style.animation = 'fadeIn 0.5s ease forwards';
            }
        });
    });

    /* ==============================================================
       4. RADIO HUD SYSTEM
       ============================================================== */
    const audioPlayer = document.getElementById('audio-player');
    const btnPlayPause = document.getElementById('btn-play-pause');
    const btnPlayPauseIcon = btnPlayPause ? btnPlayPause.querySelector('i') : null;
    const btnMute = document.getElementById('btn-mute');
    const volumeSlider = document.getElementById('volume-slider');
    const radioStatus = document.getElementById('radio-status');

    if (audioPlayer && btnPlayPause) {
        
        // Start muted / paused based on requirements
        audioPlayer.volume = 0.5;

        // Play/Pause Action
        btnPlayPause.addEventListener('click', () => {
            if (audioPlayer.paused) {
                audioPlayer.play();
                btnPlayPauseIcon.classList.remove('ph-play');
                btnPlayPauseIcon.classList.add('ph-pause');
                btnPlayPause.classList.add('playing');
                radioStatus.innerText = 'Tocando (Ao Vivo)';
                radioStatus.style.color = '#10B981'; // Green
            } else {
                audioPlayer.pause();
                btnPlayPauseIcon.classList.remove('ph-pause');
                btnPlayPauseIcon.classList.add('ph-play');
                btnPlayPause.classList.remove('playing');
                radioStatus.innerText = 'Pausado';
                radioStatus.style.color = 'var(--clr-text-dim)';
            }
        });

        // Volume Control
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                const vol = e.target.value;
                audioPlayer.volume = vol;
                
                // Mudar icone dependendo do volume
                if (vol == 0) {
                    btnMute.className = 'ph-fill ph-speaker-none';
                } else if (vol < 0.5) {
                    btnMute.className = 'ph-fill ph-speaker-low';
                } else {
                    btnMute.className = 'ph-fill ph-speaker-high';
                }
            });
        }

        // Mute / Unmute Button
        if (btnMute) {
            btnMute.addEventListener('click', () => {
                if (audioPlayer.volume > 0) {
                    // Mute it
                    audioPlayer.dataset.oldVolume = audioPlayer.volume;
                    audioPlayer.volume = 0;
                    volumeSlider.value = 0;
                    btnMute.className = 'ph-fill ph-speaker-none';
                } else {
                    // Unmute
                    const prevVol = audioPlayer.dataset.oldVolume || 0.5;
                    audioPlayer.volume = prevVol;
                    volumeSlider.value = prevVol;
                    
                    if (prevVol < 0.5) {
                        btnMute.className = 'ph-fill ph-speaker-low';
                    } else {
                        btnMute.className = 'ph-fill ph-speaker-high';
                    }
                }
            });
        }
    }


    /* ==============================================================
       5. FORMS ENGINE (Mantendo a Lógica Existente Simples)
       ============================================================== */
    
    // Auto-calculo formulários
    const pgtoCargo = document.getElementById('pagamento-cargo');
    const pgtoSalario = document.getElementById('pagamento-salario');
    if (pgtoCargo && pgtoSalario) {
        pgtoCargo.addEventListener('change', (e) => {
            const selectedOpt = e.target.options[e.target.selectedIndex];
            const salario = selectedOpt.getAttribute('data-salario');
            pgtoSalario.value = salario ? salario : '';
        });
    }

    const forms = document.querySelectorAll('.bmi-form');
    // Para simplificar, vou permitir submit via preventDefault e mostrar SUCCESS (modo simulado estático)
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="ph ph-spinner-gap" style="animation: spin 1s infinite linear;"></i> Processando...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                formPanels.forEach(p => p.classList.add('hidden'));
                if(successMsg) {
                    successMsg.classList.remove('hidden');
                    successMsg.style.animation = 'fadeIn 0.5s ease forwards';
                }
                form.reset();
            }, 1000);
        });
    });

    const btnVoltar = document.getElementById('btn-voltar-form');
    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            successMsg.classList.add('hidden');
            if(tabBtns.length > 0) {
                const firstId = tabBtns[0].getAttribute('data-tab');
                const firstPanel = document.getElementById(firstId);
                if(firstPanel) {
                    firstPanel.classList.remove('hidden');
                    firstPanel.style.animation = 'fadeIn 0.5s ease forwards';
                }
                tabBtns.forEach(b => b.classList.remove('active'));
                tabBtns[0].classList.add('active');
            }
        });
    }

});
