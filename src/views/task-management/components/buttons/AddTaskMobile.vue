<script setup>
  import { useBoardsStore } from '@/views/task-management/stores/boards';
  import { useManagerStore } from '@/views/task-management/stores/manager';
  const boardsStore = useBoardsStore();
  const managerStore = useManagerStore();

  const addTask = () => {
    managerStore.overlay = true;
    managerStore.taskForm = { edit: false, visible: true };
  };
</script>
<template>
  <div class="sm:hidden min-w-[48px]">
    <button
      type="button"
      v-bind="$attrs"
      :disabled="!boardsStore.getColumns"
      class="text-white text-sm font-bold py-2.5 px-4.5 rounded-3xl bg-main-purple hover:bg-main-purple-light disabled:bg-main-purple disabled:bg-opacity-20"
      @click="addTask"
    >
      <img src="@/assets/icons/icon-add-task-mobile.svg" alt="" />
    </button>
  </div>
</template>
