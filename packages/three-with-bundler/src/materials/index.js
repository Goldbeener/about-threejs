import * as THREE from 'three'

/**
 * 物体材质
*/

// 简单着色绘制几何体 不会受灯光影响
const basicMat = new THREE.MeshBasicMaterial()
basicMat.map = colorTexture
basicMat.color = new THREE.Color(0xff00ff) 
basicMat.alphaMap = alphaTexture
basicMat.transparent = true 
basicMat.side = THREE.DoubleSide

// 把法向量映射到RGB颜色的材质 五颜六色
const normalMat = new THREE.MeshNormalMaterial()
normalMat.flatShading = true 

// 由材质捕捉纹理所定义 根据纹理的特性渲染 
const matcapMat = new THREE.MeshMatcapMaterial()
matcapMat.matcap = matcapTexture

// 按深度绘制几何体的材质 基于相机远近平面内，白色最近，越远越黑 常用在游戏场景
const meshDepthMat = new THREE.MeshDepthMaterial()

// 非光泽材质，没有高光
const meshLambertMat = new THREE.MeshLambertMaterial()

// 具有镜面高光的光泽表面的材质
const meshPhongMat = new THREE.MeshPhongMaterial()
meshPhongMat.shininess = 100
meshPhongMat.specular = new THREE.Color(0xff0000) // 高光

// 卡通渲染材质
const meshToonMat = new THREE.MeshToonMaterial()
meshToonMat.gradientMap = gradientTexture

// 基于物理的标准材质
const meshStandardMat = new THREE.MeshStandardMaterial()
meshStandardMat.roughness = 0.45
meshStandardMat.metalness = 0.65
meshStandardMat.map = colorTexture
meshStandardMat.aoMap = ambientOcclusionTexture
meshStandardMat.aoMapIntensity = 1
meshStandardMat.displacementMap = heightTexture
meshStandardMat.displacementScale = 0.05
meshStandardMat.roughnessMap = roughnessTexture
meshStandardMat.metalnessMap = metalnessTexture
meshStandardMat.normalMap = normalTexture
meshStandardMat.normalScale.set(1, 1)
meshStandardMat.alphaMap = alphaTexture
meshStandardMat.transparent = true

export {
  basicMat,
  normalMat,
  matcapMat,
  meshDepthMat,
  meshLambertMat,
  meshPhongMat,
  meshToonMat,
  meshStandardMat,
}