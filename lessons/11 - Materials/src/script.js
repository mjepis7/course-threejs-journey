import * as THREE from 'three'
import GUI from 'lil-gui'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'

import doorColor from './assets/textures/door/color.jpg'
import doorAlpha from './assets/textures/door/alpha.jpg'
import doorAmbientOcclusion from './assets/textures/door/ambientOcclusion.jpg'
import doorHeight from './assets/textures/door/height.jpg'
import doorNormal from './assets/textures/door/normal.jpg'
import doorMetalness from './assets/textures/door/metalness.jpg'
import doorRoughness from './assets/textures/door/roughness.jpg'
import mathcaps from './assets/textures/matcaps/8.png'
import gradient from './assets/textures/gradients/3.jpg'
import hdr from './assets/textures/environmentMap/2k.hdr'

console.log(HDRLoader)

// Debug UI
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load(doorColor)
const doorAlphaTexture = textureLoader.load(doorAlpha)
const doorAmbientOcclusionTexture = textureLoader.load(doorAmbientOcclusion)
const doorHeightTexture = textureLoader.load(doorHeight)
const doorNormalTexture = textureLoader.load(doorNormal)
const doorMetalnessTexture = textureLoader.load(doorMetalness)
const doorRoughnessTexture = textureLoader.load(doorRoughness)
const matcapsTexture = textureLoader.load(mathcaps)
const gradientTexture = textureLoader.load(gradient)

doorColorTexture.colorSpace = THREE.SRGBColorSpace
matcapsTexture.colorSpace = THREE.SRGBColorSpace

// Object
// MeshBasicMaterial
// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture
// material.color = new THREE.Color('purple')
// material.wireframe = true
// material.transparent = true
// material.opacity = 0.5
// material.alphaMap = doorAlphaTexture
// material.side = THREE.DoubleSide

// MeshNormalMaterial
// const material = new THREE.MeshNormalMaterial()
// material.wireframe = true
// material.flatShading = true

// MeshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapsTexture 

// MashDepthMaterial
// const material = new THREE.MeshDepthMaterial()

// MeshLambertMaterial
// const material = new THREE.MeshLambertMaterial()

// MeshPhongMaterial
// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color('blue')

// MeshToonMaterial
// const material = new THREE.MeshToonMaterial()
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// material.gradientMap = gradientTexture

// MeshStandardMaterial
// const material = new THREE.MeshStandardMaterial()
// material.metalness = 0.7
// material.roughness = 0.2
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// // material.wireframe = true
// material.displacementScale = 0.1
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)
// material.transparent = true
// material.alphaMap = doorAlphaTexture

// gui.add(material, 'metalness').min(0).max(1).step(0.001)
// gui.add(material, 'roughness').min(0).max(1).step(0.001)

// MeshPhysicalMaterial
const material = new THREE.MeshPhysicalMaterial()
material.metalness = 0
material.roughness = 0
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// // material.wireframe = true
// material.displacementScale = 0.1
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)
// material.transparent = true
// material.alphaMap = doorAlphaTexture

gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

// Clearcoat
// material.clearcoat = 1
// material.clearcoatRoughness = 0

// gui.add(material, 'clearcoat').min(0).max(1).step(0.01)
// gui.add(material, 'clearcoatRoughness').min(0).max(1).step(0.01)

//Shen
// material.sheen = 1
// material.sheenRoughness = 0.25
// material.sheenColor.set(1, 1, 1)

// gui.add(material, 'sheen').min(0).max(1).step(0.001)
// gui.add(material, 'sheenRoughness').min(0).max(1).step(0.001)
// gui.addColor(material, 'sheenColor')

// Iridescence
// material.iridescence = 1
// material.iridescenceIOR = 1
// material.iridescenceThicknessRange = [100, 800]

// gui.add(material, 'iridescence').min(0).max(1).step(0.001)
// gui.add(material, 'iridescenceIOR').min(0).max(2.333).step(0.001)
// gui.add(material.iridescenceThicknessRange, '0').min(1).max(1000).step(1)
// gui.add(material.iridescenceThicknessRange, '1').min(1).max(1000).step(1)

// Transmission
material.transmission = 1
material.ior = 1.5
material.thickness = 0.5

gui.add(material, 'transmission').min(0).max(1).step(0.001)
gui.add(material, 'ior').min(1).max(10).step(0.001)
gui.add(material, 'thickness').min(0).max(1).step(0.001)

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64,64), 
    material
)

sphere.position.x = - 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material
)

torus.position.x = 1.5

scene.add(sphere, plane, torus) // add the objects in the scene

// Lights
// const ambientLight = new THREE.AmbientLight('white', 1)

// const pointLight = new THREE.PointLight('purple', 30)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4

// scene.add(ambientLight, pointLight) // add the lights in the scene

// Enviroment map
const hdrLoader = new HDRLoader()
hdrLoader.load(hdr, (environmentMap) => {
    // console.log(enviromentMap)
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.environment = environmentMap
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

    // Update objects
    sphere.rotation.x = 0.1 * elapsedTime
    plane.rotation.x = 0.1 * elapsedTime
    torus.rotation.x = 0.1 * elapsedTime

    sphere.rotation.y = - 0.15 * elapsedTime
    plane.rotation.y = - 0.15 * elapsedTime
    torus.rotation.y = - 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
