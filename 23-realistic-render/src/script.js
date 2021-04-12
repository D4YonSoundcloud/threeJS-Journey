import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {
    envMapIntensity: 5
};

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader()


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
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
directionalLight.position.set(0.25,3,-2.25)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(directionalLight, directionalLightHelper);

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity');
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('lightX');
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001).name('lightY');
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('lightZ');

const updateAllMaterials = () => {
    scene.traverse((child) => {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
            // child.material.envMap = environmentMapTexture;
            child.material.envMapIntensity = debugObject.envMapIntensity;
        }
    })
}

/**
 * update all Materials
 */
gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(() => updateAllMaterials());

/**
 * models
 */
gltfLoader.load(
    '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) => {
        console.log('succes')
        console.log(gltf);
        gltf.scene.scale.set(10,10,10);
        gltf.scene.position.set(0, -4, 0)
        gltf.scene.rotation.y = Math.PI * 0.5;
        scene.add(gltf.scene);

        gui.add(gltf.scene.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.001).name('rotationY');

        updateAllMaterials();
    }
)

/**
 * Environment Map
 */
const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])

environmentMapTexture.encoding = THREE.sRGBEncoding;
scene.background = environmentMapTexture;
scene.environment = environmentMapTexture;


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
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
renderer.physicallyCorrectLights = true;
//we usually use linear encoding;
//when we use the sRGBencoding, its like using the GammaEncoding with a default gamma factor of 2.2, which is the common value
renderer.outputEncoding = THREE.sRGBEncoding;

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // directionalLight.lookAt(testSphere)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()