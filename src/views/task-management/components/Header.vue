<script setup>
  import AddButtonMobile from '@/views/task-management/components/buttons/AddTaskMobile.vue';
  import Dropdown from '@/views/task-management/components/manager/Dropdown.vue';
  import { useBoardsStore } from '@/views/task-management/stores/boards';
  import { useManagerStore } from '@/views/task-management/stores/manager';
  import PrimarySmall from './buttons/PrimarySmall.vue';
  import IconArrowDown from './icons/IconArrowDown.vue';
  import IconArrowUp from './icons/IconArrowUp.vue';

  const boardsStore = useBoardsStore();
  const managerStore = useManagerStore();

  const editTask = () => {
    managerStore.overlay = true;
    managerStore.boardForm = { edit: true, visible: true };
  };
  const deleteTask = () => {
    managerStore.overlay = true;
    managerStore.delete = { board: true, visible: true };
  };
  const addTask = () => {
    managerStore.overlay = true;
    managerStore.taskForm = { visible: true, edit: false };
  };
  const showMobileBar = () => {
    managerStore.sidebarMobile = true;
    managerStore.overlay = true;
  };
</script>
<template>
  <header class="bg-white dark:bg-dark-grey top-0 left-0 w-full flex items-center sm:pr-4">
    <div
      class="hidden items-center sm:flex pl-6 h-20 border-r border-r-lines-light dark:border-r-lines-dark md:h-24"
      :class="managerStore.sidebar ? ['min-w-[256px]', 'lg:min-w-[300px]'] : ['min-w-[200px]']"
    >
      <img class="hidden dark:block" src="@/assets/icons/logo-light.svg" alt="logo" />
      <img class="dark:hidden" src="@/assets/icons/logo-dark.svg" alt="logo" />
    </div>
    <div class="mx-auto max-w-sm w-11/12 flex items-center h-16 gap-4 sm:h-20">
      <div>
        <img class="sm:hidden" src="@/assets/icons/logo-mobile.svg" height="25" width="24" alt="logo" />
      </div>
      <div class="flex items-center gap-2 group cursor-pointer sm:hidden" @click="showMobileBar">
        <h1 class="text-black dark:text-white font-bold text-lg cursor-pointer">
          {{ boardsStore.getCurrentBoard?.name }}
        </h1>
        <IconArrowDown v-if="!managerStore.sidebarMobile" />
        <IconArrowUp v-else />
      </div>
      <h1 class="text-black dark:text-white font-bold hidden text-2xl sm:block">
        {{ boardsStore.getCurrentBoard?.name }}
      </h1>
      <div v-if="boardsStore.boards.length" class="flex items-center gap-4 ml-auto">
        <AddButtonMobile />
        <PrimarySmall class="hidden sm:block" @click="addTask">+ Add New Task</PrimarySmall>
        <Dropdown target="Board" @on-click-edit="editTask" @on-click-delete="deleteTask" />
      </div>
    </div>
  </header>
</template>
