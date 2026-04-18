export class UpgradeUI {
    constructor(statsManager) {
        this.statsManager = statsManager;
        this.isOpen = false;
        
        this.createUI();
        this.initEvents();
    }

    createUI() {
        this.container = document.createElement('div');
        this.container.id = 'upgrade-screen';
        this.container.innerHTML = `
            <div class="upgrade-header">
                <button id="close-upgrade">✖</button>
                <h1>PERFORMANCE TUNING</h1>
                <p>MAXIMIZE YOUR BMW M3 GTR PERFORMANCE</p>
            </div>
            <div id="upgrade-list">
                <div class="upgrade-item" data-type="engine">
                    <h3>ENGINE</h3>
                    <p>Increases top speed and acceleration curve.</p>
                    <div class="upgrade-level-container"></div>
                    <button class="buy-upgrade-btn">BUY: $5000</button>
                </div>
                <div class="upgrade-item" data-type="handling">
                    <h3>HANDLING</h3>
                    <p>Improves tire grip and high-speed stability.</p>
                    <div class="upgrade-level-container"></div>
                    <button class="buy-upgrade-btn">BUY: $5000</button>
                </div>
                <div class="upgrade-item" data-type="nitro">
                    <h3>NITRO</h3>
                    <p>Increases boost duration and power multiplier.</p>
                    <div class="upgrade-level-container"></div>
                    <button class="buy-upgrade-btn">BUY: $5000</button>
                </div>
            </div>
            <div id="launder-section">
                <p>LAUNDER BOUNTY (13.5% RETURN)</p>
                <button id="launder-btn">CLEAN $5000 BOUNTY</button>
            </div>
            <div class="current-cash">BALANCE: $<span id="upgrade-cash">5000</span></div>
        `;
        document.body.appendChild(this.container);
        
        // CSS for Upgrade UI (enhanced)
        const style = document.createElement('style');
        style.innerText = `
            #upgrade-screen {
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                background: linear-gradient(135deg, rgba(0,0,0,0.98), rgba(0,0,30,0.95));
                z-index: 1501; display: none; flex-direction: column;
                padding: 4rem; box-sizing: border-box;
                backdrop-filter: blur(10px);
            }
            #launder-section {
                margin-top: 3rem; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem;
            }
            #launder-btn {
                background: #ff8c00; border: none; padding: 1rem 2rem; color: white;
                font-weight: bold; cursor: pointer; transition: transform 0.2s;
            }
            #launder-btn:hover { transform: scale(1.05); }
            #launder-btn:disabled { background: #333; opacity: 0.5; }
            .upgrade-header { border-bottom: 2px solid #00bfff; margin-bottom: 2rem; }
            #upgrade-list { display: flex; gap: 2rem; justify-content: center; margin-top: 2rem; }
            .upgrade-item { 
                background: rgba(255,255,255,0.05); padding: 2rem; width: 250px;
                border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s;
            }
            .upgrade-item:hover { background: rgba(0,191,255,0.1); border-color: #00bfff; }
            .upgrade-level-container { display: flex; gap: 5px; margin: 1rem 0; }
            .level-dot { width: 15px; height: 15px; background: #333; border-radius: 50%; }
            .level-dot.active { background: #00bfff; box-shadow: 0 0 10px #00bfff; }
            .buy-upgrade-btn { 
                width: 100%; padding: 1rem; background: #00bfff; border: none; 
                font-weight: bold; cursor: pointer; color: white;
            }
            .buy-upgrade-btn:disabled { background: #333; cursor: not-allowed; }
            .current-cash { 
                position: absolute; bottom: 2rem; right: 4rem; 
                font-size: 2rem; font-weight: 900; color: #00bfff; 
            }
        `;
        document.head.appendChild(style);
    }

    initEvents() {
        document.getElementById('close-upgrade').onclick = () => this.toggle(false);
        document.getElementById('launder-btn').onclick = () => {
            if (this.statsManager.launderBounty()) {
                this.update();
                this.triggerFlash();
            }
        };

        this.container.querySelectorAll('.buy-upgrade-btn').forEach(btn => {
            btn.onclick = (e) => {
                const type = e.target.closest('.upgrade-item').dataset.type;
                if (this.statsManager.buyUpgrade(type)) {
                    this.update();
                    this.triggerFlash();
                }
            };
        });
        
        window.addEventListener('keydown', (e) => {
            if (e.code === 'KeyU') this.toggle();
        });
    }

    triggerFlash() {
        this.container.style.boxShadow = 'inset 0 0 100px #00bfff';
        setTimeout(() => this.container.style.boxShadow = 'none', 300);
    }

    toggle(force) {
        this.isOpen = force !== undefined ? force : !this.isOpen;
        this.container.style.display = this.isOpen ? 'flex' : 'none';
        if (this.isOpen) this.update();
    }

    update() {
        const stats = this.statsManager.stats;
        document.getElementById('upgrade-cash').innerText = stats.cash;
        
        const launderBtn = document.getElementById('launder-btn');
        const launderAmount = Math.min(stats.totalBounty, 5000);
        launderBtn.innerText = `CLEAN $${launderAmount} BOUNTY`;
        launderBtn.disabled = this.statsManager.launderCooldown > 0 || launderAmount < 100;

        this.container.querySelectorAll('.upgrade-item').forEach(item => {
            const type = item.dataset.type;
            const level = stats.upgrades[type];
            const cost = this.statsManager.getUpgradeCost(type);
            
            // Update dots
            const dotContainer = item.querySelector('.upgrade-level-container');
            dotContainer.innerHTML = '';
            for (let i = 0; i < 5; i++) {
                const dot = document.createElement('div');
                dot.className = `level-dot ${i < level ? 'active' : ''}`;
                dotContainer.appendChild(dot);
            }
            
            // Update button
            const btn = item.querySelector('.buy-upgrade-btn');
            if (level >= 5) {
                btn.innerText = 'MAXED';
                btn.disabled = true;
            } else {
                btn.innerText = `BUY: $${cost}`;
                btn.disabled = stats.cash < cost;
            }
        });
    }
}
