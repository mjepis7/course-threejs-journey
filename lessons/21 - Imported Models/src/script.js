import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 170, title: 'Fox Controls' })

const debugObject = { animation: 'survey' }

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Fog
const fogColor = '#2d3a2a'
scene.fog = new THREE.FogExp2(fogColor, 0.1)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// Floor
const floorAlphaTexture = textureLoader.load('/textures/floor/alpha.webp')
const floorColorTexture = textureLoader.load('/textures/floor/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.jpg')
const floorARMTexture = textureLoader.load('/textures/floor/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.jpg')
const floorNormalTexture = textureLoader.load('/textures/floor/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.jpg')
const floorDisplacementTexture = textureLoader.load('/textures/floor/leaves_forest_ground_1k/leaves_forest_ground_disp_1k.jpg')

floorColorTexture.colorSpace = THREE.SRGBColorSpace

for (const texture of [floorColorTexture, floorARMTexture, floorNormalTexture, floorDisplacementTexture]) {
    texture.repeat.set(8, 8)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
}

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
        alphaMap: floorAlphaTexture,
        transparent: true,
        color: '#8b6a50',
        map: floorColorTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDisplacementTexture,
        displacementScale: 0.1,
        displacementBias: - 0.05
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null

gltfLoader.load(
    '/models/Fox/glTF/Fox.gltf',
    (gltf) => {
        mixer = new THREE.AnimationMixer(gltf.scene)

        const actions = {
            survey: mixer.clipAction(gltf.animations[0]),
            walk: mixer.clipAction(gltf.animations[1]),
            run: mixer.clipAction(gltf.animations[2])
        }

        let currentAction = actions[debugObject.animation]
        currentAction.play()

        gui.add(debugObject, 'animation', ['survey', 'walk', 'run'])
            .onChange((value) => {
                const newAction = actions[value]
                newAction.reset().play()
                currentAction.crossFadeTo(newAction, 0.5)
                currentAction = newAction
            })
            .name('Fox animation')

        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true
            }
        })

        gltf.scene.scale.set(0.025, 0.025, 0.025)
        scene.add(gltf.scene)
    }
)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#86cdff', 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#ecce96', 1.4)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(3.5, 2, 5)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(fogColor)

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update mixer
    if (mixer !== null) {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
