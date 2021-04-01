import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
const gui = new dat.GUI;
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene = new THREE.Scene()

//load images
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load('/textures/door/color.jpg');
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const heightTexture = textureLoader.load('/textures/door/height.jpg');
const normalTexture = textureLoader.load('/textures/door/normal.jpg');
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
const matcapTexture = textureLoader.load('/textures/matcaps/7.png')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;

const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMapTexture = cubeTextureLoader.load([
    //positiveX -> negativeX, positiveY -> negativeY, positiveZ -> negativeZ
    'textures/environmentMaps/0/px.jpg',
    'textures/environmentMaps/0/nx.jpg',
    'textures/environmentMaps/0/py.jpg',
    'textures/environmentMaps/0/ny.jpg',
    'textures/environmentMaps/0/pz.jpg',
    'textures/environmentMaps/0/nz.jpg',
])


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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
 * Objects
 */
// const material = new THREE.MeshBasicMaterial()
// material.map = colorTexture;
// material.color = new THREE.Color(0x00ff00)
// material.alphaMap = alphaTexture;
// material.side = THREE.DoubleSide;

// const material = new THREE.MeshNormalMaterial();

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// const material = new THREE.MeshDepthMaterial()

// const material = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color(0x1188ff)

// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradientTexture;
// const material = new THREE.MeshStandardMaterial();
// material.metalness = 0.45;
// material.roughness = 0.65;
// material.map = colorTexture;
// material.aoMap = ambientOcclusionTexture;
// material.displacementMap = heightTexture;
// material.displacementScale = 0.05;
// material.metalnessMap = metalnessTexture;
// material.roughnessMap = roughnessTexture;
// material.normalMap = normalTexture;
// material.transparent = true;
// material.alphaMap = alphaTexture;

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.envMap = environmentMapTexture;

const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5,64,64), material)
sphere.position.x = -1.5;
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1,1, 100, 100), material)
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))

const torus = new THREE.Mesh(new THREE.TorusBufferGeometry(0.3,0.2,64,128), material)
torus.position.x = 1.5
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))

scene.add(sphere, plane, torus);

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight)

/**
 * debug
 */
// gui.add(material, 'wireframe')
// gui.add(material, 'transparent')
// gui.add(material, 'opacity').min(0).max(1);
gui.add(material, 'metalness').min(0).max(1).step(0.0001);
gui.add(material, 'roughness').min(0).max(1).step(0.0001);
gui.add(material, 'wireframe')
// gui.add(material, 'aoMapIntensity').min(0).max(10)
// gui.add(material, 'displacementScale').min(0).max(1).step(0.0001)

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

    sphere.rotation.y = 0.1 * elapsedTime;
    plane.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;

    sphere.rotation.x = 0.15 * elapsedTime;
    plane.rotation.x = -0.15 * elapsedTime;
    torus.rotation.x = 0.15 * elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()