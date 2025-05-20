<script setup lang="ts">
  import useSortable from '@/hooks/web/useSortable';
  import { defineEmits, defineProps, PropType, ref, useTemplateRef } from 'vue';
  import { labelMap } from '../types/task';
  import TaskDiolog from './taskdiolog.vue';
  import type { Item, Priority, Status, TaskParams } from '../types/task';

  const props = defineProps({
    taskData: {
      type: Object as PropType<TaskParams>,
      required: true,
    },
    status: {
      type: String as PropType<Status>,
      required: true,
    },
  });

  const emit = defineEmits(['dragEnd', 'statusChanged']);

  const centerDialogVisible = ref(false);

  const sortableEl = useTemplateRef<HTMLElement | null>('sortable-ref');
  useSortable(
    {
      group: 'task-group',
      animation: 150,
      onEnd(evt) {
        emit('dragEnd', {
          fromStatus: props.status,
          toStatus: props.status, // 默认同组内拖拽
          oldIndex: evt.oldIndex,
          newIndex: evt.newIndex,
          fromEl: evt.from,
          toEl: evt.to,
          itemEl: evt.item,
          evt,
        });
      },
    },
    sortableEl,
  );
  function handleData(status: string) {
    emit('statusChanged', status);
    console.log(`泛型类型 T 的名称为：${status}`);
  }
</script>

<template>
  <div ref="sortable-ref" class="task-list">
    <ElCard class="list-item" draggable="true" shadow="hover">
      <div class="card-header handle" @click="centerDialogVisible = true">
        <article class="group flex flex-col bg-white dark:bg-dark-grey rounded-lg cursor-pointer shadow-task">
          <h3 class="text-base text-black dark:text-white font-bold select-none pointer-events-none">
            {{ taskData.discription }}
          </h3>
          <el-tag :type="labelMap[taskData.priority].type" class="flex">
            {{ labelMap[taskData.priority].label }}
          </el-tag>
          <p class="text-sm text-medium-grey font-bold select-none pointer-events-none whitespace-pre-wrap">
            {{ `节点:\t${taskData.node} \n下发人:\t${taskData.issuer}` }}
          </p>
        </article>
      </div>
    </ElCard>
    <ElDialog v-model="centerDialogVisible" title="任务详情" width="500">
      <TaskDiolog :task-data="taskData" @send-status="handleData" />
    </ElDialog>
  </div>
</template>

<style scoped>
  .task-list {
    min-height: 2px;
  }

  .handle {
    cursor: move;
  }

  .list-item {
    margin: 10px;
  }

  deep(.status-Common) {
    background-color: #e1f5d3; /* 浅绿色 */
  }
</style>
