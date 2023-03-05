// 创建自定义的geometry
const geometry = new THREE.BufferGeometry()
// 顶点坐标 分别是x,y,z
// const  positionArray = new Float32Array([
//   0, 0, 0,
//   1, 0, 0,
//   0, 1, 0,
// ])

// 自定义geometry 
const count = 50;
const  positionArray = new Float32Array(count * 3 * 3)
// TODO index 顶点复用
for (let i = 0; i < count * 3 * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * 2
}

/**
 * BufferAttribute 存储与BufferGeometry相关联的attribute，
 * 比如顶点位置向量、UV坐标
 * 可以更高效的向GPU传递数据
 * */ 

// 设置位置信息
const positionsAttribute = new THREE.BufferAttribute(positionArray, 3)
geometry.setAttribute('position', positionsAttribute)
// 设置uv坐标
// const uvArray = new THREE.BufferAttribute(uv.array, 2)
// geometry.setAttribute('uv2', uvArray)
