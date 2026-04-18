import * as THREE from 'three';
import { PoliceAI } from './PoliceAI';

export class PursuitSystem {
    constructor(scene, physicsWorld, playerVehicle, statsManager) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        this.playerVehicle = playerVehicle;
        this.statsManager = statsManager;

        this.heat = 1.0; // 1 to 5
        this.state = 'IDLE'; // IDLE, CHASING, EVADING, ESCAPED
        
        this.policeCars = [];
        this.maxPolice = 5;
        
        this.cooldownTimer = 0;
        this.cooldownDuration = 10; // Seconds to escape
        
        this.lastSpawnTime = 0;
        this.spawnInterval = 5000; // 5 seconds

        this.raycaster = new THREE.Raycaster();
        
        this.ui = {
            heatElement: document.getElementById('heat-level'),
            statusElement: document.getElementById('pursuit-status')
        };
    }

    update(dt) {
        const playerPos = this.playerVehicle.chassisBody.position;
        const playerVelocity = this.playerVehicle.chassisBody.velocity;
        const playerSpeed = playerVelocity.length() * 3.6;

        // Auto-trigger pursuit at high speed
        if (this.state === 'IDLE' && playerSpeed > 120) {
            this.startPursuit();
        }

        if (this.state === 'IDLE') return;

        // Update Heat based on speed and duration
        if (this.state === 'CHASING') {
            this.heat = Math.min(5, this.heat + 0.0001 * playerSpeed * dt);
        }

        // Line of Sight (LOS) Check
        const hasLOS = this.checkLineOfSight();
        const distanceToPlayer = playerPos.distanceTo(new THREE.Vector3(0,0,0)); // Placeholder

        // State Machine
        if (this.state === 'CHASING') {
            if (!hasLOS) {
                this.state = 'EVADING';
                this.cooldownTimer = this.cooldownDuration;
            }
        } else if (this.state === 'EVADING') {
            if (hasLOS) {
                this.state = 'CHASING';
            } else {
                this.cooldownTimer -= dt;
                if (this.cooldownTimer <= 0) {
                    this.state = 'ESCAPED';
                    this.calculateAndAwardBounty();
                    setTimeout(() => this.resetPursuit(), 3000);
                }
            }
        }

        // Spawning
        const now = Date.now();
        if (this.state === 'CHASING' && this.policeCars.length < Math.floor(this.heat) + 1) {
            if (now - this.lastSpawnTime > this.spawnInterval) {
                this.spawnPolice();
                this.lastSpawnTime = now;
            }
        }

        // Update AI
        this.policeCars.forEach(police => {
            police.update(dt, playerPos, playerVelocity);
        });

        this.updateUI();
    }

    startPursuit() {
        this.state = 'CHASING';
        this.heat = 1.0;
        console.log("PURSUIT STARTED");
    }

    resetPursuit() {
        this.state = 'IDLE';
        this.heat = 1.0;
        this.pursuitStartTime = 0;
        // Clean up police cars
        this.policeCars.forEach(p => p.destroy());
        this.policeCars = [];
    }

    calculateAndAwardBounty() {
        if (!this.statsManager) return;

        // Bounty = (Base 100) * Heat * (Police Hits + 1)
        const base = 100;
        const multiplier = this.heat;
        const hits = Math.floor(Math.random() * 5); // Simulating hits for now
        
        const bountyReward = base * multiplier * (hits + 1);
        this.statsManager.addBounty(bountyReward);

        // Cash Reward = $500 - $2000 based on heat
        const cashReward = 500 + (this.heat / 5) * 1500;
        this.statsManager.addCash(cashReward);
    }

    checkLineOfSight() {
        // Simple raycast from player to any police or from police to player
        // For now, let's use a distance-based simplified LOS
        let visible = false;
        this.policeCars.forEach(p => {
            const dist = p.body.position.distanceTo(this.playerVehicle.chassisBody.position);
            if (dist < 100) visible = true; // Simple radius for now
        });
        return visible || this.policeCars.length === 0;
    }

    spawnPolice() {
        const playerPos = this.playerVehicle.chassisBody.position;
        const playerDir = new THREE.Vector3(0,0,1).applyQuaternion(this.playerVehicle.chassisBody.quaternion);
        
        // Random spawn offset (ahead, behind, or side)
        const spawnPoints = [
            playerDir.clone().multiplyScalar(50), // Ahead
            playerDir.clone().multiplyScalar(-50), // Behind
            new THREE.Vector3(1,0,0).applyQuaternion(this.playerVehicle.chassisBody.quaternion).multiplyScalar(50) // Side
        ];
        
        const offset = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
        const spawnPos = new THREE.Vector3(playerPos.x, playerPos.y, playerPos.z).add(offset);
        
        const roles = ['CHASER', 'BLOCKER', 'AGGRESSOR'];
        const role = roles[Math.floor(Math.random() * roles.length)];
        
        const police = new PoliceAI(this.scene, this.physicsWorld, spawnPos, role);
        this.policeCars.push(police);
    }

    updateUI() {
        if (this.ui.heatElement) this.ui.heatElement.innerText = `HEAT: ${this.heat.toFixed(1)}`;
        if (this.ui.statusElement) {
            this.ui.statusElement.innerText = this.state;
            this.ui.statusElement.className = this.state.toLowerCase();
        }
    }
}
