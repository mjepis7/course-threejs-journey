import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

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
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // console.log('window has been resized')

    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer 
    renderer.setSize(sizes.width, sizes.height)
})

window.addEventListener('dblclick', () => {
    // console.log('double click')

    if (!document.fullscreenElement)
    {
        // console.log('go to fullscreen')
        canvas.requestFullscreen()
    } else {
        // console.log('leave fullscreen')
        document.exitFullscreen()
    }

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

// Animations 
const tick = () => {
    // Clock
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()

