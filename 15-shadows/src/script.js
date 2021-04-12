import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const textureLoader = new THREE.TextureLoader()
const simpleShadow = textureLoader.load('textures/simpleShadow.jpg')

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(2, 2, - 1)
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 8;
// directionalLight.shadow.radius = 10;

const directionalLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera);

//spotLight
const spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3);
spotLight.castShadow = true;
spotLight.position.set(0, 2, 2)
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.fov = 35;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)

const pointLight = new THREE.PointLight(0xffffff, 0.3);
pointLight.castShadow = true;
pointLight.position.set(-1,1,0);
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;


const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);

gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
gui.add(directionalLightHelper, 'visible');
gui.add(spotLightCameraHelper, 'visible');
gui.add(pointLightCameraHelper, 'visible');
scene.add(directionalLight, directionalLightHelper, spotLight, spotLight.target, spotLightCameraHelper, pointLight, pointLightCameraHelper);

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
const sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere2.scale.x = 0.25;
sphere2.scale.y = 0.25;
sphere2.scale.z = 0.25;
const sphere3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.receiveShadow = true
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5

const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow,
    })
)
const sphereShadow2 = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow,
    })
)
const sphereShadow3 = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow,
    })
)

sphereShadow.rotation.x = - Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.01
sphereShadow2.rotation.x = - Math.PI * 0.5;
sphereShadow2.position.y = plane.position.y + 0.01
sphereShadow3.rotation.x = - Math.PI * 0.5;
sphereShadow3.position.y = plane.position.y + 0.01


scene.add(sphere, sphere2,  plane, sphereShadow, sphereShadow2,)

gui.add(sphere.position, 'x').min(- 5).max(5).step(0.001).onChange()
gui.add(sphere.position, 'y').min(- 5).max(5).step(0.001)
gui.add(sphere.position, 'z').min(- 5).max(5).step(0.001)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    sphere.position.x = Math.cos(elapsedTime) * 1.5;
    sphere.position.z = Math.sin(elapsedTime) * 1.5;
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

    sphere2.position.x = Math.cos(elapsedTime) * 1.5;
    sphere2.position.z = Math.sin(elapsedTime) * 1.5;
    sphere2.position.y = Math.abs(Math.sin(elapsedTime * 0.5));

    // sphere3.position.x = Math.cos(elapsedTime) * 1.5;
    // sphere3.position.z = Math.sin(elapsedTime) * 3;
    // sphere3.position.y = Math.abs(Math.sin(elapsedTime * 3));

    sphereShadow.position.x = sphere.position.x;
    sphereShadow.position.z = sphere.position.z;
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.5

    sphereShadow2.position.x = sphere2.position.x;
    sphereShadow2.position.z = sphere2.position.z;
    sphereShadow2.material.opacity = (1 - sphere2.position.y) * 0.5

    // sphereShadow3.position.x = sphere3.position.x;
    // sphereShadow3.position.z = sphere3.position.z;
    // sphereShadow3.material.opacity = (1 - sphere3.position.y) * 0.5

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()