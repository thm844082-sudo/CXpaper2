import * as THREE from 'three';

export function setupSky(scene) {
    // Hemispheric ambient light (Sky color, Ground color, Intensity)
    const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x2e3f1e, 0.6);
    scene.add(hemiLight);

    // Directional Light (The Sun)
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.5);
    sunLight.position.set(100, 100, -50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 500;
    sunLight.shadow.camera.left = -100;
    sunLight.shadow.camera.right = 100;
    sunLight.shadow.camera.top = 100;
    sunLight.shadow.camera.bottom = -100;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Visual Sun Sphere
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffffee });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sunMesh);

    scene.fog = new THREE.FogExp2(0xaaccff, 0.005);

    const updateSky = (deltaTime, time) => {
        // Slow down time for cinematic wallpaper feel (1 cycle every ~10 minutes)
        const cycleSpeed = 0.05; 
        const dayTime = time * cycleSpeed;

        // Calculate Sun Position
        const sunX = Math.cos(dayTime) * 200;
        const sunY = Math.sin(dayTime) * 200;
        const sunZ = Math.sin(dayTime * 0.5) * 50 - 100;

        sunLight.position.set(sunX, sunY, sunZ);
        sunMesh.position.copy(sunLight.position);

        // Normalize sun height for color grading (-1 is midnight, 1 is noon)
        const sunHeight = Math.max(-1, Math.min(1, sunY / 150)); 

        if (sunHeight > 0.2) {
            // Day
            scene.background = new THREE.Color().lerpColors(new THREE.Color(0x87CEEB), new THREE.Color(0x4a90e2), sunHeight);
            hemiLight.intensity = 0.8;
            scene.fog.color.setHex(0xaaccff);
            scene.fog.density = 0.005;
            sunLight.color.setHex(0xfffaed);
            sunLight.intensity = 2.5 * sunHeight;
        } else if (sunHeight > 0.0) {
            // Sunset / Golden Hour
            const blend = sunHeight / 0.2;
            scene.background = new THREE.Color().lerpColors(new THREE.Color(0xff8c00), new THREE.Color(0x87CEEB), blend);
            hemiLight.intensity = 0.4 + (blend * 0.4);
            scene.fog.color.setHex(0xffaa77);
            scene.fog.density = 0.008;
            sunLight.color.setHex(0xff7700);
            sunLight.intensity = 2.0 * blend;
        } else {
            // Night
            const nightBlend = Math.abs(Math.max(-0.2, sunHeight) / 0.2);
            scene.background = new THREE.Color().lerpColors(new THREE.Color(0x0a0a2a), new THREE.Color(0xff8c00), 1.0 - nightBlend);
            hemiLight.intensity = 0.1;
            scene.fog.color.setHex(0x050511);
            scene.fog.density = 0.01;
            sunLight.intensity = 0; // Turn off sun
        }
    };

    return { updateSky };
}
