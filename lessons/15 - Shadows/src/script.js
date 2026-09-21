import * as THREE from 'three'
import GUI from 'lil-gui'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import bakedShadow from './assets/textures/bakedShadow.jpg'
import simpleShadow from './assets/textures/simpleShadow.jpg'

// Textures
const textureLoader = new THREE.TextureLoader()

const bakedShadowTexture = textureLoader.load(bakedShadow)
bakedShadowTexture.colorSpace = THREE.SRGBColorSpace
const simpleShadowTexture = textureLoader.load(simpleShadow)

// Debug
const gui = new GUI({title: 'Shadows', closeFolders: true})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Lights

// Ambient light 
const ambientLight = new THREE.AmbientLight('#ffffff', 0.4)

const ambientLightFolder = gui.addFolder('Ambient Light')
ambientLightFolder.add(ambientLight, 'intensity').min(0).max(3).step(0.001)

// Directional light 
const directionalLight = new THREE.DirectionalLight('#ffffff', 2.5)
directionalLight.position.set(2, 2, - 1)
directionalLight.castShadow = true

// Shadow map size - the resolution of the texture the shadow is rendered into. Powers of two only
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024

// Shadow camera - the light renders the scene from its own point of view. Anything outside this box gets no shadow
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = - 2
directionalLight.shadow.camera.left = - 2
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6

// directionalLight.shadow.radius = 10 // blurs the shadow, but it's ignored by PCFSoftShadowMap

const directionalLightFolder = gui.addFolder('Directional Light')
directionalLightFolder.add(directionalLight, 'intensity').min(0).max(5).step(0.001)
directionalLightFolder.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
directionalLightFolder.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
directionalLightFolder.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)

// Spot light
const spotLight = new THREE.SpotLight('#ffffff', 3.6, 10, Math.PI * 0.3)
spotLight.position.set(0, 2, 2)
spotLight.castShadow = true

spotLight.shadow.mapSize.width = 1024 
spotLight.shadow.mapSize.height = 1024 

spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6

const spotLightFolder = gui.addFolder('Spot Light')
spotLightFolder.add(spotLight, 'intensity').min(0).max(30).step(0.001)
spotLightFolder.add(spotLight.position, 'x').min(- 5).max(5).step(0.001)
spotLightFolder.add(spotLight.position, 'y').min(- 5).max(5).step(0.001)
spotLightFolder.add(spotLight.position, 'z').min(- 5).max(5).step(0.001)

// Point light
const pointLight = new THREE.PointLight('#ffffff', 2.7)
pointLight.position.set(-1, 1, 0)
pointLight.castShadow = true

pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024

pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5

scene.add(ambientLight, directionalLight, spotLight, pointLight) // add the lights in the scene
scene.add(spotLight.target)

// Light helpers
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false

const cameraHelperFolder = gui.addFolder('Camera helper')
cameraHelperFolder.add(directionalLightCameraHelper, 'visible').name('directional light helper visible')
cameraHelperFolder.add(spotLightCameraHelper, 'visible').name('spot light helper visible')
cameraHelperFolder.add(pointLightCameraHelper, 'visible').name('point light helper visible')

scene.add(directionalLightCameraHelper, spotLightCameraHelper, pointLightCameraHelper) // add the light helpers in the scene

// Objects
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7

const materialFolder = gui.addFolder('Material')
materialFolder.add(material, 'metalness').min(0).max(1).step(0.001)
materialFolder.add(material, 'roughness').min(0).max(1).step(0.001)

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true // this one drops a shadow

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5
plane.receiveShadow = true // this one shows it

scene.add(sphere, plane) // add the objects in the scene

const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: '#6600ff',
        transparent: true,
        alphaMap: simpleShadowTexture
    })
)
sphereShadow.rotation.x = - Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.01

scene.add(sphereShadow)

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

renderer.shadowMap.enabled = false // nothing casts a shadow until the renderer allows it
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Clock
const clock = new THREE.Clock()

// Animations
const tick = () => {
    // Clock
    const elapsedTime = clock.getElapsedTime()

    // Update the sphere
    sphere.position.x = Math.cos(elapsedTime) * 1.5
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 2)) 
    sphere.position.z = Math.sin(elapsedTime) * 1.5

    // Update the shadow
    sphereShadow.position.x = sphere.position.x
    sphereShadow.material.opacity = (1 - Math.abs(sphere.position.y)) * 0.8
    sphereShadow.position.z = sphere.position.z

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
