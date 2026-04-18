export class SettingsManager {
    constructor() {
        this.settings = {
            masterVolume: 0.8,
            graphicsLevel: 'medium', // low, medium, high
            showShadows: true,
            motionBlurIntensity: 1.0,
            particleDensity: 1.0
        };
        
        this.load();
    }

    load() {
        const saved = localStorage.getItem('nfs_settings');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.settings = { ...this.settings, ...data };
            } catch (e) {
                console.warn('Failed to load settings:', e);
            }
        }
    }

    save() {
        localStorage.setItem('nfs_settings', JSON.stringify(this.settings));
    }

    updateSetting(key, value) {
        if (this.settings.hasOwnProperty(key)) {
            this.settings[key] = value;
            this.save();
            return true;
        }
        return false;
    }

    applyGraphicsPreset(level) {
        this.settings.graphicsLevel = level;
        switch (level) {
            case 'low':
                this.settings.showShadows = false;
                this.settings.particleDensity = 0.3;
                this.settings.motionBlurIntensity = 0.2;
                break;
            case 'medium':
                this.settings.showShadows = true;
                this.settings.particleDensity = 0.7;
                this.settings.motionBlurIntensity = 0.8;
                break;
            case 'high':
                this.settings.showShadows = true;
                this.settings.particleDensity = 1.0;
                this.settings.motionBlurIntensity = 1.2;
                break;
        }
        this.save();
    }
}
