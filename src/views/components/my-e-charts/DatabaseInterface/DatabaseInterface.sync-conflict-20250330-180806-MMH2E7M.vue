<script lang="ts">
  import axios from 'axios';
  import { defineComponent, onMounted, ref, toRaw } from 'vue';

  interface DataItem {
    id: number;
    content: string;
  }

  export default defineComponent({
    setup() {
      const data = ref<DataItem[]>([]);
      const inputContent = ref('');
      const isSubmitting = ref(false);

      // 获取数据
      const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/data');
          data.value = response.data.data;
        } catch (error) {
          console.error('数据获取失败:', error);
        }
      };

      // 提交数据
      // 修改submitData为接收参数的版本
      const submitData = async (content: string) => {
        // <-- 修改这里
        const rawData = toRaw(content);
        if (!rawData.trim()) return;
        console.log(content);
        isSubmitting.value = true;
        try {
          await axios.post(
            'http://192.168.207.56:5000/api/data',
            { content },
            {
              headers: {
                'Content-Type': 'application/json', // 明确指定（可选）
              },
            },
          );
        } finally {
          isSubmitting.value = false;
        }
      };

      onMounted(() => {
        fetchData();
      });
      return { data, inputContent, isSubmitting, submitData };
    },
  });
</script>

<template>
  <div>
    <!-- 数据展示 -->
    <div v-for="item in data" :key="item.id" class="data-item">
      {{ item.content }}
    </div>
  </div>
</template>

<style scoped>
  .data-item {
    padding: 8px;
    margin: 4px 0;
    background-color: #f5f5f5;
  }
</style>
