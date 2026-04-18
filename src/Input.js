export class Input {
    constructor() {
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            handbrake: false,
            nitro: false,
            restart: false
        };

        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
    }

    onKeyDown(e) {
        switch (e.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.keys.forward = true;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.keys.backward = true;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.keys.left = true;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.keys.right = true;
                break;
            case 'Space':
                this.keys.handbrake = true;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                this.keys.nitro = true;
                break;
            case 'KeyR':
                this.keys.restart = true;
                break;
        }
    }

    onKeyUp(e) {
        switch (e.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.keys.forward = false;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.keys.backward = false;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.keys.left = false;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.keys.right = false;
                break;
            case 'Space':
                this.keys.handbrake = false;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                this.keys.nitro = false;
                break;
            case 'KeyR':
                this.keys.restart = false;
                break;
        }
    }
}
