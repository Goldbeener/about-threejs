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

// fog
const fog = new THREE.Fog(0x262837, 1, 15)
scene.fog = fog

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

// texture
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const wallColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const wallAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const wallNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const wallRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping
// lights

// 环境光源 均匀照亮场景中的所有物体 没有死角 不能用来投影
const  ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.12)
scene.add(ambientLight)
// 第二个参数 光照强度
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01).name('ambientLight')
  

// 平行光 沿着特定方向发射的光 表现像是无限远 光线都是平行的  常用来模拟太阳光
const moonLight = new THREE.DirectionalLight(0xb9d5ff, 0.12)
moonLight.position.set(4, 5, -2)

gui.add(moonLight, 'intensity').min(0).max(1).step(0.01).name('directional')
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001)

scene.add(moonLight)
// 


// const textureLoader = new  THREE.TextureLoader()
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')

// House Group
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({ 
    map: wallColorTexture,
    aoMap: wallAmbientOcclusionTexture,
    normalMap: wallNormalTexture,
    roughnessMap: wallRoughnessTexture
  })
)
// 设置第二组uv 配合aoMap
walls.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)
walls.position.y = 2.5 / 2
house.add(walls)

// floor
const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20),
  new THREE.MeshStandardMaterial({ 
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture
  })
)
// 设置第二组uv 配合aoMap
floor.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)
floor.rotation.x = - Math.PI / 2
floor.position.y = 0
scene.add(floor)

// roof
const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: 0xb35f45 })
)
roof.position.y = 2.5 + 1 / 2
roof.rotation.y = Math.PI / 4
scene.add(roof)

// Door
const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2, 2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture, // 需要设置每一个面需要多少个子面 这样才能实现层次
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture
  })
)
// 设置第二组uv 配合aoMap
door.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)
door.position.y = 1
door.position.z = 4 / 2 + 0.01 // 避免z轴冲突
house.add(door)

// Door Light 点光源
const doorLight = new THREE.PointLight(0xff7d46, 1, 7)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

// Bushs
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x89c854 })

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.2, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.01, 2.6)

house.add(bush1, bush2, bush3, bush4)

// Graves
const graves = new THREE.Group()
scene.add(graves)

const gravesGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2)
const gravesMaterial = new THREE.MeshStandardMaterial({ color: 0xb2b6b1 })

for (let i = 0; i < 50; i++) {
  // 确定位置 在一个环形的区域：（半径区间 * 三角函数）
  const angle = Math.random() * Math.PI * 2
  const radius = 4 + Math.random() * 5 // 4-9 区间内
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius

  const grave = new THREE.Mesh(gravesGeometry, gravesMaterial)

  grave.position.set(x, 0.3, z)

  grave.rotation.y = (Math.random() - 0.5) * 0.4
  grave.rotation.z = (Math.random() - 0.5) * 0.4

  grave.castShadow = true

  graves.add(grave);
}

// Ghosts
const ghost1 = new THREE.PointLight(0xffff00, 3, 3)
scene.add(ghost1)

const ghost2 = new THREE.PointLight(0xff00ff, 3, 3)
scene.add(ghost2)

const ghost3 = new THREE.PointLight(0x00ffff, 3, 3)
scene.add(ghost3)


// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.x = 0
camera.position.y = 1
camera.position.z = 100

camera.lookAt(door)

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

// shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadow

// 光源
moonLight.castShadow = true

doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

floor.receiveShadow = true

// 阴影优化
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

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

  // update ghost
  const ghost1Angle = elapsedTime * 0.5
  ghost1.position.x = Math.cos(ghost1Angle) * 4
  ghost1.position.z = Math.sin(ghost1Angle) * 4
  ghost1.position.y = Math.sin(elapsedTime * 3)

  const ghost2Angle = - elapsedTime * 0.32
  ghost2.position.x = Math.cos(ghost2Angle) * 5
  ghost2.position.z = Math.sin(ghost2Angle) * 5
  ghost2.position.y = Math.sin(elapsedTime * 4)  + Math.sin(elapsedTime * 2.5)

  const ghost3Angle = - elapsedTime * 0.18
  ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
  ghost3.position.y = Math.sin(elapsedTime * 5)  + Math.sin(elapsedTime * 2)

  // update controls
  controls.update()

  renderer.render(scene, camera)
  window.requestAnimationFrame(clockTick)
}

clockTick()

gui.add(camera.position, 'z').min(0).max(100).name('camera')

// gsap
gsap.to(camera.position, { z: 5, duration: 3, delay: 5 })
gsap.to(camera.position, { y: 5, duration: 1, delay: 11 })
gsap.fromTo(camera.position,{}, {
  delay: 12,
  keyframes: [
    { x: 5, z: 0, duration: 4, },
    { x: 0, z: -5,  duration: 4 },
    { x: -5, z: 0,  duration: 4 },
    { x: 0, z: 5,  duration: 4 },
    { y: 2, z: 6,  duration: 1 }
  ]
})
// gsap.to(camera.position, { x: 0, z: -5,  duration: 4, delay: 14, ease: "none" })
// gsap.to(camera.position, { x: -5, z: 0,  duration: 4, delay: 18, ease: "none" })
// gsap.to(camera.position, { x: 0, z: 5,  duration: 4, delay: 22, ease: "none" })
// gsap.to(camera.position, { y: 2, z: 6,  duration: 1, delay: 26, ease: "none" })

function gsapTick() {
  renderer.render(scene, camera)
  window.requestAnimationFrame(gsapTick)
}
// gsapTick()

/**
 * 旋转与浏览器帧率保持一致
 * 如果不这样的话，可能会因为用户的电脑帧率不一样，导致不同用户的旋转速度不一致
 * */ 