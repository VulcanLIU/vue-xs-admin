<script setup>
  import { computed } from 'vue';
  import { useBoardsStore } from '../../stores/boards.js';
  import { useManagerStore } from '../../stores/manager.js';
  import BaseSelect from './BoardForm.vue';
  import Dropdown from './Dropdown.vue';
  import Subtask from './taskView/Subtask.vue';

  const boardsStore = useBoardsStore();
  const managerStore = useManagerStore();
  const subtasksCompleted = computed(() => {
    const completed = boardsStore.getTask?.subtasks.filter(sub => sub.isCompleted).length;
    const total = boardsStore.getTask?.subtasks.length;
    return `${completed} of ${total}`;
  });
  const changeColumn = ({ index }) => {
    boardsStore.changeTaskColumn(index);
  };
  const editTask = () => {
    managerStore.taskForm = { edit: true, visible: true };
    managerStore.taskView = false;
  };
  const deleteTask = () => {
    managerStore.delete = { board: false, visible: true };
    managerStore.taskView = false;
  };
</script>

<template>
  <div class="bg-white dark:bg-dark-grey rounded-lg p-1">
    <div class="p-5 pr-3 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center gap-4">
        <h4 class="text-black dark:text-white font-bold text-lg">{{ boardsStore.getTask?.title }}</h4>
        <Dropdown target="Task" @on-click-edit="editTask" @on-click-delete="deleteTask" />
      </div>
      <p v-if="boardsStore.getTask?.description" class="text-medium-grey text-sm">
        {{ boardsStore.getTask.description }}
      </p>
      <div>
        <p class="text-medium-grey dark:text-white text-xs font-bold pb-4">Subtasks ({{ subtasksCompleted }})</p>
        <div class="flex flex-col gap-2">
          <Subtask v-for="(subtask, index) in boardsStore?.getTask?.subtasks" :key="index" :subtask="subtask" />
        </div>
      </div>
      <div>
        <p class="text-medium-grey dark:text-white text-xs font-bold pb-4">Current Status</p>
        <BaseSelect :value="boardsStore.getCurrentColumn.name" @on-click-option="changeColumn" />
      </div>
    </div>
  </div>
</template>
