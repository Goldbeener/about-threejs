import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 纹理
import { environmentMapTexture, matcapTexture } from './src/loaders'
// 3d 文字
import { initFont } from './src/3dtext'
// 彩色甜甜圈
import { initDonuts } from './src/geometry/donuts'

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
*/

// Create a scene
const scene = new THREE.Scene()

// debug
const gui = new dat.GUI({ width: 400 })
gui.close()

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

// 手动实现controls 表示conntrols的原理 可以直接使用内置controls
const cursors = {
  x: 0,
  y: 0,
}
window.addEventListener('mousemove', (e) => {
  cursors.x = e.clientX / sizes.width - 0.5
  cursors.y = -(e.clientY / sizes.height - 0.5)
}, false)


// 将3d字体加入到scene
initFont(textMesh =>  scene.add(textMesh))
// 将甜甜圈放入scene
initDonuts(donutMesh => scene.add(donutMesh))



// cube
// 后三位参数，每个面由 多少个三角形组成
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)

// debug color
const parameters = {
  color: 0xff6600,
  spin: () => {
    console.log('spin')
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + 10 })
  }
}

// const material = new THREE.MeshBasicMaterial({ map: alphaTexture })  
// const mesh = new THREE.Mesh(geometry, material)


// debug color
gui
  .addColor(parameters, 'color')
  .onChange(() => {
    console.log('color change', parameters.color)
    material.color.set(parameters.color)
  })

// debug function
gui.add(parameters, 'spin')

// Position
// mesh.position.x = 0.6 // 左右移动 正值向右
// mesh.position.y = -0.5 // 上下 正值向上
// mesh.position.z = -1 // 前后 正值向前
// mesh.position.set(0.6, -0.5, -1)

// Scale
// mesh.scale.set(2, 0.8, 0.5)

// Rotation
// mesh.rotation.reorder('yxz') // 控制旋转的顺序
// mesh.rotation.x = Math.PI / 4 // 旋转角度
// mesh.rotation.y = Math.PI / 4

/**
 * 旋转的时候，任意一个轴的转动都会影响到其他轴的转动
 * 因此不同的旋转顺序会有不同结果
 * 
 * quatenion 跟 rotation 是相同的作用
 * 但是不同的实现
 * 二者会相互影响
*/

// mesh.position.normalize() // 恢复原位置
// add mesh to the scene
// scene.add(mesh)

// add sphere plane torus



const material = new THREE.MeshStandardMaterial()
material.roughness = 0.45
material.metalness = 0.65
material.envMap = environmentMapTexture

gui
  .add(material, 'roughness')
  .min(0)
  .max(1)

gui
  .add(material, 'metalness')
  .min(0)
  .max(1)

gui
  .add(material, 'aoMapIntensity')
  .min(0)
  .max(10)

gui
  .add(material, 'displacementScale')
  .min(0)
  .max(1)
  .step(0.0001)



// lights
// 环境光源
const  ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)
// 点光源
const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
// scene.add(pointLight)

const sphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 64, 64), 
  material
)
sphere.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
)

const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1, 1, 100, 100), 
  material
)
plane.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
)

const torus = new THREE.Mesh(
  new THREE.TorusBufferGeometry(0.3, 0.2, 64, 128), 
  material
)
torus.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
)

sphere.position.x = -2
torus.position.x = 2
// scene.add(sphere)
// scene.add(sphere, plane, torus)
// debug mesh
// gui
//   .add(mesh.position, 'y')
//   .min(-3)
//   .max(3)
//   .step(0.01)
//   .name('cube Y')

// gui.add(mesh, 'visible')

// gui.add(material, 'wireframe')



// Group
const group = new THREE.Group()
// scene.add(group)

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
group.add(cube1)
group.add(cube2)
group.add(cube3)

cube2.position.x = -2
cube3.position.x = 2
group.rotation.y = Math.PI / 2

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
// 计算两个向量之间的距离
// console.log(mesh.position.distanceTo(camera.position));

scene.add(camera)

// 指定scene的中心点
// camera.lookAt(mesh.position)

// 轴线
const axHelper = new THREE.AxisHelper(2)
// scene.add(axHelper)

// Renderer
const canvas = document.querySelector('.webgl')
console.log(canvas);
const renderer = new THREE.WebGLRenderer({
  canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.render(scene, camera)

const controls = new OrbitControls(camera, canvas)
// controls.target.y = 1
// controls.update()
// controls.enableDamping = true

// deltaTime
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
  // console.log(elapsedTime)

  // mesh.position.y = Math.sin(elapsedTime) 
  // mesh.position.x = Math.cos(elapsedTime)

  // update 
  // sphere.rotation.y = 0.1 * elapsedTime
  // plane.rotation.y = 0.1 * elapsedTime
  // torus.rotation.y = 0.1 * elapsedTime

  // sphere.rotation.x = 0.15 * elapsedTime
  // plane.rotation.x = 0.15 * elapsedTime
  // torus.rotation.x = 0.15 * elapsedTime
  
  // camera.lookAt(mesh.position)

  // update camera
  // camera.position.x = Math.sin(cursors.x * Math.PI * 2) * 3
  // camera.position.z = Math.cos(cursors.x * Math.PI * 2) * 3
  // camera.position.y = cursors.y * 5
  // camera.lookAt(mesh.position)

  // update controls
  controls.update()

  renderer.render(scene, camera)
  window.requestAnimationFrame(clockTick)
}

clockTick()

// gsap
// gsap.to(mesh.position, { x: 1, duration: 1, delay: 1 })
// gsap.to(mesh.position, { x: 0, duration: 1, delay: 2 })
function gsapTick() {
  renderer.render(scene, camera)
  window.requestAnimationFrame(gsapTick)
}
// gsapTick()

/**
 * 旋转与浏览器帧率保持一致
 * 如果不这样的话，可能会因为用户的电脑帧率不一样，导致不同用户的旋转速度不一致
 * */ 