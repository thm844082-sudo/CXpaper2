import * as THREE from 'three';

export function setupEnvironment(scene) {
    const width = 300;
    const depth = 300;
    const segments = 128;

    const geometry = new THREE.PlaneGeometry(width, depth, segments, segments);
    geometry.rotateX(-Math.PI / 2);

    // Generate terrain heights on geometry directly
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        
        // Combine sine waves to create rolling hills
        const height = Math.sin(x * 0.03) * Math.cos(z * 0.03) * 10.0 
                     + Math.sin(x * 0.01) * Math.sin(z * 0.015) * 25.0;
        
        pos.setY(i, height);
    }
    
    // Recompute normals for accurate PBR lighting reflections
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
        color: 0x3d5e28,
        roughness: 0.8,
        metalness: 0.1,
        flatShading: true
    });

    const terrain = new THREE.Mesh(geometry, material);
    terrain.receiveShadow = true;
    terrain.castShadow = true;
    scene.add(terrain);

    const updateEnvironment = (time) => {
        // Keeps pipeline interface ready for animation hooks
    };

    return { updateEnvironment };
}
