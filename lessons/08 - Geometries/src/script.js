import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
// const positionsArray = new Float32Array([
//     0, 0, 0,
//     0, 1, 0,
//     1, 0, 0
// ])

// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)

// const count = 500
// const positionsArray = new Float32Array(count * 3 * 3)

// for(let i = 0; i < count * 3 * 3; i++) {
//     positionsArray[i] = (Math.random() - 0.5) * 4
// }

// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)

// const geometry = new THREE.BufferGeometry()
// geometry.setAttribute('position', positionsAttribute)

// const geometry = new THREE.BoxGeometry(1, 1, 1, 7, 7, 7)
const geometry = new THREE.SphereGeometry(1, 50, 25)
const material = new THREE.MeshBasicMaterial({color: 'purple', wireframe: true})
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh) // add the object in the scene

// Sizes
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

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3

scene.add(camera) // add the camera in the scene

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Clock
const clock = new THREE.Clock()

const tick = () =>
{
    // Clock
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
