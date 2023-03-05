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


// 材质
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.45
// material.metalness = 0.65


// lights

// 环境光源 均匀照亮场景中的所有物体 没有死角 不能用来投影
const  ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
// 第二个参数 光照强度
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01)

// 点光源 从一个点向各个方向发射的光源
const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2)
pointLight.position.set(1, -0.6, 1)
scene.add(pointLight)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5)
scene.add(pointLightHelper)

//spot light 聚光灯 从一个点沿一个方向射出
const spotLight  = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)
window.requestAnimationFrame(() => {
  spotLightHelper.update()
})

// 半球光 上下两部分光源  无阴影
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff)
scene.add(hemisphereLight)

const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.5)
scene.add(hemisphereLightHelper)

// 平面光源 矩形平面发射光线
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1)
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)  

// 平行光 沿着特定方向发射的光 表现像是无限远 光线都是平行的  常用来模拟太阳光
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3)
directionalLight.position.set(1.5, 0.5, 0)
scene.add(directionalLight)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
scene.add(directionalLightHelper)


const sphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 64, 64), 
  material
)
sphere.position.x = -1.5

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(0.75, 0.75, 0.75),
  material
)

const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(5, 5), 
  material
)
plane.rotation.x = - Math.PI / 2
plane.position.y = -0.65

const torus = new THREE.Mesh(
  new THREE.TorusBufferGeometry(0.3, 0.2, 64, 128), 
  material
)
torus.position.x = 1.5

scene.add(sphere, plane, torus, cube)



// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.y = 1
camera.position.z = 1

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

  sphere.rotation.y = 0.1 * elapsedTime
  cube.rotation.y = 0.1 * elapsedTime
  torus.rotation.y = 0.1 * elapsedTime

  sphere.rotation.x = 0.15 * elapsedTime
  cube.rotation.x = 0.15 * elapsedTime
  torus.rotation.x = 0.15 * elapsedTime

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