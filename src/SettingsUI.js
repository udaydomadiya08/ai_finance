export class SettingsUI {
    constructor(settingsManager, audioSystem, game) {
        this.settings = settingsManager;
        this.audio = audioSystem;
        this.game = game;
        this.isOpen = false;
        
        this.initUI();
        this.initEvents();
    }

    initUI() {
        this.container = document.createElement('div');
        this.container.id = 'settings-screen';
        this.container.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9); z-index: 2100; display: none;
            flex-direction: column; align-items: center; justify-content: center;
            backdrop-filter: blur(10px); color: white;
        `;
        
        this.container.innerHTML = `
            <div class="settings-content" style="width: 400px; padding: 2rem; border-left: 5px solid #ff8c00; background: rgba(255,255,255,0.05);">
                <h1 style="font-style: italic; margin-bottom: 2rem;">SETTINGS</h1>
                
                <div class="setting-item" style="margin-bottom: 2rem;">
                    <label>MASTER VOLUME</label>
                    <input type="range" id="volume-slider" min="0" max="1" step="0.01" value="${this.settings.settings.masterVolume}" style="width: 100%; margin-top: 0.5rem;">
                </div>

                <div class="setting-item" style="margin-bottom: 2rem;">
                    <label>GRAPHICS PRESET</label>
                    <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                        <button class="preset-btn" data-level="low">LOW</button>
                        <button class="preset-btn" data-level="medium">MEDIUM</button>
                        <button class="preset-btn" data-level="high">HIGH</button>
                    </div>
                </div>

                <div class="setting-item" style="margin-bottom: 2rem;">
                    <button id="close-settings" style="width: 100%; padding: 1rem; background: #ff8c00; border: none; font-weight: bold; cursor: pointer;">APPLY & CLOSE</button>
                </div>
                <p style="font-size: 0.7rem; opacity: 0.5; text-align: center;">PRESS ESC TO TOGGLE</p>
            </div>
        `;
        document.body.appendChild(this.container);
    }

    initEvents() {
        document.getElementById('volume-slider').oninput = (e) => {
            const v = parseFloat(e.target.value);
            this.settings.updateSetting('masterVolume', v);
            this.audio.setMasterVolume(v);
        };

        this.container.querySelectorAll('.preset-btn').forEach(btn => {
            btn.onclick = (e) => {
                const level = e.target.dataset.level;
                this.settings.applyGraphicsPreset(level);
                this.game.applySettings();
                this.updateActiveBtn();
            };
        });

        document.getElementById('close-settings').onclick = () => this.toggle(false);
        
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Escape') this.toggle();
        });
    }

    updateActiveBtn() {
        this.container.querySelectorAll('.preset-btn').forEach(btn => {
            btn.style.background = btn.dataset.level === this.settings.settings.graphicsLevel ? '#ff8c00' : '#444';
            btn.style.color = btn.dataset.level === this.settings.settings.graphicsLevel ? 'black' : 'white';
            btn.style.border = 'none';
            btn.style.padding = '0.5rem 1rem';
            btn.style.cursor = 'pointer';
        });
    }

    toggle(force) {
        this.isOpen = force !== undefined ? force : !this.isOpen;
        this.container.style.display = this.isOpen ? 'flex' : 'none';
        if (this.isOpen) {
            this.game.isPaused = true;
            this.updateActiveBtn();
        } else {
            this.game.isPaused = false;
        }
    }
}
