import * as THREE from 'three';

export class RaceSystem {
    constructor(scene, physicsWorld, statsManager, audioSystem) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        this.statsManager = statsManager;
        this.audioSystem = audioSystem;
        
        this.activeRace = null;
        this.state = 'IDLE'; // IDLE, INTRO, COUNTDOWN, RACING, FINISHED
        
        this.checkpointIndex = 0;
        this.visualCheckpoints = [];
        
        this.countdownValue = 3;
        this.timer = 0;
        this.offRouteTimer = 5;
        
        this.tracks = {
            'sprint_01': {
                name: 'Downtown Sprint',
                type: 'SPRINT',
                reward: 1500,
                path: [
                    { x: 50, y: 0, z: 200 },
                    { x: 150, y: 0, z: 450 },
                    { x: 300, y: 0, z: 800 },
                    { x: 600, y: 0, z: 1200 }
                ]
            },
            'circuit_01': {
                name: 'Industrial Loop',
                type: 'CIRCUIT',
                reward: 2500,
                laps: 2,
                currentLap: 1,
                path: [
                    { x: 100, y: 0, z: 100 },
                    { x: 400, y: 0, z: 100 },
                    { x: 400, y: 0, z: 400 },
                    { x: 100, y: 0, z: 400 }
                ]
            }
        };

        this.markerGeometry = new THREE.TorusGeometry(5, 0.5, 16, 100);
        this.markerMaterial = new THREE.MeshBasicMaterial({ color: 0x00bfff, transparent: true, opacity: 0.6 });
        
        this.ui = {
            countdown: document.createElement('div'),
            offRoute: document.createElement('div')
        };
        this.initUI();
    }

    initUI() {
        this.ui.countdown.id = 'race-countdown';
        this.ui.countdown.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            font-size: 8rem; font-weight: 900; color: #fff; text-shadow: 0 0 20px #00bfff;
            display: none; z-index: 2000; font-style: italic;
        `;
        document.body.appendChild(this.ui.countdown);

        this.ui.offRoute.id = 'off-route-warning';
        this.ui.offRoute.style.cssText = `
            position: fixed; top: 20%; left: 50%; transform: translateX(-50%);
            color: #ff4444; font-size: 2rem; font-weight: bold; display: none; text-shadow: 2px 2px 0 #000;
        `;
        document.body.appendChild(this.ui.offRoute);
    }

    startRace(trackId) {
        const track = this.tracks[trackId];
        if (!track) return;

        this.activeRace = { ...track };
        this.state = 'INTRO';
        this.timer = 2.5; // 2.5s intro camera
        
        this.checkpointIndex = 0;
        if (track.type === 'CIRCUIT') this.activeRace.currentLap = 1;
        
        this.clearVisuals();
        this.createVisualCheckpoint(this.activeRace.path[0]);
    }

    restart() {
        if (!this.activeRace) return;
        const id = Object.keys(this.tracks).find(k => this.tracks[k].name === this.activeRace.name);
        this.startRace(id);
    }

    update(dt) {
        if (!this.activeRace) return;

        const playerPos = this.physicsWorld.chassisBody.position;

        if (this.state === 'INTRO') {
            this.timer -= dt;
            if (this.timer <= 0) {
                this.state = 'COUNTDOWN';
                this.timer = 1.0;
                this.countdownValue = 3;
                this.ui.countdown.style.display = 'block';
                this.ui.countdown.innerText = '3';
                this.audioSystem.playCountdownBeep(false);
            }
            return;
        }

        if (this.state === 'COUNTDOWN') {
            this.timer -= dt;
            if (this.timer <= 0) {
                this.countdownValue--;
                this.timer = 1.0;
                if (this.countdownValue > 0) {
                    this.ui.countdown.innerText = this.countdownValue;
                    this.audioSystem.playCountdownBeep(false);
                } else if (this.countdownValue === 0) {
                    this.ui.countdown.innerText = 'GO!';
                    this.state = 'RACING';
                    this.audioSystem.playCountdownBeep(true);
                } else {
                    this.ui.countdown.style.display = 'none';
                }
            }
            return;
        }

        if (this.state === 'RACING') {
            const target = this.activeRace.path[this.checkpointIndex];
            const dist = playerPos.distanceTo(new THREE.Vector3(target.x, target.y, target.z));

            // Off-route check
            if (dist > 100) {
                this.offRouteTimer -= dt;
                this.ui.offRoute.style.display = 'block';
                this.ui.offRoute.innerText = `RETURN TO ROUTE: ${Math.ceil(this.offRouteTimer)}s`;
                if (this.offRouteTimer <= 0) this.failRace('OFF ROUTE');
            } else {
                this.offRouteTimer = 5;
                this.ui.offRoute.style.display = 'none';
            }

            if (dist < 20) {
                this.nextCheckpoint();
            }
        }
    }

    failRace(reason) {
        this.statsManager.notify(`RACE FAILED: ${reason}`, 'red');
        this.state = 'IDLE';
        this.activeRace = null;
        this.clearVisuals();
        this.ui.offRoute.style.display = 'none';
        this.ui.countdown.style.display = 'none';
    }

    nextCheckpoint() {
        this.checkpointIndex++;
        if (this.checkpointIndex >= this.activeRace.path.length) {
            if (this.activeRace.type === 'CIRCUIT' && this.activeRace.currentLap < this.activeRace.laps) {
                this.activeRace.currentLap++;
                this.checkpointIndex = 0;
            } else {
                this.finishRace();
                return;
            }
        }
        this.clearVisuals();
        this.createVisualCheckpoint(this.activeRace.path[this.checkpointIndex]);
    }

    finishRace() {
        this.statsManager.addWin();
        this.statsManager.addCash(this.activeRace.reward);
        this.statsManager.notify(`RACE FINISHED!`, 'lime');
        this.state = 'IDLE'; // Or FINISHED state for UI
        this.activeRace = null;
        this.clearVisuals();
    }

    createVisualCheckpoint(pos) {
        const mesh = new THREE.Mesh(this.markerGeometry, this.markerMaterial);
        mesh.position.set(pos.x, pos.y + 2, pos.z);
        mesh.rotation.x = Math.PI / 2;
        this.scene.add(mesh);
        this.visualCheckpoints.push(mesh);
    }

    clearVisuals() {
        this.visualCheckpoints.forEach(m => this.scene.remove(m));
        this.visualCheckpoints = [];
    }
}
