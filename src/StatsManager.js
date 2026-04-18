export class StatsManager {
    constructor() {
        this.stats = {
            totalBounty: 0,
            totalWins: 0,
            cash: 5000,
            upgrades: {
                engine: 0,
                handling: 0,
                nitro: 0
            },
            defeatedRivals: [],
            milestones: {
                maxSpeed: 0,
                policeCarsRammed: 0,
                totalPursuitTime: 0,
                evasions: 0
            }
        };

        this.launderCooldown = 0;
        this.cleanDrivingTimer = 0;
        this.highSpeedTimer = 0;
        
        this.load();
    }

    load() {
        const saved = localStorage.getItem('nfs_stats');
        if (saved) {
            const data = JSON.parse(saved);
            this.stats = { ...this.stats, ...data };
            if (!this.stats.upgrades) this.stats.upgrades = { engine: 0, handling: 0, nitro: 0 };
            if (this.stats.cash === undefined) this.stats.cash = 5000;
        }
    }

    save() {
        localStorage.setItem('nfs_stats', JSON.stringify(this.stats));
    }

    update(dt, speedKph, isRacing) {
        // Laundering Cooldown
        this.launderCooldown = Math.max(0, this.launderCooldown - dt);

        // Clean Driving Bonus (Every 30s)
        this.cleanDrivingTimer += dt;
        if (this.cleanDrivingTimer >= 30) {
            this.addCash(500);
            this.notify('CLEAN DRIVING BONUS', 'cyan');
            this.cleanDrivingTimer = 0;
        }

        // High Speed Bonus (85% of max speed)
        const maxConfigSpeed = 320 + (this.stats.upgrades.engine * 15); // Approximate
        const threshold = maxConfigSpeed * 0.85;
        if (speedKph > threshold) {
            this.highSpeedTimer += dt;
            if (this.highSpeedTimer >= 15) {
                this.addCash(300);
                this.notify('HIGH SPEED BONUS', 'yellow');
                this.highSpeedTimer = 0;
            }
        } else {
            this.highSpeedTimer = 0;
        }
    }

    onImpact(magnitude) {
        if (magnitude > 10) {
            this.cleanDrivingTimer = 0; // Reset bonus timer
            this.notify('IMPACT! BONUS RESET', 'red');
        }
    }

    launderBounty() {
        if (this.launderCooldown > 0) {
            this.notify(`LAUNDER COOLDOWN: ${Math.ceil(this.launderCooldown)}s`, 'gray');
            return false;
        }
        
        const amountToLaunder = Math.min(this.stats.totalBounty, 5000);
        if (amountToLaunder < 100) return false;

        const cashReceived = Math.round(amountToLaunder * 0.135); // 13.5%
        this.stats.totalBounty -= amountToLaunder;
        this.addCash(cashReceived);
        this.launderCooldown = 60;
        this.notify(`BOUNTY LAUNDERED: +$${cashReceived}`, 'lime');
        return true;
    }

    addBounty(amount) {
        this.stats.totalBounty += Math.round(amount);
        this.save();
        this.notify(`+${Math.round(amount)} BOUNTY`, 'orange');
    }

    addWin() {
        this.stats.totalWins++;
        this.save();
    }

    addCash(amount) {
        this.stats.cash += Math.round(amount);
        this.save();
        this.updateUI();
    }

    getUpgradeCost(type) {
        const level = this.stats.upgrades[type];
        return 5000 * Math.pow(2, level);
    }

    buyUpgrade(type) {
        const cost = this.getUpgradeCost(type);
        if (this.stats.cash >= cost && this.stats.upgrades[type] < 5) {
            this.stats.cash -= cost;
            this.stats.upgrades[type]++;
            this.save();
            this.updateUI();
            this.notify(`${type.toUpperCase()} UPGRADED`, '#00bfff');
            return true;
        }
        return false;
    }

    updateUI() {
        const cashEl = document.getElementById('cash-value');
        if (cashEl) cashEl.innerText = this.stats.cash;
        const bountyEl = document.getElementById('total-bounty');
        if (bountyEl) bountyEl.innerText = this.stats.totalBounty;
    }

    notify(message, color) {
        const container = document.getElementById('notifications-container');
        if (!container) return;
        const el = document.createElement('div');
        el.className = 'notification';
        el.style.borderLeftColor = color;
        el.innerText = message;
        container.appendChild(el);
        setTimeout(() => {
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 500);
        }, 3000);
    }
}
