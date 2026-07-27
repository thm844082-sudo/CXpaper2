import * as THREE from 'three';

export function setupCamera() {
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 15, 40);
    
    // Parallax targets
    const targetPosition = new THREE.Vector3(0, 15, 40);
    const targetLookAt = new THREE.Vector3(0, 10, 0);
    const currentLookAt = new THREE.Vector3(0, 10, 0);

    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (event) => {
        // Normalize mouse coordinates (-1 to 1)
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    const updateCamera = (deltaTime, elapsedTime) => {
        // Idle floating animation
        const floatY = Math.sin(elapsedTime * 0.5) * 2;
        const floatX = Math.cos(elapsedTime * 0.3) * 1.5;

        // Mouse Parallax influence
        targetPosition.x = floatX + (mouseX * 5);
        targetPosition.y = 15 + floatY + (mouseY * 2);

        // Smooth interpolation for cinematic feel
        camera.position.lerp(targetPosition, 2.0 * deltaTime);
        
        // Dynamic look at
        targetLookAt.x = mouseX * 2;
        targetLookAt.y = 10 + (mouseY * 1);
        currentLookAt.lerp(targetLookAt, 3.0 * deltaTime);
        
        camera.lookAt(currentLookAt);
    };

    return { camera, updateCamera };
}
