import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// Cursor
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5)
const material = new THREE.MeshBasicMaterial({color: 'purple'})
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh) // add the object in the scene

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height, 1, 3.4641016151377544) // objects look smaller the farther they are, like the human eye
// fov is the first param, usually between 75 and 145. Higher than that starts looking like a fish eye

// const aspectRadio = sizes.width / sizes.height
// console.log(aspectRadio)
// const camera = new THREE.OrthographicCamera(-1 * aspectRadio, 1 * aspectRadio, 1, -1, 0.1 , 100) // no perspective, objects keep the same size no matter how far they are. The aspect ratio on left/right keeps the cube from looking squashed

// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3

// console.log(camera.position.length())

// camera.lookAt(mesh.position)

scene.add(camera) // add the camera in the scene

// Controls
const controls = new OrbitControls(camera, canvas) // lets the mouse rotate the camera around a target. 
controls.enableDamping = true // makes the camera slow down smoothly instead of stopping instantly. Only works if controls.update() is called on every frame
// controls.target.y = 2
// controls.update()

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

// Clock
const clock = new THREE.Clock()

// Animations 
const tick = () => {
    // Clock
    const elapsedTime = clock.getElapsedTime()

    // Update object
    // mesh.rotation.y = elapsedTime;

    // Update camera
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
    // camera.position.y = cursor.y * 3
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3

    // camera.lookAt(mesh.position)

    // Update controls
    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
