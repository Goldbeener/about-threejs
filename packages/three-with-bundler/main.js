import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'

/**
 * scene
 * camera
 * objects
 *   material 材质 
 *     texture 纹理
 *     材质类型
 *        stand
 *        basic
 *        xxxx
 *   geometry
 *     mesh
 *     sphere
 *     torus
 *     xxx
 * 
 * dat.gui
 * controls
 * 
 * lights
 * 
*/

// Create a scene
const scene = new THREE.Scene()

// textureLoader
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png')

// debug
const gui = new dat.GUI({ width: 400 })
// gui.close()

// Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
// 屏幕resize适配
window.addEventListener('resize',() =>  {
  // update Sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}, false)

// 全屏切换
window.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen().catch(e => {
      console.log('canvas fullscreen failed')
    }) 
  } else {
    document.exitFullscreen()
  }
}, false)


// test cube setup 基础
// const geometry = new THREE.BoxBufferGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial()
// const cube = new THREE.Mesh(geometry, material)
// scene.add(cube)

const parameters = {
  count: 10000,
  size: 0.02,
  radius: 5,
  branch: 3,
  spin: 0.2,
  randomness: 0.2,
  randomnessPower: 3,
  insideColor: 0xff6030,
  outsideColor: 0x0000ff,
}

let geometry, material, points;

// Galaxy
const generateGalaxy = () => {
  if (points) {
    geometry.dispose()
    material.dispose()
    scene.remove(points)
  }

  // 创建粒子
  geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(parameters.count * 3)
  const colors = new Float32Array(parameters.count * 3)

  // 创造一个随机颜色
  const colorInside = new THREE.Color(parameters.insideColor)
  const colorOutside = new THREE.Color(parameters.outsideColor)

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3

    // Positions
    const radius = Math.random() * parameters.radius
    const spinAngle = radius * parameters.spin
    const branchAngle = (i % parameters.branch) / parameters.branch * (Math.PI * 2)

    const randomX = Math.pow(Math.random(), parameters.randomnessPower)  * (Math.random() > 0.5 ? 1 : -1)
    const randomY = Math.pow(Math.random(), parameters.randomnessPower)  * (Math.random() > 0.5 ? 1 : -1)
    const randomZ = Math.pow(Math.random(), parameters.randomnessPower)  * (Math.random() > 0.5 ? 1 : -1)

    positions[i3 +  0]  = Math.cos(branchAngle + spinAngle) * radius + randomX
    positions[i3 +  1]  = randomY
    positions[i3 +  2]  = Math.sin(branchAngle + spinAngle) * radius + randomZ

    // Colors
    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside, radius / parameters.radius)
    colors[i3 + 0] =  mixedColor.r
    colors[i3 + 1] =  mixedColor.g
    colors[i3 + 2] =  mixedColor.b
  }

  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  )
  geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
  )

  material = new THREE.PointsMaterial({
    // color: 0xff5588,
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending:  THREE.AdditiveBlending,
    vertexColors: true, // 使用顶点颜色
  })

  points = new THREE.Points(geometry, material)
  scene.add(points)
}

generateGalaxy()

gui
  .add(parameters, 'count')
  .min(100)
  .max(50000)
  .step(100)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'size')
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'radius')
  .min(0.1)
  .max(20)
  .step(0.1)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'branch')
  .min(3)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'spin')
  .min(-5)
  .max(5)
  .step(0.001)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'randomness')
  .min(0)
  .max(2)
  .step(0.001)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'randomnessPower')
  .min(1)
  .max(10)
  .step(0.01)
  .onFinishChange(generateGalaxy)

gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)


// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3

scene.add(camera)

// 指定scene的中心点
// camera.lookAt(mesh.position)

// 轴线
const axHelper = new THREE.AxisHelper(5)
scene.add(axHelper)

// Renderer
const canvas = document.querySelector('.webgl')
console.log(canvas);
const renderer = new THREE.WebGLRenderer({
  canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x262837) // 设置renderer颜色 与 fog一致 隐藏plane边缘
// renderer.render(scene, camera)



const controls = new OrbitControls(camera, canvas)
// controls.target.y = 1
// controls.update()
// controls.enableDamping = true

// deltaTime n
let  time = Date.now()

function tick() {
  const currentTime = Date.now()
  const deltaTime = currentTime - time
  time = currentTime
  // mesh.position.z += 0.01
  // mesh.position.y += 0.01
  mesh.rotation.y += 0.001  * deltaTime
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

// Clock
const clock = new THREE.Clock()
function clockTick() {
  // 逝去的时间
  const elapsedTime = clock.getElapsedTime()

  // update controls
  controls.update()

  renderer.render(scene, camera)
  window.requestAnimationFrame(clockTick)
}

clockTick()

gui.add(camera.position, 'z').min(0).max(100).name('camera')


function gsapTick() {
  renderer.render(scene, camera)
  window.requestAnimationFrame(gsapTick)
}
// gsapTick()

/**
 * 旋转与浏览器帧率保持一致
 * 如果不这样的话，可能会因为用户的电脑帧率不一样，导致不同用户的旋转速度不一致
 * */ 