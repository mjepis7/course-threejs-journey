import * as THREE from 'three'

// console.log(THREE)

// Canvas
const canvas = document.querySelector('canvas.webgl')
// console.log(canvas)

// Scene
const scene = new THREE.Scene()

// Object
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({color: 'purple'})
// const mesh = new THREE.Mesh(geometry, material)

// scene.add(mesh) // add the object in the scene

// // Position
// mesh.position.set(- 0.9, 0.3, 1)

// // mesh.position.x = 0.9
// // mesh.position.y = - 0.3
// // mesh.position.z = 1

// // console.log(mesh.position.length()) // gives the distance between the position and the center of the scene
// // console.log(mesh.position.normalize()) // makes the vector's length equal to 1

// // Scale 
// mesh.scale.set(0.3, 0.9, 0.1)

// // mesh.scale.x = 0.3
// // mesh.scale.y = 0.9
// // mesh.scale.z = 0.1

// // Rotation
// mesh.rotation.reorder('YXZ') // changes the order the rotations are applied. Only takes effect if set before the angles above
// mesh.rotation.x = 2.14159
// mesh.rotation.y = 5.14159
// mesh.rotation.z = Math.PI * 0.25

// Group
const group = new THREE.Group()

const cube_one = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'purple' })
)

const cube_two = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'blue' })
)

const cube_three = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'green' })
)

group.add(cube_one)
group.add(cube_two)
group.add(cube_three)

cube_two.position.x = - 2
cube_three.position.x = 2
group.position.y = 1
group.scale.z = 2
group.rotation.x = 1

scene.add(group) // add the group in the scene

// Axes helper
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3

scene.add(camera) // add the camera in the scene

// console.log(mesh.position.distanceTo(camera.position)) // gives the distance betwwen the camera and the object

// camera.lookAt(mesh.position)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
