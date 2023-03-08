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

// Particles 粒子

// 球形几何体
// const particleGeometry = new THREE.SphereBufferGeometry(1, 32, 32)

// 自定义几何体
const particleGeometry = new THREE.BufferGeometry()
const count = 10000
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10
  colors[i] = Math.random()
}

// 该几何体由500个点组成 
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const particleMaterial = new THREE.PointsMaterial({
  size: 0.2,
  // color: 0xff6600,
  vertexColors: true,
  sizeAttenuation: true, // 粒子是否衰减 根据距离
  // map: particleTexture
  alphaMap: particleTexture,
  transparent: true,
  // 会有重叠问题 导致alphaMap失效 以下是解决方案
  // alphaTest: 0.001, // 在这个色度之上的才渲染 还是会有边缘问题
  // depthTest: false, // 告诉GPU 不考虑物体的相互遮挡 正常应该被挡住的也渲染 ， 如果还有其他颜色的物体会有问题
  depthWrite: false, // GPU在渲染有层深的粒子时，存储在一个buffer里再渲染，这个直接告诉GPU被挡住的就不要往buffer里面放了，最后肯定也不会被遮盖
  blending: THREE.AdditiveBlending  // 颜色叠加，越多重合颜色越高亮
})

const particle  = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particle)



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

  //update particle
  // particle.rotation.y = elapsedTime * 0.3

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const x = particleGeometry.attributes.position.array[i3 + 0]
    particleGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
  }
  particleGeometry.attributes.position.needsUpdate = true

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