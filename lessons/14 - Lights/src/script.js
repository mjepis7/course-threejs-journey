import * as THREE from 'three'
import GUI from 'lil-gui'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js'
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js'

RectAreaLightUniformsLib.init() // required, otherwise RectAreaLight emits nothing

// Debug
const gui = new GUI({title: 'Lights', closeFolders: true})

const global = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Lights

// Ambient light - lights every face equally, from all sides. No direction, no shadows
global.ambientColor = '#6600ff'

const ambientLight = new THREE.AmbientLight(global.ambientColor, 1.5)

const ambientLightFolder = gui.addFolder('Ambient Light')
ambientLightFolder.add(ambientLight, 'visible')
ambientLightFolder.add(ambientLight, 'intensity').min(0).max(3).step(0.01)
ambientLightFolder
    .addColor(global, 'ambientColor')
    .name('color')
    .onChange((value) => {
        ambientLight.color.set(value)
    })

// Directional light - parallel rays coming from one direction, like the sun. Position sets the direction, not the distance
global.directionalColor = '#00ffff'

const directionalLight = new THREE.DirectionalLight(global.directionalColor, 0.9)
directionalLight.position.set(1, 0.25, 0)

const directionalLightFolder = gui.addFolder('Directional Light')
directionalLightFolder.add(directionalLight, 'visible')
directionalLightFolder.add(directionalLight, 'intensity').min(0).max(3).step(0.01)
directionalLightFolder
    .addColor(global, 'directionalColor')
    .name('color')
    .onChange((value) => {
        directionalLight.color.set(value)
    })

// Hemisphere light - ambient light with two colors: one from the sky above, one bouncing off the ground below
global.hemisphereSkyColor = '#ff0000'
global.hemisphereGroundColor = '#0000ff'

const hemisphereLight = new THREE.HemisphereLight(global.hemisphereSkyColor, global.hemisphereGroundColor, 0.9)

const hemisphereLightFolder = gui.addFolder('Hemisphere Light')
hemisphereLightFolder.add(hemisphereLight, 'visible')
hemisphereLightFolder.add(hemisphereLight, 'intensity').min(0).max(3).step(0.01)
hemisphereLightFolder
    .addColor(global, 'hemisphereSkyColor')
    .name('sky color')
    .onChange((value) => {
        hemisphereLight.color.set(value)
    })
hemisphereLightFolder
    .addColor(global, 'hemisphereGroundColor')
    .name('ground color')
    .onChange((value) => {
        hemisphereLight.groundColor.set(value)
    })

// Point light - a single point emitting in every direction, like a bare light bulb
global.pointColor = '#00ff6e'

const pointLight = new THREE.PointLight(global.pointColor, 1.5, 10, 1)
pointLight.position.set(1, -0.1, 1)

const pointLightFolder = gui.addFolder('Point Light')
pointLightFolder.add(pointLight, 'visible')
pointLightFolder.add(pointLight, 'intensity').min(0).max(10).step(0.01)
pointLightFolder
    .addColor(global, 'pointColor')
    .name('color')
    .onChange((value) => {
        pointLight.color.set(value)
    })

// Rect Area light - a glowing rectangle, like a studio softbox or a LED panel. Emits from one face only
global.rectAreaColor = '#ffde21'

const rectAreaLight = new THREE.RectAreaLight(global.rectAreaColor, 6, 1, 1)
rectAreaLight.position.set(2, 0, -0.5)
rectAreaLight.lookAt(new THREE.Vector3())

const rectAreaLightFolder = gui.addFolder('Rect Area Light')
rectAreaLightFolder.add(rectAreaLight, 'visible')
rectAreaLightFolder.add(rectAreaLight, 'intensity').min(0).max(10).step(0.01)
rectAreaLightFolder
    .addColor(global, 'rectAreaColor')
    .name('color')
    .onChange((value) => {
        rectAreaLight.color.set(value)
    })

// Spot Light - a cone of light from a single point, like a flashlight. Aims at its target, not at a rotation
global.spotColor = '#ff0fbf'

const spotLight = new THREE.SpotLight(global.spotColor, 4.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)

const spotLightFolder = gui.addFolder('Spot Light')
spotLightFolder.add(spotLight, 'visible')
spotLightFolder.add(spotLight, 'intensity').min(0).max(10).step(0.01)
spotLightFolder
.addColor(global, 'spotColor')
.name('color')
.onChange((value) => {
    spotLight.color.set(value)
})

scene.add(ambientLight, directionalLight, hemisphereLight, pointLight, rectAreaLight, spotLight) // add the lights in the scene

scene.add(spotLight.target) // the spot aims at its target, and only objects in the scene get their position computed
spotLight.target.position.x = - 0.75

// Light helpers
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
const spotLightHelper = new THREE.SpotLightHelper(spotLight)
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)

scene.add(hemisphereLightHelper, directionalLightHelper, pointLightHelper, spotLightHelper) // add the light helpers in the scene
rectAreaLight.add(rectAreaLightHelper) // this one is the exception: it has to be a child of its own light

// Object
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane) // add the objects in the scene

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

// Animations 
const tick = () => {
    // Clock
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
