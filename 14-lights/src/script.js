import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";

const paramaters = {
    color1: 0xff0000,
    color2: 0x0000ff,
    color3: 0x4e00ff
}
/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
//omnidirectional light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
directionalLight.position.set(1, 0.25, 0);

const hemisphereLight = new THREE.HemisphereLight(paramaters.color1, paramaters.color2, 0.3);

const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2)
pointLight.position.set(1, -0.5, 1)

//only works with meshStandardMaterial and meshPhysicalMaterial
const rectAreaLight = new THREE.RectAreaLight(paramaters.color3, 2, 3, 1);
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3(0,0,0))

const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1);
spotLight.position.set(0, 2, 3)

scene.add(ambientLight, directionalLight, hemisphereLight, pointLight, rectAreaLight, spotLight, spotLight.target);

spotLight.target.position.x = -0.75

//helpers
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
const spotLightHelper = new THREE.SpotLightHelper(spotLight)
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)

// scene.add(spotLightHelper, hemisphereLightHelper, directionalLightHelper, pointLightHelper, rectAreaLightHelper)

window.requestAnimationFrame(() => {
    spotLightHelper.update();
})

gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('ambient Intensity')
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001).name('directional Intensity')
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001)
gui.add(hemisphereLight, 'intensity').min(0).max(1).step(0.001).name('hemisphere Intensity')
gui.addColor(paramaters, 'color1').onChange(() => { hemisphereLight.color.set(paramaters.color1)})
gui.addColor(paramaters, 'color2').onChange(() => { hemisphereLight.groundColor.set(paramaters.color2)})
gui.add(pointLight, 'intensity').min(0).max(1).step(0.001).name('point Intensity')
gui.add(pointLight.position, 'x').min(-5).max(5).step(0.01)
gui.add(pointLight.position, 'y').min(-5).max(5).step(0.01)
gui.add(pointLight.position, 'z').min(-5).max(5).step(0.01)
gui.addColor(paramaters, 'color3').onChange(() => { rectAreaLight.color.set(paramaters.color3)})
gui.add(rectAreaLight.position, 'x').min(-5).max(5).step(0.01).onChange(() => { rectAreaLight.lookAt(new THREE.Vector3(0,0,0)) })
gui.add(rectAreaLight.position, 'y').min(-5).max(5).step(0.01).onChange(() => { rectAreaLight.lookAt(new THREE.Vector3(0,0,0)) })
gui.add(rectAreaLight.position, 'z').min(-5).max(5).step(0.01).onChange(() => { rectAreaLight.lookAt(new THREE.Vector3(0,0,0)) })
gui.add(spotLight, 'intensity').min(0).max(1).step(0.001).name('spotlight I');
gui.add(spotLight, 'distance').min(0).max(20).step(0.25).name('distance');
gui.add(spotLight.position, 'z').min(-10).max(10).step(0.1)
/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

gui.add(material, 'wireframe')

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()