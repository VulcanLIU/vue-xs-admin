<script setup>
  import IconHideSidebar from '@/views/task-management/components/icons/IconHideSidebar.vue';
  import { useManagerStore } from '@/views/task-management/stores/manager';

  const managerStore = useManagerStore();
  const onClickHide = () => {
    managerStore.sidebar = false;
  };
</script>
<template>
  <div
    class="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-r-full font-bold text-medium-grey group hover:bg-main-purple/10 dark:hover:bg-white hover:text-main-purple"
    @click="onClickHide"
  >
    <IconHideSidebar class="fill-medium-grey group-hover:fill-main-purple" />
    <p class="">Hide Sidebar</p>
  </div>
</template>
