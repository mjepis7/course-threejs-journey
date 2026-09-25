import * as THREE from 'three'
import GUI from 'lil-gui'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Debug
const gui = new GUI({closeFolders: true})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const starParticleTexture = textureLoader.load('/textures/particles/9.png')

/**
 * Particles
 */
// Geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 25000

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

// console.log(particlesGeometry.attributes)

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    // color: '#6600ff',
    transparent: true,
    alphaMap: starParticleTexture,
    // alphaTest: 0.01,
    // depthTest: false, // skips the "is something in front of me?" check, so particles show through solid objects
    depthWrite: false, // doesn't record its depth, so transparent edges stop hiding the particles drawn after it
    blending: THREE.AdditiveBlending,
    vertexColors: true
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

// Debug
const wave = {
    amplitude: 1,
    frequency: 1,
    speed: 1
}

const materialFolder = gui.addFolder('Material')
materialFolder.add(particlesMaterial, 'size').min(0.01).max(1).step(0.01)
materialFolder.add(particlesMaterial, 'depthWrite')
materialFolder.add(particlesMaterial, 'blending', {
    Normal: THREE.NormalBlending,
    Additive: THREE.AdditiveBlending
})

const waveFolder = gui.addFolder('Wave')
waveFolder.add(wave, 'amplitude').min(0).max(5).step(0.01)
waveFolder.add(wave, 'frequency').min(0).max(5).step(0.01)
waveFolder.add(wave, 'speed').min(0).max(5).step(0.01)

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
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 8
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

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0
let wavePhase = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Accumulate phase so changing speed doesn't make the wave jump
    wavePhase += deltaTime * wave.speed

    // Update particles
    // particles.rotation.x = elapsedTime * 0.2

    for (let i = 0; i < count; i++) {
        const i3 = i * 3

        const x = particlesGeometry.attributes.position.array[i3]
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(wavePhase + x * wave.frequency) * wave.amplitude
    }

    particlesGeometry.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
