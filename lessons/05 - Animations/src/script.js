import * as THREE from 'three'
import gsap from 'gsap'

console.log(gsap)

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({color: 'purple'})
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh) // add the object in the scene

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3

scene.add(camera) // add the camera in the scene

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

// Clock
// const clock = new THREE.Clock()

gsap.to(mesh.position, {
    x: 2,
    duration: 1,
    delay: 1
})

gsap.to(mesh.position, {
    x: -2,
    duration: 1,
    delay: 2.5
})

// Animations 
const tick = () => {
    // Clock
    // const elapsedTime = clock.getElapsedTime()
    // console.log(elapsedTime)

    // Update object
    // mesh.rotation.x += 0.002 
    // mesh.rotation.y = elapsedTime * Math.PI * 2
    // mesh.scale.z += 0.001 
    // camera.position.x = -Math.cos(elapsedTime)
    // camera.position.y = Math.sin(elapsedTime)
    // camera.lookAt(mesh.position)

    renderer.render(scene, camera) // render

    window.requestAnimationFrame(tick)
}

tick()
