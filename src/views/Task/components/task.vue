<script setup lang="ts">
  import useSortable from '@/hooks/web/useSortable';
  import { defineEmits, defineProps, PropType, useTemplateRef } from 'vue';
  import type { Status, TaskParams } from '../types/task';

  const props = defineProps({
    taskData: {
      type: Array as PropType<TaskParams[]>,
      required: true,
    },
    status: {
      type: String as PropType<Status>,
      required: true,
    },
  });

  const emit = defineEmits(['dragEnd']);

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
</script>

<template>
  <div ref="sortable-ref" class="task-list">
    <ElCard v-for="data in taskData" :key="data.id" class="list-item" draggable="true">
      <div class="card-header handle">
        <span>{{ data.discription }}</span>
      </div>
    </ElCard>
  </div>
</template>

<style scoped>
  .task-list {
    min-height: 200px;
  }

  .handle {
    cursor: move;
  }

  .list-item {
    margin: 10px;
  }
</style>
