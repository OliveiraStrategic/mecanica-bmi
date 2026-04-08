/**
 * Motor de Consulta e Atualização do Servidor BMI
 * Arquitetura de Cache Real: Mantém última versão válida da API, sem invenções.
 */

const SERVER_API_URL = "https://mtasa-api.com/server/?ip=51.81.94.230&asePort=22146";

const ServerData = {
    apiUrl: SERVER_API_URL,
    lastFetchTime: null,
    updateTimer: null,
    lastValidData: null,
    isUsingCache: false,

    // Dados base que não mudam
    baseInfo: {
        name: "Brasil Mundo Imperial",
        economy: "Hard / Realista",
        connectCommand: "connect 51.81.94.230:22023",
        connectLink: "mtasa://51.81.94.230:22023"
    },

    /**
     * Busca os dados da API respeitando regras profissionais de Cache In-Memory
     */
    async fetchServerStatus() {
        this.isUsingCache = false;
        console.log("[BMI Server] Consultando API oficial...");

        try {
            const response = await fetch(this.apiUrl, { cache: "no-store" });
            if (response.ok) {
                const rawData = await response.json();
                this.lastFetchTime = Date.now();
                const mapped = this.mapServerData(rawData);
                
                if (mapped.online) {
                    console.log("[BMI Server] Status recebido. Servidor operante.");
                    this.lastValidData = mapped; // Salva log seguro no cache in-memory
                }
                
                return mapped;
            }
            throw new Error(`HTTP Erro: ${response.status}`);
        } catch (error) {
            console.warn("[BMI Server] Falha na comunicação com a API externa.", error);
            
            // Decisão Inteligente: Já temos algo válido em memória hoje?
            if (this.lastValidData) {
                console.log("[BMI Server] Entrando em modo flutuação. Usando Cache In-Memory visível.");
                this.isUsingCache = true;
                // Não perdemos os trackers relogiais passados, usa data do cache.
                return { ...this.lastValidData }; 
            }

            // Zero cache (caiu de primeira ou servidor acabou de hospedar sem rede)
            this.lastFetchTime = Date.now();
            console.log("[BMI Server] Sem cache existente. Abortando com Dados Indisponíveis.");
            return {
                online: false,
                name: this.baseInfo.name,
                players: null,
                maxPlayers: null,
                economy: this.baseInfo.economy,
                connectCommand: this.baseInfo.connectCommand,
                connectLink: this.baseInfo.connectLink
            };
        }
    },

    /**
     * Mapeia os dados brutos
     */
    mapServerData(raw) {
        if (typeof raw.online === 'boolean' && !raw.online) {
            return {
                online: false,
                name: this.baseInfo.name,
                players: null,
                maxPlayers: null,
                economy: this.baseInfo.economy,
                connectCommand: this.baseInfo.connectCommand,
                connectLink: this.baseInfo.connectLink
            };
        }

        return {
            online: true,
            name: raw.hostname || raw.name || this.baseInfo.name,
            players: typeof raw.clients !== 'undefined' ? raw.clients : (typeof raw.players !== 'undefined' ? raw.players : (typeof raw.playerCount !== 'undefined' ? raw.playerCount : 0)),
            maxPlayers: raw.sv_maxclients || raw.maxPlayers || raw.maxPlayerCount || null,
            economy: raw.economy || this.baseInfo.economy,
            connectCommand: raw.connectCommand || this.baseInfo.connectCommand,
            connectLink: raw.connectLink || this.baseInfo.connectLink
        };
    },

    async init() {
        const nameEl = document.getElementById('server-name');
        if (!nameEl) return;

        await this.pollAndUpdate();
        // Polling constante independente de crises
        setInterval(() => this.pollAndUpdate(), 30000);

        if (this.updateTimer) clearInterval(this.updateTimer);
        this.updateTimer = setInterval(() => this.refreshTimeAgo(), 1000);
    },

    refreshTimeAgo() {
        const el = document.getElementById('server-last-update');
        if (!el || !this.lastFetchTime) return;
        
        const diffInSec = Math.floor((Date.now() - this.lastFetchTime) / 1000);
        if (diffInSec < 5) {
            el.innerHTML = '<i class="ph ph-clock"></i> Atualizado agora';
        } else {
            el.innerHTML = `<i class="ph ph-clock"></i> Atualizado há ${diffInSec}s`;
        }
    },

    async pollAndUpdate() {
        const data = await this.fetchServerStatus();
        this.renderServerData(data);
        this.refreshTimeAgo(); 
    },

    /**
     * Renderização Ciente de Cache
     */
    renderServerData(data) {
        const statusBox = document.getElementById('server-status');
        const statusText = document.getElementById('server-status-text');
        const pulse = document.getElementById('server-pulse');
        
        const nameEl = document.getElementById('server-name');
        const playersEl = document.getElementById('server-players');
        const economyEl = document.getElementById('server-economy');
        const connectEl = document.getElementById('server-connect');
        const connectBtn = document.getElementById('server-connect-link'); 
        
        const progressBar = document.getElementById('server-progress-bar');
        const percentageTxt = document.getElementById('server-percentage');

        // Textos Básicos Universais
        if(nameEl) nameEl.innerText = data.name;
        if(economyEl) economyEl.innerText = data.economy;
        if(connectEl) connectEl.innerText = data.connectCommand;

        // Botoes continuam existindo pro MTA resolver
        if (connectBtn) {
            connectBtn.href = data.connectLink;
            connectBtn.style.display = "flex";
        }

        // Lógica de Ocupação Realística ou Vazia
        if (playersEl) {
            if (data.players === null || data.maxPlayers === null) {
                playersEl.innerHTML = `-- <span class="text-dim" style="font-size: 1rem;">/ --</span>`;
                if (progressBar) progressBar.style.width = `0%`;
                if (progressBar) progressBar.style.background = `rgba(255,255,255,0.2)`;
                if (progressBar) progressBar.style.boxShadow = `none`;
                if (percentageTxt) percentageTxt.innerText = `--% de Ocupação`;
            } else {
                playersEl.innerHTML = `${data.players} <span class="text-dim" style="font-size: 1rem;">/ ${data.maxPlayers}</span>`;
                
                let perc = 0;
                if (data.maxPlayers > 0) {
                    perc = Math.min(100, Math.round((data.players / data.maxPlayers) * 100));
                }
                
                if (progressBar) progressBar.style.width = `${perc}%`;
                if (percentageTxt) percentageTxt.innerText = `${perc}% de Ocupação`;
                
                if (progressBar && perc >= 98) {
                    progressBar.style.background = "#ef4444";
                    progressBar.style.boxShadow = "0 0 10px rgba(239, 68, 68, 0.5)";
                } else if (progressBar) {
                    progressBar.style.background = "var(--clr-primary)";
                    progressBar.style.boxShadow = "0 0 10px rgba(255, 107, 0, 0.5)";
                }
            }
        }

        // Status Visual (Suporta Três Estados: Online Puro, Online Cacheado e Indisponível)
        if (statusBox && statusText && pulse) {
            if (data.online) {
                statusBox.className = "server-status status-online";
                pulse.style.animation = "serverPulse 2s infinite";
                
                if (this.isUsingCache) {
                    statusText.innerText = "ONLINE (CACHE)";
                    statusText.style.color = "#F59E0B"; // Laranja Profissional Discreto
                    pulse.style.background = "#F59E0B";
                    pulse.style.boxShadow = "0 0 10px rgba(245, 158, 11, 0.5)";
                } else {
                    statusText.innerText = "Servidor Online";
                    statusText.style.color = "#10B981"; // Verde Puro
                    pulse.style.background = "#10B981";
                    pulse.style.boxShadow = "0 0 10px #10B981";
                }
            } else {
                statusBox.className = "server-status status-offline";
                statusText.innerText = "Dados Indisponíveis";
                statusText.style.color = "#888888";
                pulse.style.background = "#333333";
                pulse.style.boxShadow = "none";
                pulse.style.animation = "none";
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ServerData.init();
});
