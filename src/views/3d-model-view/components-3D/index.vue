<script setup>
  import * as THREE from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  import { onBeforeUnmount, onMounted, ref } from 'vue';

  // ---------- 响应式状态 ----------
  const container = ref(null); // 容器DOM引用
  const scene = ref(new THREE.Scene()); // 场景实例
  const camera = ref(null); // 相机实例
  const renderer = ref(null); // 渲染器实例
  const controls = ref(null); // 轨道控制器
  const model = ref(null); // 加载的3D模型
  const animateId = ref(null); // 动画帧ID

  // ---------- 核心初始化方法 ----------
  // ---------- 初始化子方法 ----------
  const initCamera = () => {
    camera.value = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.value.position.set(2, 2, 5);
  };

  const initRenderer = () => {
    renderer.value = new THREE.WebGLRenderer({
      antialias: true,
      canvas: container.value,
    });
    renderer.value.physicallyCorrectLights = true;
    renderer.value.outputEncoding = THREE.sRGBEncoding;
    renderer.value.setSize(window.innerWidth, window.innerHeight);
  };

  const initControls = () => {
    controls.value = new OrbitControls(camera.value, renderer.value.domElement);
    controls.value.enableDamping = true;
    controls.value.dampingFactor = 0.05;
  };

  const setupLights = () => {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.value.add(ambientLight);

    // 平行光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(10, 10, 10);
    scene.value.add(directionalLight);
  };

  // ---------- 模型加载 ----------
  const loadModel = () => {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        '/models/1.gltf',
        gltf => {
          model.value = gltf.scene;
          scene.value.add(model.value);
          resolve();
        },
        undefined,
        error => {
          console.error('模型加载失败:', error);
          reject(error);
        },
      );
    });
  };

  // ---------- 动画系统 ----------
  const startAnimation = () => {
    const animate = () => {
      controls.value.update();
      renderer.value.render(scene.value, camera.value);
      animateId.value = requestAnimationFrame(animate);
    };
    animate();
  };

  // ---------- 窗口响应 ----------
  const onWindowResize = () => {
    camera.value.aspect = window.innerWidth / window.innerHeight;
    camera.value.updateProjectionMatrix();
    renderer.value.setSize(window.innerWidth, window.innerHeight);
  };
  const initThree = async () => {
    // 1. 场景基础设置
    scene.value.background = new THREE.Color(0xdddddd);

    // 2. 初始化相机
    initCamera();

    // 3. 初始化渲染器
    initRenderer();

    // 4. 初始化控制器
    initControls();

    // 5. 设置灯光
    setupLights();

    // 6. 加载模型
    await loadModel();

    // 7. 启动动画循环
    startAnimation();
  };

  // ---------- 生命周期 ----------
  onMounted(async () => {
    await initThree();
    window.addEventListener('resize', onWindowResize);
  });

  onBeforeUnmount(() => {
    // 清理资源
    window.removeEventListener('resize', onWindowResize);
    cancelAnimationFrame(animateId.value);
    renderer.value?.dispose();
  });
</script>

<script>
  export default {
    name: 'DView',
  };
</script>

<template>
  <div ref="container" class="three-container" />
</template>

<style>
  .three-container {
    width: 100%;
    height: 100%;
    margin: 10px;
    overflow: hidden;
  }
</style>
