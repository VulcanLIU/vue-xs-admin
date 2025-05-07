<script lang="ts" setup>
  import Table from '@/components/Table/index.vue';
  import axios from 'axios';
  import { ElCol } from 'element-plus';
  import { computed, h, onMounted, ref } from 'vue';

  defineOptions({
    name: 'RtTask',
  });

  interface Taskitem {
    num: string; //任务号
    FaQiRen: string; //发起人
    ZeRenRen: string; //责任人
    JinJi: string; //紧急程度
    JieDian: string; //节点时间
    content: string; //任务内容
    status: string; //任务状态
    Subtask?: Taskitem[];
  }

  const taskdata = ref<Taskitem[]>([
    {
      num: '001',
      FaQiRen: 'pc',
      ZeRenRen: 'lzp',
      JinJi: 'critical',
      JieDian: '2025.05.06',
      content: '搭建平台',
      status: 'todo', //任务状态
      Subtask: [
        {
          num: '002',
          FaQiRen: 'pc',
          ZeRenRen: 'lzp',
          JinJi: 'critical',
          JieDian: '2025.05.06',
          content: '搭建平台',
          status: 'todo',
        },
        {
          num: '003',
          FaQiRen: 'pc',
          ZeRenRen: 'lzp',
          JinJi: 'critical',
          JieDian: '2025.05.06',
          content: '搭建平台',
          status: 'doing',
        },
      ],
    },
  ]);
</script>

<template>
  <el-card class="box-card"> <ElCol>SSSS</ElCol>SSSS </el-card>
</template>

<style lang="scss" scoped>
  .box-card {
    margin-bottom: 20px;
    :deep(.el-card__header) {
      padding-bottom: 0;
      border: none;
    }
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
    }
    .card-content {
      :deep(.el-progress-bar__outer) {
        height: 17px !important;
      }
      .numerical-value {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        margin-bottom: 10px;
        .number {
          color: var(--text-color-primary);
          font-size: var(--font-size-extra-large);
          font-weight: 600;
        }
      }
    }
  }
</style>
