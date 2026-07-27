import * as THREE from 'three';
import { setupRenderer, setupPostProcessing, handleResize } from './renderer.js';
import { setupCamera } from './camera.js';
import { setupSky } from './sky.js';
import { setupEnvironment } from './environment.js';
import { setupParticles } from './particles.js';

// 1. Core Setup
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// 2. Initialize Subsystems
const renderer = setupRenderer(canvas);
const { camera, updateCamera } = setupCamera();
const composer = setupPostProcessing(renderer, scene, camera);
handleResize(renderer, camera, composer);

const { updateSky } = setupSky(scene);
const { updateEnvironment } = setupEnvironment(scene);
const { updateParticles } = setupParticles(scene);

// 3. Time Management
const clock = new THREE.Clock();

// 4. Main Render Loop
function animate() {
    requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Update all systems
    updateCamera(deltaTime, elapsedTime);
    updateSky(deltaTime, elapsedTime);
    updateEnvironment(elapsedTime);
    updateParticles(deltaTime);

    // Render through Post-Processing Composer (not the raw renderer)
    composer.render();
}

// Start Engine
animate();
