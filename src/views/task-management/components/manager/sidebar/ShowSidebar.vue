<script setup>
  import IconShowSidebar from '@/views/task-management/components/icons/IconShowSidebar.vue';
  import { useManagerStore } from '@/views/task-management/stores/manager';

  const managerStore = useManagerStore();
  const onClickShow = () => {
    managerStore.sidebar = true;
  };
</script>
<template>
  <div
    class="fixed bottom-8 left-0 cursor-pointer p-4 pr-5 bg-main-purple hover:bg-main-purple-light rounded-r-full hidden sm:block"
    @click="onClickShow"
  >
    <IconShowSidebar />
  </div>
</template>
