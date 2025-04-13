<script setup>
  import * as THREE from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  import { CSS2DObject, CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
  import { onMounted, onUnmounted, ref } from 'vue';

  // DOM 容器引用（只有 DOM 元素需要 ref）
  const container = ref(null);

  // Three.js 核心对象声明为普通变量
  let scene = null;
  let camera = null;
  let renderer = null;
  let css2Renderer = null;
  let controls = null;

  // 初始化场景
  const initScene = () => {
    // 1. 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // 2. 创建相机
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(15, 15, 15);

    // 3. 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // CSS2D 渲染器（关键修正）
    css2Renderer = new CSS2DRenderer();
    css2Renderer.setSize(window.innerWidth, window.innerHeight);
    css2Renderer.domElement.style.position = 'absolute';
    css2Renderer.domElement.style.top = '0';
    css2Renderer.domElement.style.pointerEvents = 'none'; // 防止阻挡交互
    document.body.appendChild(css2Renderer.domElement);
    // 4. 添加控制器
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 5. 添加灯光
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
    directionalLight.position.set(20, 40, 20);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // 6. 加载模型
    const loader = new GLTFLoader();
    loader.load(
      '/models/scene.gltf',
      gltf => {
        const model = gltf.scene;
        scene.add(model);

        // HTML元素转化为threejs的CSS2模型对象
        const div = document.getElementById('tag');
        const tag = new CSS2DObject(div);
        tag.position.set(0, 1, 0);
        model.add(tag);
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
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    css2Renderer.render(scene, camera);
  };

  // 窗口大小调整
  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  // 生命周期钩子
  onMounted(() => {
    initScene();
    container.value.appendChild(renderer.domElement);
    animate();
    window.addEventListener('resize', onWindowResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', onWindowResize);
    // 清理 CSS2D 渲染器
    document.body.removeChild(css2Renderer.domElement);
    css2Renderer = null;
    // 清理资源
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
  <div ref="container" class="three-container" />
</template>

<style>
  .three-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
