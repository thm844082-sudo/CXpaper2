import * as THREE from 'three';

export function setupParticles(scene) {
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    // Distribute particles randomly in the scene
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 200;      // x
        positions[i * 3 + 1] = Math.random() * 50;           // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 200;  // z

        velocities.push({
            x: (Math.random() - 0.5) * 0.05,
            y: (Math.random() - 0.5) * 0.05,
            z: (Math.random() - 0.5) * 0.05
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.2,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const updateParticles = (deltaTime) => {
        const positions = particles.geometry.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
            // Apply velocities
            positions[i * 3] += velocities[i].x * deltaTime * 60;
            positions[i * 3 + 1] += velocities[i].y * deltaTime * 60;
            positions[i * 3 + 2] += velocities[i].z * deltaTime * 60;

            // Simulated wind drift
            positions[i * 3] += 0.02 * deltaTime * 60;

            // Wrap around logic to keep particles continuously flowing
            if (positions[i * 3] > 100) positions[i * 3] = -100;
            if (positions[i * 3 + 1] > 50 || positions[i * 3 + 1] < 0) {
                positions[i * 3 + 1] = Math.random() * 50;
            }
            if (positions[i * 3 + 2] > 100) positions[i * 3 + 2] = -100;
        }
        
        particles.geometry.attributes.position.needsUpdate = true;
    };

    return { updateParticles };
}
