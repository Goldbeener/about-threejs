import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

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
// handle resize
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

// handle fullscreen
window.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen().catch(e => {
      console.log('canvas fullscreen failed')
    }) 
  } else {
    document.exitFullscreen()
  }
}, false)

// eventListener
const cursors = {
  x: 0,
  y: 0,
}
window.addEventListener('mousemove', (e) => {
  cursors.x = e.clientX / sizes.width - 0.5
  cursors.y = -(e.clientY / sizes.height - 0.5)
}, false)

//threejs 纹理loader
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => { console.log('onStart') }
loadingManager.onLoad = () => { console.log('onLoad') }
loadingManager.onProgress = () => { console.log('onProgress') }
loadingManager.onError = () => { console.log('onError') }


const textureLoader = new THREE.TextureLoader(loadingManager)
const cubeTextureLoader = new THREE.CubeTextureLoader()


const colorTexture = textureLoader.load('/textures/door/color.jpg')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')

const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/4/px.png',
  '/textures/environmentMaps/4/nx.png',
  '/textures/environmentMaps/4/py.png',
  '/textures/environmentMaps/4/ny.png',
  '/textures/environmentMaps/4/pz.png',
  '/textures/environmentMaps/4/nz.png',
])

const matcapTexture = textureLoader.load('/textures/matcaps/5.png')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false

// 3d font
const fontLoader = new FontLoader();
const fontConf = {
  size: 0.5,
  height: 0.2,
}
fontLoader.load(
  '/fonts/AaXianXiaShaoNian_Regular.json',
  font => {
    console.log(font)
    const textGeometry = new TextGeometry(
      "定儿们睡了吗?",
      {
        font,
        size: fontConf.size,
        height: fontConf.height,
        curveSegments: 6,
        // bevelEnabled: false,
        // bevelThickness: 0.1,
        // bbevelSize: 1,
        // bevelOffset: 0,
        // bevelSegments: 5
      }
    )
    textGeometry.computeBoundingBox()
    console.log(textGeometry.boundingBox)
    textGeometry.translate(
      - textGeometry.boundingBox.max.x * 0.5,
      - textGeometry.boundingBox.max.y * 0.5,
      - textGeometry.boundingBox.max.z * 0.5
    )
    const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
    const textMesh = new THREE.Mesh(textGeometry, textMaterial)
    scene.add(textMesh)
    
    const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)
    const donutMaterial = new THREE.MeshNormalMaterial()
    for(let i = 0; i < 200; i++) {
      const donut = new THREE.Mesh(donutGeometry, donutMaterial)

      donut.position.x = (Math.random()  - 0.5) * 10
      donut.position.y = (Math.random()  - 0.5) * 10
      donut.position.z = (Math.random()  - 0.5) * 10

      donut.rotation.x = Math.random() * Math.PI
      donut.rotation.y = Math.random() * Math.PI

      const scale = Math.random()
      donut.scale.set(scale, scale, scale)
      scene.add(donut)
    }
  }
)

gui.add(fontConf, 'size').min(0).max(100).step(1).name('fontSize')
gui.add(fontConf, 'height').min(0).max(60).step(1).name('fontHeight')



// cube
// 后三位参数，每个面由 多少个三角形组成
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)

// 创建自定义的geometry
// const geometry = new THREE.BufferGeometry()
// 顶点坐标 分别是x,y,z
// const  positionArray = new Float32Array([
//   0, 0, 0,
//   1, 0, 0,
//   0, 1, 0,
// ])

// 自定义geometry
/* 
const count = 50;
const  positionArray = new Float32Array(count * 3 * 3)
// TODO index 顶点复用
for (let i = 0; i < count * 3 * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * 2
}

const positionsAttribute = new THREE.BufferAttribute(positionArray, 3)
geometry.setAttribute('position', positionsAttribute)
*/

// debug color
const parameters = {
  color: 0xff6600,
  spin: () => {
    console.log('spin')
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + 10 })
  }
}

// texture
// 原生js方式引入纹理
// const img = new Image();
// const texture = new THREE.Texture(img)
// img.onload = () => {
//   texture.needsUpdate = true
// }
// img.src = '/textures/door/color.jpg'



// texture  transform
// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 2
// colorTexture.wrapS = THREE.MirroredRepeatWrapping
// colorTexture.wrapT = THREE.MirroredRepeatWrapping

// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5

// colorTexture.rotation  = Math.PI
// colorTexture.center.x = 0.5
// colorTexture.center.y = 0.5

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
// const commonMaterial = new THREE.MeshBasicMaterial()
// commonMaterial.map = colorTexture
// // commonMaterial.color = new THREE.Color(0xff00ff) 
// commonMaterial.alphaMap = alphaTexture
// commonMaterial.transparent = true 
// commonMaterial.side = THREE.DoubleSide

// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true 

// 材质捕捉 
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// 靠近才显示为白色，越远越黑 用在游戏场景
// const material = new THREE.MeshDepthMaterial()

// const material = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0xff0000)

// 渐变
// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTexture

// const material = new THREE.MeshStandardMaterial()
// material.roughness = 0.45
// material.metalness = 0.65
// material.map = colorTexture
// material.aoMap = ambientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = heightTexture
// material.displacementScale = 0.05
// material.roughnessMap = roughnessTexture
// material.metalnessMap = metalnessTexture
// material.normalMap = normalTexture
// material.normalScale.set(1, 1)
// material.alphaMap = alphaTexture
// material.transparent = true


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