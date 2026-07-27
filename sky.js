import * as THREE from 'three';

export function setupSky(scene) {
    const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x2e3f1e, 0.8);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.5);
    sunLight.position.set(100, 100, -50);
    sunLight.castShadow = true;
    
    // Shadow Map Tuning
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 500;
    sunLight.shadow.camera.left = -100;
    sunLight.shadow.camera.right = 100;
    sunLight.shadow.camera.top = 100;
    sunLight.shadow.camera.bottom = -100;
    scene.add(sunLight);

    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffffee });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sunMesh);

    scene.fog = new THREE.FogExp2(0xaaccff, 0.005);

    const updateSky = (deltaTime, time) => {
        const cycleSpeed = 0.05; 
        // + Math.PI / 2 forces time to start at high noon instead of midnight
        const dayTime = (time * cycleSpeed) + (Math.PI / 2); 

        const sunX = Math.cos(dayTime) * 200;
        const sunY = Math.sin(dayTime) * 200;
        const sunZ = Math.sin(dayTime * 0.5) * 50 - 50;

        sunLight.position.set(sunX, sunY, sunZ);
        sunMesh.position.copy(sunLight.position);

        const sunHeight = Math.max(-1, Math.min(1, sunY / 150)); 

        if (sunHeight > 0.1) {
            // Daytime
            scene.background = new THREE.Color().lerpColors(new THREE.Color(0x87CEEB), new THREE.Color(0x4a90e2), sunHeight);
            hemiLight.intensity = 0.8;
            scene.fog.color.setHex(0xaaccff);
            sunLight.color.setHex(0xfffaed);
            sunLight.intensity = 2.5 * sunHeight;
        } else if (sunHeight > -0.1) {
            // Sunset
            scene.background = new THREE.Color(0xff7700);
            hemiLight.intensity = 0.4;
            scene.fog.color.setHex(0xffaa77);
            sunLight.color.setHex(0xff4400);
            sunLight.intensity = 1.0;
        } else {
            // Night
            scene.background = new THREE.Color(0x050515);
            hemiLight.intensity = 0.15;
            scene.fog.color.setHex(0x050515);
            sunLight.intensity = 0;
        }
    };

    return { updateSky };
}
