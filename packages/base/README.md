# ThreeJs

## base

### WHY

### Concept

+ basic scene
  + container 容器包含其他内容
    + objects 物体 页面3D元素
      + Primitive geometries 基本的几何模型
      + import models 外部的模型 blender创建的模型
      + particles 粒子
      + lights 灯光 
    + camera 摄像机
    + renderer 渲染器
  + mesh 网格 物体的抽象 
    + geometries 描述几何模型 形状
    + materials 材质 看起来如何
      + 颜色
  + group 关联的元素组成一个group 整体操作
    + 
+ local server
+ transform object
  + position
  + scale
  + rotation
  + quatenion
+ animations
  + requestAnimationFrame 60fps 
  + clock
  + gsap
+ cameras
  + PerspectiveCamera 透视镜头 类似人的视角，远小近大
  + OrthoGraphicCamera 正视镜头 物体不会因为距离的远近而改变尺寸
  + CubeCamera
  + ArrayCamera
+ controls 控制物体，控制摄像头、或是物体
  + OrbitControls 控制查看物体的视角
  + xxx
+ fullscreen and resizing
  + 全屏
  + 屏幕resize适配
+ geometries
  + BoxGeometry
  + 自定义Geometry
    + 其实就是定义顶点，三个顶点确定一个平面
+ debug ui  调试界面，改变对象属性
  + dat.gui
    + add
    + addColor
+ textures 纹理
  + TextureLoader 
  + LoadingManager
  + mipmapping
    + minFilter
    + magFilter
  + format and opt
+ materials
  + shader 着色器 
  + 各种材质
+ 3D text
  + face type 
  + fontLoader
    + 无返回值
    + 回调形式
  + TextBufferGeometry
+ go live 静态网页部署
  + vercel
  + github pages
####
