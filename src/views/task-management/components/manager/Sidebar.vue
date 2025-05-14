<script setup>
  import { useBoardsStore } from '../../stores/boards';
  import { useManagerStore } from '../../stores/manager';
  import IconBoard from '../icons/IconBoard.vue';
  import DarkModeSwitch from './sidebar/DarkModeSwitch.vue';
  import HideSidebar from './sidebar/HideSidebar.vue';
  const managerStore = useManagerStore();
  const boardsStore = useBoardsStore();

  const onClickBoard = index => {
    boardsStore.selectedBoard = index;
  };
  const createNewBoard = () => {
    managerStore.overlay = true;
    managerStore.boardForm = { visible: true, edit: false };
  };
</script>
<template>
  <div class="z-10 transition-all fixed" :class="managerStore.sidebar ? ['translate-x-[0]'] : ['translate-x-[-100%]']">
    <div
      class="bg-white dark:bg-dark-grey min-h-[calc(100vh-80px)] w-64 lg:w-[300px] pb-10 hidden sm:flex sm:flex-col border-r border-r-lines-light dark:border-r-lines-dark"
    >
      <p class="text-medium-grey text-xs font-bold py-4 px-6">ALL BOARDS ({{ boardsStore.boards.length }})</p>
      <div
        v-for="(board, index) in boardsStore.boards"
        :key="index"
        class="flex items-center gap-4 w-11/12 rounded-r-full px-6 py-3 cursor-pointer text-medium-grey font-bold"
        :class="
          board?.name === boardsStore?.getCurrentBoard?.name
            ? ['bg-main-purple', 'text-white', 'fill-white', 'hover:bg-main-purple-light']
            : ['fill-medium-grey', 'hover:text-main-purple', 'hover:fill-main-purple', 'hover:bg-main-purple/10']
        "
        @click="onClickBoard(index)"
      >
        <IconBoard />
        <span>{{ board.name }}</span>
      </div>
      <div
        class="flex items-center gap-4 w-11/12 rounded-r-full px-6 py-3 cursor-pointer font-bold fill-main-purple text-main-purple hover:bg-medium-grey/10"
        @click="createNewBoard()"
      >
        <IconBoard />
        <span>+ Create New Board</span>
      </div>
      <div class="flex flex-col gap-2 mt-auto">
        <DarkModeSwitch class="w-10/12 mx-auto" />
        <HideSidebar class="w-11/12" />
      </div>
    </div>
  </div>
</template>
