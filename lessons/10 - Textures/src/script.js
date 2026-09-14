import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import door from './assets/textures/door/color.jpg'
import checkboard_1024 from './assets/textures/checkerboard-1024x1024.png'
import checkboard_8 from './assets/textures/checkerboard-8x8.png'
import minecraft from './assets/textures/minecraft.png'

// Textures
const loadingManager = new THREE.LoadingManager()

// loadingManager.onStart = () => {
//     console.log('onStart')
// }

// loadingManager.onProgress = () => {
//     console.log('onProgress')
// }


// loadingManager.onError = () => {
//     console.log('onError')
// }

const textureLoader = new THREE.TextureLoader(loadingManager)
const texture = textureLoader.load(minecraft)
texture.colorSpace = THREE.SRGBColorSpace // tell three.js the image is sRGB encoded (color textures only)

// texture.repeat.x = 2
// texture.repeat.y = 3
// texture.wrapS = THREE.RepeatWrapping
// texture.wrapT = THREE.RepeatWrapping

// texture.offset.x = 0.5
// texture.offset.y = 0.5

// texture.rotation = Math.PI

// texture.center.x = 0.5
// texture.center.y = 0.5

// texture.minFilter = THREE.NearestFilter
texture.magFilter = THREE.NearestFilter


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
// const geometry = new THREE.TorusGeometry(1, 0.50, 32, 10)
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
// console.log(geometry.attributes)
const material = new THREE.MeshBasicMaterial({ map: texture })
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
camera.position.x = 1
camera.position.y = 1
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

    // Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
