export class BlacklistUI {
    constructor(blacklistManager, statsManager) {
        this.blacklistManager = blacklistManager;
        this.statsManager = statsManager;
        
        this.screen = document.getElementById('blacklist-screen');
        this.list = document.getElementById('blacklist-list');
        this.closeBtn = document.getElementById('close-blacklist');
        this.totalBountyEl = document.getElementById('total-bounty');
        
        this.closeBtn.onclick = () => this.hide();
        
        window.addEventListener('keydown', (e) => {
            if (e.code === 'KeyB') this.toggle();
        });
    }

    toggle() {
        if (this.screen.style.display === 'flex') {
            this.hide();
        } else {
            this.show();
        }
    }

    show() {
        this.render();
        this.screen.style.display = 'flex';
    }

    hide() {
        this.screen.style.display = 'none';
    }

    render() {
        this.list.innerHTML = '';
        this.totalBountyEl.innerText = this.statsManager.stats.totalBounty.toLocaleString();

        const currentRival = this.blacklistManager.getCurrentRival();

        this.blacklistManager.rivals.forEach(rival => {
            const isDefeated = this.statsManager.stats.defeatedRivals.includes(rival.id);
            const isCurrent = currentRival && currentRival.id === rival.id;
            const canChallenge = this.blacklistManager.canChallenge(rival.id);

            const card = document.createElement('div');
            card.className = `rival-card ${canChallenge ? 'unlocked' : ''} ${isDefeated ? 'defeated' : ''} ${isCurrent ? 'current' : ''}`;
            
            card.innerHTML = `
                <div class="rival-rank">#${rival.id}</div>
                <div class="rival-name">${rival.name}</div>
                <div class="rival-car">${rival.car}</div>
                <div class="rival-stats">
                    <div>REQUIRED BOUNTY: ${rival.bounty.toLocaleString()}</div>
                    <div>REQUIRED WINS: ${rival.wins}</div>
                </div>
                ${isCurrent && !isDefeated ? `
                    <button class="challenge-btn" ${canChallenge ? '' : 'disabled'}>
                        ${canChallenge ? 'CHALLENGE RIVAL' : 'REQUIREMENTS NOT MET'}
                    </button>
                ` : ''}
                ${isDefeated ? '<div style="color: #00ff00; font-weight: bold; margin-top: 10px;">DEFEATED</div>' : ''}
            `;

            if (isCurrent && canChallenge) {
                const btn = card.querySelector('.challenge-btn');
                btn.onclick = () => this.startBossRace(rival);
            }

            this.list.appendChild(card);
        });
    }

    startBossRace(rival) {
        this.hide();
        this.statsManager.notify(`CHALLENGING ${rival.name}...`, 'red');
        
        // Countdown transition
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:3000; display:flex; justify-content:center; align-items:center; font-size:10rem; font-weight:900; italic:true;';
        document.body.appendChild(overlay);

        let count = 3;
        const itv = setInterval(() => {
            overlay.innerText = count > 0 ? count : 'GO!';
            if (count < 0) {
                clearInterval(itv);
                setTimeout(() => {
                    overlay.remove();
                    this.statsManager.defeatRival(rival.id); // For demo, we just defeat them
                    this.statsManager.addWin();
                }, 1000);
            }
            count--;
        }, 1000);
    }
}
