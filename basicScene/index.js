//4 elements for a scene
// some objects, the scene, a camera, and a renderer

console.log(THREE);

//scene
//like a container, we put objects,models, lights, etc
const scene = new THREE.Scene();

const sizes = {
	width: 800,
	height: 600,
}

//camera
//field of view, aspect ratio
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height )
camera.position.z = 2

//objects
//can be primitive geometries, imported models, particles, lights, etc
//objects need MESH, a combination of a geometry (the shape) and a material (how it looks)
//start with a BoxGeometry and a MeshBasicMaterial

//red cube
const geometry = new THREE.BoxGeometry(1,1,1) //1 is 1 UNIT
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })

const redCubeMesh = new THREE.Mesh(geometry, material);

//add the red cube to the scene
scene.add(redCubeMesh);
scene.add(camera);

const canvas = document.querySelector('canvas.webgl')

//renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
})

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);