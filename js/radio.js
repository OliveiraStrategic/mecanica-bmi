/**
 * BMI Radio Player - Global Floating Player
 * ─────────────────────────────────────────
 * Para trocar o stream: altere RADIO_STREAM_URL abaixo.
 * Para usar arquivo local: RADIO_STREAM_URL = "assets/audio/radio.mp3"
 */

const RADIO_STREAM_URL = "https://ice5.somafm.com/groovesalad-128-mp3";

const RadioPlayer = {
    audio: null,
    isPlaying: false,
    savedVolume: 0.4,

    init() {
        this.audio = document.getElementById('radio-audio');
        if (!this.audio) return;

        // Elementos de UI
        this.playBtn    = document.getElementById('radio-play-btn');
        this.muteBtn    = document.getElementById('radio-mute-btn');
        this.volSlider  = document.getElementById('radio-volume');
        this.volIcon    = document.getElementById('radio-vol-icon');
        this.statusText = document.getElementById('radio-status-text');
        this.wave       = document.getElementById('radio-wave');

        // Configura source (sem autoplay)
        this.audio.src = RADIO_STREAM_URL;
        this.audio.volume = 0.4;
        this.audio.preload = "none";

        this._bindEvents();
        this._updateVolIcon();
    },

    _bindEvents() {
        if (this.playBtn) this.playBtn.addEventListener('click', () => this.togglePlay());
        if (this.muteBtn) this.muteBtn.addEventListener('click', () => this.toggleMute());

        if (this.volSlider) {
            this.volSlider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value, 10) / 100;
                this.audio.volume = val;
                if (val > 0) this.savedVolume = val;
                this._updateVolIcon();
            });
        }

        // Estado de erro no stream
        this.audio.addEventListener('error', () => {
            this._setStatus('Falha na conexão — tente novamente', false);
            this.isPlaying = false;
            this._updatePlayIcon();
            if (this.wave) this.wave.classList.remove('playing');
        });

        // Buffering
        this.audio.addEventListener('waiting', () => {
            this._setStatus('Carregando stream...', null);
        });

        this.audio.addEventListener('playing', () => {
            this._setStatus('Ao vivo · BMI Radio', true);
        });
    },

    async togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
            // Reset src para liberar conexão (boa prática com streams)
            this.audio.src = "";
            this.isPlaying = false;
            this._setStatus('▶ Clique para sintonizar', false);
        } else {
            // Reconecta o stream do zero
            this.audio.src = RADIO_STREAM_URL;
            this.audio.volume = this.volSlider
                ? parseInt(this.volSlider.value, 10) / 100
                : 0.4;

            this._setStatus('Conectando...', null);

            try {
                await this.audio.play();
                this.isPlaying = true;
            } catch (err) {
                console.warn('[BMI Radio] Play bloqueado pelo navegador:', err);
                this._setStatus('Clique novamente para ativar', false);
                this.isPlaying = false;
            }
        }

        this._updatePlayIcon();
        if (this.wave) this.wave.classList.toggle('playing', this.isPlaying);
    },

    toggleMute() {
        if (this.audio.volume > 0) {
            this.savedVolume = this.audio.volume;
            this.audio.volume = 0;
            if (this.volSlider) this.volSlider.value = 0;
        } else {
            this.audio.volume = this.savedVolume;
            if (this.volSlider) this.volSlider.value = Math.round(this.savedVolume * 100);
        }
        this._updateVolIcon();
    },

    _setStatus(text, isLive) {
        if (!this.statusText) return;
        this.statusText.textContent = text;
        this.statusText.style.color = isLive === true
            ? '#10B981'
            : isLive === false
            ? 'var(--clr-text-dim)'
            : '#F59E0B'; // amarelo = carregando
    },

    _updatePlayIcon() {
        if (!this.playBtn) return;
        const i = this.playBtn.querySelector('i');
        if (!i) return;
        i.className = this.isPlaying
            ? 'ph-fill ph-pause-circle'
            : 'ph-fill ph-play-circle';
    },

    _updateVolIcon() {
        if (!this.volIcon) return;
        const vol = this.audio ? this.audio.volume : 0;
        if (vol === 0) {
            this.volIcon.className = 'ph-fill ph-speaker-none';
        } else if (vol < 0.5) {
            this.volIcon.className = 'ph-fill ph-speaker-low';
        } else {
            this.volIcon.className = 'ph-fill ph-speaker-high';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => RadioPlayer.init());
