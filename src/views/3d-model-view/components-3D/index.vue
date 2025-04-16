<script setup>
  import * as THREE from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  import { onMounted, onUnmounted, ref } from 'vue';

  // DOM 容器引用（只有 DOM 元素需要 ref）
  const container = ref(null);
  const parentRef = ref(null);
  // Three.js 核心对象声明为普通变量
  let scene = null;
  let camera = null;
  let renderer = null;
  let controls = null;
  let model = null;
  let animationFrameId = null; // 变量追踪动画帧
  // 初始化场景
  const initScene = () => {
    const canvass = container.value;
    const parentDiv = parentRef.value;

    const { width, height } = getParentSize(); // 使用父容器尺寸

    // 1. 创建场景
    scene = new THREE.Scene();
    //scene.background = new THREE.Color(0xffffff);
    //scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);
    // 2. 创建相机
    camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
    camera.position.set(30, 15, 15);

    // 3. 创建渲染器
    renderer = new THREE.WebGLRenderer({ canvas: canvass, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;

    // 4. 添加控制器
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 5. 添加灯光
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
    directionalLight.position.set(0, 40, 0);
    directionalLight.castShadow = true;
    // 阴影质量优化
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 100;

    const directionalLight_b = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight_b.position.set(0, -100, 0);

    scene.add(directionalLight);
    scene.add(directionalLight_b);

    // 6. 加载模型
    const loader = new GLTFLoader();
    //const loader = new FBXLoader();
    loader.load(
      '/models/1.gltf',
      gltf => {
        model = gltf.scene;
        model.traverse(child => {
          if (child.isMesh) {
            child.castShadow = true; // 允许所有网格投射阴影
            child.geometry.computeVertexNormals(); // 重新计算法线
            child.geometry.normalizeNormals(); // 标准化法线
          }
        });
        scene.add(model);

        // 自动聚焦模型
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        camera.lookAt(center);
      },
      progress => {
        console.log('加载进度:', `${((progress.loaded / progress.total) * 100).toFixed(2)}%`);
      },
      error => {
        console.error('加载失败:', error);
      },
    );
  };

  // 动画循环
  const animate = time => {
    animationFrameId = requestAnimationFrame(animate);
    if (model) {
      model.rotation.y = time / 3000;
    }
    controls.update();
    renderer.render(scene, camera);
  };

  // 窗口大小调整
  const onWindowResize = () => {
    const { width, height } = getParentSize();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  const getParentSize = () => {
    return {
      width: parentRef.value.clientWidth,
      height: parentRef.value.clientHeight,
    };
  };

  // 生命周期钩子
  onMounted(() => {
    initScene();
    animate();
    window.addEventListener('resize', onWindowResize);
  });

  onUnmounted(() => {
    cancelAnimationFrame(animationFrameId); // 停止动画循环
    window.removeEventListener('resize', onWindowResize);
    // 清理资源
    controls.dispose();
    renderer.dispose();
    scene.traverse(obj => {
      if (obj.isMesh) {
        obj.geometry.dispose();
        obj.material.dispose();
      }
    });
  });
</script>

<script>
  export default {
    name: 'DView',
  };
</script>

<template>
  <div id="three-container" ref="parentRef">
    <canvas id="can" ref="container" />
  </div>
</template>

<style>
  .three-container {
    width: 100%;
    height: 100%;
  }
  #can {
    display: block;
    position: fixed;
    z-index: 0;
  }
  #content {
    font-size: 7vw;
    font-family: sans-serif;
    text-align: center;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    z-index: 1;
  }
</style>
