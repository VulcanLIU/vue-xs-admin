<script setup>
  import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
  import { ref } from 'vue';
  defineOptions({
    name: 'Rt3dModelView',
  });

  // 卡片数据示例
  const cards = ref([
    {
      id: 1,
      title: '用户统计表',
      type: 'table',
      columns: [
        { prop: 'name', label: '姓名' },
        { prop: 'age', label: '年龄' },
        { prop: 'email', label: '邮箱' },
      ],
      data: [
        { name: '张三', age: 25, email: 'zhangsan@example.com' },
        { name: '李四', age: 30, email: 'lisi@example.com' },
      ],
    },
    {
      id: 2,
      title: '自定义内容',
      type: 'custom',
      data: {
        text: '这里可以放任何自定义内容',
        image: 'https://example.com/image.jpg',
      },
    },
  ]);

  const currentIndex = ref(0);

  // 切换方法
  const prevCard = () => {
    if (currentIndex.value > 0) currentIndex.value--;
  };

  const nextCard = () => {
    if (currentIndex.value < cards.value.length - 1) currentIndex.value++;
  };
</script>

<template>
  <div class="card-carousel-container">
    <!-- 左右切换按钮 -->
    <div class="navigation-buttons">
      <el-button circle :disabled="currentIndex === 0" @click="prevCard">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <el-button circle :disabled="currentIndex === cards.length - 1" @click="nextCard">
        <el-icon><ArrowRight /></el-icon>
      </el-button>
    </div>

    <!-- 卡片容器 -->
    <transition-group name="slide" tag="div" class="card-wrapper">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="card-item"
        :class="{ active: currentIndex === index }"
        :style="{ transform: `translateX(${-currentIndex * 100}%)` }"
      >
        <!-- 卡片内容插槽 -->
        <div class="card-content">
          <h3>{{ card.title }}</h3>

          <!-- 表格示例 -->
          <el-table v-if="card.type === 'table'" :data="card.data" style="width: 100%">
            <el-table-column v-for="col in card.columns" :key="col.prop" :prop="col.prop" :label="col.label" />
          </el-table>

          <!-- 自定义内容 -->
          <slot v-else name="card-content" :data="card.data" />
        </div>
      </div>
    </transition-group>

    <!-- 指示器 -->
    <div class="indicators">
      <span
        v-for="(card, index) in cards"
        :key="index"
        :class="{ active: currentIndex === index }"
        @click="currentIndex = index"
      />
    </div>
  </div>
</template>

<style scoped>
  .card-carousel-container {
    position: relative;
    max-width: 800px;
    margin: 20px auto;
    overflow: hidden;
  }

  .navigation-buttons {
    position: absolute;
    top: 50%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    z-index: 2;
    transform: translateY(-50%);
  }

  .card-wrapper {
    display: flex;
    transition: transform 0.3s ease;
  }

  .card-item {
    flex: 0 0 100%;
    padding: 20px;
    box-sizing: border-box;
    transition: all 0.3s ease;
  }

  .card-content {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    padding: 20px;
    min-height: 300px;
  }

  .indicators {
    text-align: center;
    margin-top: 15px;
  }

  .indicators span {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin: 0 5px;
    border-radius: 50%;
    background: #ddd;
    cursor: pointer;
    transition: background 0.3s;
  }

  .indicators span.active {
    background: #409eff;
  }

  /* 切换动画 */
  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.3s ease;
  }

  .slide-enter-from {
    transform: translateX(100%);
    opacity: 0;
  }

  .slide-leave-to {
    transform: translateX(-100%);
    opacity: 0;
  }
</style>
