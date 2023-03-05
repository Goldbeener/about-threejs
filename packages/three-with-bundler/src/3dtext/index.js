import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { matcapTexture } from '../loaders'
/**
 * 3d 字体
 * */ 

function initFont(cb) {

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
    // scene.add(textMesh)
    cb(textMesh)
  }
)

}

export { initFont }
