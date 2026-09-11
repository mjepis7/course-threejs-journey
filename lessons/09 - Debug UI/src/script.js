import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import gsap from 'gsap'

// Debug
const gui = new GUI({
    width: 300,
    title: 'Nice debug UI',
    closeFolders: true
})
// gui.close()
// gui.hide()

window.addEventListener('keydown', (event) => {
    if (event.key == 'd') {
        gui.show(gui._hidden) // // toggle: _hidden holds the current state
    }
})

const global = {} 

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
global.color = '#6600ff'

const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({color: global.color})
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh) // add the object in the scene

const cubeTweaks = gui.addFolder('Awesome Cube')
// cubeTweaks.close()

cubeTweaks.add(mesh.position, 'x')
    .min(-3)
    .max(3)
    .step(0.1)
    .name('horizontal')

cubeTweaks.add(mesh.position, 'y')
    .min(-3)
    .max(3)
    .step(0.1)
    .name('elevation')

cubeTweaks.add(mesh.position, 'z')
    .min(-3)
    .max(3)
    .step(0.1)
    .name('depth')

cubeTweaks.add(mesh, 'visible') // show or hide the object without removing it from the scene

cubeTweaks.add(material, 'wireframe') // see the triangles behind the geometry

cubeTweaks
    .addColor(global, 'color') // pick a new color for the object
    .onChange((value) => {
        material.color.set(global.color)
    })

global.spin = () => {
    gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2 })
}

cubeTweaks.add(global, 'spin')

global.subdivision = 2

cubeTweaks.add(global, 'subdivision')
    .min(1)
    .max(20)
    .step(1)
    .onFinishChange(() => {
        mesh.geometry.dispose() // free the old geometry from the GPU 
        mesh.geometry = new THREE.BoxGeometry(1, 1, 1, global.subdivision, global.subdivision, global.subdivision)
    })

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
