import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Base
 */
// Debug

const parameters = {
    animationIndex: 0,
}
const gui = new dat.GUI()
gui.add(parameters, 'animationIndex').min(0).max(2).step(1).onChange(() => { remove(); loadModel(); });

const remove = () => {
    while(scene.children.length > 0){
        scene.remove(scene.children[0]);
    }
}
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
 */
//DRACO models are almost half the size
const dracoLoader = new DRACOLoader();
const gltfLoader = new GLTFLoader();
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader);

let mixer = null;
let action = null;
let animations = null;

const loadModel = () => {
    gltfLoader.load(
        '/models/Fox/glTF/Fox.gltf',
        (gltf) => {
            //animation mixer
            mixer = new THREE.AnimationMixer(gltf.scene);
            gltf.animations = animations;
            action = mixer.clipAction(animations[parameters.animationIndex]);

            action.play();

            // while loop solution
            // while(gltf.scene.children.length){
            //     scene.add(gltf.scene.children[0])
            // }

            // duplicated array solution
            // const children = [...gltf.scene.children]
            // for(const child of children){
            //     scene.add(child);
            // }

            // Simplest (loads everything in the scene though, maybe more than you need)
            gltf.scene.scale.set(0.025,0.025,0.025);
            scene.add(gltf.scene);
        },
    )
}

loadModel();

/**
 * Floor
 */
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshStandardMaterial({
    color: '#444444',
    metalness: 0,
    roughness: 0.5
})

const floor = new THREE.Mesh( floorGeometry, floorMaterial );


floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5

// scene.add(floor)
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#ffffff')
/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //update mixer
    if(mixer !== null) mixer.update(deltaTime);

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()