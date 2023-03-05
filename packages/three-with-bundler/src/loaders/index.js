import * as THREE from 'three'

// loader 管理
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => { console.log('onStart') }
loadingManager.onLoad = () => { console.log('onLoad') }
loadingManager.onProgress = () => { console.log('onProgress') }
loadingManager.onError = () => { console.log('onError') }

// 普通纹理loader
const textureLoader = new THREE.TextureLoader(loadingManager)


const colorTexture = textureLoader.load('/textures/door/color.jpg')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')

const matcapTexture = textureLoader.load('/textures/matcaps/5.png')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false

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

/**
 * 立方体纹理loader
 * 需要加载立方体的6个方向的纹理图片
 * */ 
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/4/px.png',
  '/textures/environmentMaps/4/nx.png',
  '/textures/environmentMaps/4/py.png',
  '/textures/environmentMaps/4/ny.png',
  '/textures/environmentMaps/4/pz.png',
  '/textures/environmentMaps/4/nz.png',
])

export {
  colorTexture,
  alphaTexture,
  ambientOcclusionTexture,
  heightTexture,
  normalTexture,
  roughnessTexture,
  metalnessTexture,
  matcapTexture,
  gradientTexture,
  environmentMapTexture
}
