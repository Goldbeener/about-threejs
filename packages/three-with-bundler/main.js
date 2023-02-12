import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Create a scene
const scene = new THREE.Scene()

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
// eventListener
const cursors = {
  x: 0,
  y: 0,
}
window.addEventListener('mousemove', (e) => {
  cursors.x = e.clientX / sizes.width - 0.5
  cursors.y = -(e.clientY / sizes.height - 0.5)
}, false)

// cube
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: '#ff6600' })
const mesh = new THREE.Mesh(geometry, material)

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
scene.add(mesh)

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
camera.position.z = 3
// camera.position.x = 1
// camera.position.y = 1
// 计算两个向量之间的距离
console.log(mesh.position.distanceTo(camera.position));

scene.add(camera)

// 指定scene的中心点
camera.lookAt(mesh.position)

// 轴线
const axHelper = new THREE.AxisHelper(2)
scene.add(axHelper)

// Renderer
const canvas = document.querySelector('.webgl')
console.log(canvas);
const renderer = new THREE.WebGLRenderer({
  canvas
})
renderer.setSize(sizes.width, sizes.height)
// renderer.render(scene, camera)

const controls = new OrbitControls(camera, canvas)
// controls.target.y = 1
// controls.update()
controls.enableDamping = true

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