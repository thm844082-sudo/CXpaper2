import * as THREE from 'three';

export function setupEnvironment(scene) {
    // Large ground plane for terrain
    const geometry = new THREE.PlaneGeometry(500, 500, 256, 256);
    geometry.rotateX(-Math.PI / 2);

    // Custom GLSL Shader for procedural terrain
    const customUniforms = {
        time: { value: 0.0 },
        colorLow: { value: new THREE.Color(0x2a3d1c) }, // Dark grass
        colorHigh: { value: new THREE.Color(0x526b38) }, // Light grass
        colorRock: { value: new THREE.Color(0x4a4a4a) }  // Rocky peaks
    };

    const material = new THREE.ShaderMaterial({
        uniforms: customUniforms,
        lights: true,
        vertexShader: `
            uniform float time;
            varying vec2 vUv;
            varying float vElevation;
            #include <common>
            #include <lights_pars_begin>
            #include <shadowmap_pars_vertex>
            
            // Basic pseudo-random noise function
            float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }
            float noise(vec2 x) {
                vec2 i = floor(x);
                vec2 f = fract(x);
                float a = hash(i);
                float b = hash(i + vec2(1.0, 0.0));
                float c = hash(i + vec2(0.0, 1.0));
                float d = hash(i + vec2(1.0, 1.0));
                vec2 u = f * f * (3.0 - 2.0 * f);
                return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
            }

            void main() {
                vUv = uv;
                
                // Procedural height generation
                float elevation = noise(position.xz * 0.05) * 15.0;
                elevation += noise(position.xz * 0.01) * 35.0; // Big hills
                
                // Wind effect on geometry
                elevation += sin(position.x * 0.5 + time) * 0.2;
                
                vElevation = elevation;
                vec3 newPosition = position + vec3(0.0, elevation, 0.0);
                
                vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                
                #include <shadowmap_vertex>
            }
        `,
        fragmentShader: `
            uniform vec3 colorLow;
            uniform vec3 colorHigh;
            uniform vec3 colorRock;
            varying vec2 vUv;
            varying float vElevation;
            #include <common>
            #include <lights_pars_begin>
            #include <shadowmap_pars_fragment>
            
            void main() {
                // Height based coloring
                vec3 finalColor = mix(colorLow, colorHigh, smoothstep(0.0, 15.0, vElevation));
                finalColor = mix(finalColor, colorRock, smoothstep(25.0, 40.0, vElevation));
                
                // Basic ambient lighting emulation
                float ambientShadow = smoothstep(-10.0, 20.0, vElevation);
                finalColor *= (0.6 + 0.4 * ambientShadow);
                
                gl_FragColor = vec4(finalColor, 1.0);
                
                #include <tonemapping_fragment>
                #include <colorspace_fragment>
            }
        `
    });

    const terrain = new THREE.Mesh(geometry, material);
    terrain.receiveShadow = true;
    scene.add(terrain);

    const updateEnvironment = (time) => {
        customUniforms.time.value = time;
    };

    return { updateEnvironment };
}
