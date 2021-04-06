import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import Stats from 'stats.js'

const parameters = {
    color1: 0xffffff,
    color2: 0xffffff,
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
 * Objects
 */
const geometry = new THREE.SphereGeometry(0.1,16,16);
const material = new THREE.MeshStandardMaterial({color: '#ff0000'})
material.roughness = 0.8
material.metalness = 0.3

let objects = []

for(let i = 0; i < 200; i++){
    let sphere = new THREE.Mesh(
        new THREE.SphereGeometry(Math.random()/2,16,16),
        material.clone(),
    )
    sphere.position.x = (Math.random() - 0.5) * 5
    sphere.position.y = (Math.random() - 0.5) * 50
    sphere.position.z = (Math.random() - 0.5) * 5
    objects[i] = sphere;
    console.log(sphere);
    scene.add(sphere);
}

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(parameters.color1, 1);
directionalLight.position.set(1, 0, 17);
directionalLight.lookAt(0,25,0)
scene.add(directionalLight);
// const directionalLight2 = new THREE.DirectionalLight(parameters.color2, 1);
// directionalLight2.position.set(1, 0, -17);
// directionalLight2.lookAt(0,25,0)
// scene.add(directionalLight2);
// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
// const directionalLightHelper2 = new THREE.DirectionalLightHelper(directionalLight2, 0.2);
// scene.add(directionalLightHelper, directionalLightHelper2);

// gui.addColor(parameters, 'color1').onChange(() => { directionalLight.color.set(parameters.color1)})
// gui.addColor(parameters, 'color2').onChange(() => { directionalLight2.color.set(parameters.color2)})
/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();

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
 * Mouse
 */
const mouse= new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1;
    mouse.y = - (event.clientY / sizes.height) * 2 + 1;
})

window.addEventListener('click', () => {
  if(currentIntersect){
      scene.remove(currentIntersect.object);
  }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
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
renderer.setClearColor('#ffffff')

/**
 * Animate
 */
const clock = new THREE.Clock()

let objectsToTest = null;

//witness variable for mousedown and mouseup events
let currentIntersect = null;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //cast a ray
    raycaster.setFromCamera(mouse, camera);

    let count = 0;
    let xCount = 0;
    let yCount = 0;
    for(const sphere of objects){
        // sphere.position.y = (Math.sin(elapsedTime * ((count%25) * 0.1)) * 10) + yCount%20;
        // sphere.position.x = (Math.cos(elapsedTime * ((count%25) * 0.1)) * 10);
        // sphere.position.z = (Math.sin(elapsedTime * ((count%25) * 0.1)) * 10);
        sphere.position.y = Math.sin(elapsedTime * (count * 0.01)) * 10;
        sphere.position.x = Math.cos(elapsedTime * (count * 0.01)) * 10;
        count = count + 1;
        xCount = xCount + 0.01;
        yCount = yCount + 0.01;
    }

    //animate lights
    directionalLight.position.x = Math.cos(elapsedTime * 2) * 10;
    directionalLight.position.z = Math.sin(elapsedTime * 2) * 10;
    directionalLight.position.y = -Math.sin(elapsedTime * 2) * 10;
    directionalLight.lookAt(0,25,0)

    // directionalLight2.position.x = - Math.cos(elapsedTime * 2) * 10;
    // directionalLight2.position.z = Math.sin(elapsedTime * 2) * 10;
    // directionalLight2.position.y = Math.sin(elapsedTime * 2) * 10;
    // directionalLight2.lookAt(0,25,0)

    // directionalLightHelper.position.x = Math.cos(elapsedTime) * 10;
    // directionalLightHelper.position.z = Math.sin(elapsedTime) * 10;
    //
    // directionalLightHelper2.position.x = - Math.cos(elapsedTime) * 10;
    // directionalLightHelper2.position.z =  Math.sin(elapsedTime) * 10;

    // const rayOrigin = new THREE.Vector3(-3, 0, 0);
    // const rayDirection = new THREE.Vector3(1,0,0);
    // rayDirection.normalize();
    // raycaster.set(rayOrigin, rayDirection);
    objectsToTest = objects;

    const intersects = raycaster.intersectObjects(objectsToTest)

    for(const object of objectsToTest){
        object.material.color.set('#fc4949')
    }

    for(const intersect of intersects){
        intersect.object.material.color.set('#2222f6');
    }

    if(intersects.length){
        //checks the mouse enter event, if there was no intersect and then there is, that is a mouse enter
        if(currentIntersect === null){
            console.log('mouse enter')
        }
        currentIntersect = intersects[0];
    } else {
        //checks the mouse enter event, if there was an intersect and then there isn't, that is a mouse leave
        if(currentIntersect){
            console.log('mouse leave');
        }
        currentIntersect = null;
    }
    // Update controls
    controls.update()
    // Render
    renderer.render(scene, camera)
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

setTimeout(() => {
    tick();
}, 200)