import * as THREE from 'three'

function initDonuts(cb) {

  const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)
  const donutMaterial = new THREE.MeshNormalMaterial()

  for(let i = 0; i < 200; i++) {
    const donut = new THREE.Mesh(donutGeometry, donutMaterial)

    // 位置
    donut.position.x = (Math.random()  - 0.5) * 10
    donut.position.y = (Math.random()  - 0.5) * 10
    donut.position.z = (Math.random()  - 0.5) * 10
    // 转向
    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI
    // 缩放
    const scale = Math.random()
    donut.scale.set(scale, scale, scale)

    // scene.add(donut)
    cb(donut)
    
  }
}

export { initDonuts }
