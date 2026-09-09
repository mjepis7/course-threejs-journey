import * as THREE from 'three'

// console.log(THREE)

// Canvas
const canvas = document.querySelector('canvas.webgl')
// console.log(canvas)

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(2, 2, 2)
const material = new THREE.MeshBasicMaterial({color: 'purple', wireframe: true})
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
