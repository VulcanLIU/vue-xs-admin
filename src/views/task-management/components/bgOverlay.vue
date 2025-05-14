<script setup>
  import { useManagerStore } from '@/views/task-management/stores/manager';
  const managerStore = useManagerStore();
</script>
<template>
  <div
    v-if="managerStore.overlay"
    class="fixed min-h-screen min-w-full bg-black bg-opacity-50 top-0 left-0 z-10"
    @click="managerStore.hideOverlay"
  >
    <slot />
  </div>
</template>
