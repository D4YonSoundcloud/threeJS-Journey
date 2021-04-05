import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({width: 300})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy
 */
const parameters = {
    count: 100000,
    size: 0.01,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: '#ff6030',
    outsideColor: '#1b3984',
}

let geometry = null;
let material = null;
let points = null;
let galaxy = new THREE.Group();

const generateGalaxy = () => {
    //Destroy all galaxies
    if(points !== null){
        //dispose will free the memory created by the object
        geometry.dispose();
        material.dispose();
        //you have to remove the mesh from the scene to remove memory created by it (though it is very tiny)
        galaxy.remove(points);
    }
    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for(let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        const radius = Math.random() * parameters.radius
        //spin angle will decide how much to "spin" the particle based on its distance from the center of the galaxy
        const spinAngle = radius * parameters.spin;
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

        // + randomness to the axis in both directions * the parameter randomness
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1: -1);
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1: -1);
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1: -1);

        positions[i3    ] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY / 8;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / parameters.radius);

        colors[i3    ] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    /**
     * Geometry
     */
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
    })

    /**
     * Points
     */
    points = new THREE.Points(geometry, material);
    galaxy.add(points);
}

generateGalaxy();
scene.add(galaxy);

gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(() => { generateGalaxy() });
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(() => { generateGalaxy() });
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(() => { generateGalaxy() });
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(() => { generateGalaxy() });
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(() => { generateGalaxy() });
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(() => { generateGalaxy() });
gui.add(parameters, 'randomnessPower').min(1).max(10).step(1).onFinishChange(() => { generateGalaxy() });
gui.addColor(parameters, 'insideColor').onFinishChange(() => { generateGalaxy() })
gui.addColor(parameters, 'outsideColor').onFinishChange(() => { generateGalaxy() })

// const points = new THREE.Points(generateGalaxy(), particlesMaterial);
//
// scene.add(points);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //rotate galaxy
    galaxy.rotation.y = elapsedTime / 8;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()