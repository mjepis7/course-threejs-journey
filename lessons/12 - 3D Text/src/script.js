import * as THREE from 'three'
import GUI from 'lil-gui'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

import fontHelvetiker from './assets/fonts/helvetiker_regular.typeface.json?url'
import textMatcap from './assets/textures/matcaps/4.png'
import donutMatcap from './assets/textures/matcaps/8.png'

// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axios helper
// const axesHelper = new THREE.AxesHelper()

// scene.add(axesHelper) // add the axios in the scene

// Textures
const textureLoader = new THREE.TextureLoader()
const textMatcapTexture = textureLoader.load(textMatcap)
const donutMatcapTexture = textureLoader.load(donutMatcap)
textMatcapTexture.colorSpace = THREE.SRGBColorSpace
donutMatcapTexture.colorSpace = THREE.SRGBColorSpace

// Fonts
const fontLoader = new FontLoader()
fontLoader.load(fontHelvetiker, (font) => {
    const textGeometry = new TextGeometry(
        'Hello Three.js',
        {
            font: font,
            size: 0.5, // letter size
            depth: 0.2, // height
            curveSegments: 5, // letter smoothness
            bevelEnabled: true, // rounded edges
            bevelThickness: 0.03, // bevel depth (Z)
            bevelSize: 0.02, // bevel spread (X/Y)
            bevelOffset: 0, // outline shift
            bevelSegments: 4 // bevel smoothness
        }
    )

    // textGeometry.computeBoundingBox()
    // console.log(textGeometry.boundingBox)
    // textGeometry.translate(
    //     - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
    //     - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
    //     - (textGeometry.boundingBox.max.z - 0.03) * 0.5,
    // )

    textGeometry.center()

    const textMaterial = new THREE.MeshMatcapMaterial()
    textMaterial.matcap = textMatcapTexture
    // textMaterial.wireframe = true
    const text = new THREE.Mesh(textGeometry, textMaterial)

    scene.add(text) // add the text object in the scene 

    console.time('donuts')

    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
    const donutMaterial = new THREE.MeshMatcapMaterial()
    donutMaterial.matcap = donutMatcapTexture

    for (let i = 0; i < 100; i++) {
        const donut = new THREE.Mesh(donutGeometry, donutMaterial)
        
        donut.position.x = (Math.random() - 0.5) * 10
        donut.position.y = (Math.random() - 0.5) * 10
        donut.position.z = (Math.random() - 0.5) * 10

        donut.rotation.x = Math.random() * Math.PI
        donut.rotation.y = Math.random() * Math.PI

        const scale = Math.random()
        donut.scale.set(scale, scale, scale)
        
        scene.add(donut) // add the donut object in the scene 
    }

    console.timeEnd('donuts')
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
camera.position.z = 2

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
