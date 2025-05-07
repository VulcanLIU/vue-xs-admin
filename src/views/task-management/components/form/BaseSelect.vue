<script setup>
  import IconArrowDown from '@/views/task-management/components/icons/IconArrowDown.vue';
  import IconArrowUp from '@/views/task-management/components/icons/IconArrowUp.vue';
  import { useBoardsStore } from '@/views/task-management/stores/boards';
  import { ref } from 'vue';

  const props = defineProps({
    editColumn: {
      type: String,
    },
  });
  const emit = defineEmits(['onClickOption']);
  const select = ref(null);
  const options = ref(null);
  const inputSelect = ref(null);
  const store = useBoardsStore();

  const onFocusSelect = () => {
    options.value.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };
  const onClickOption = (index, name) => {
    select.value.blur();
    emit('onClickOption', { index, name });
  };
</script>
<template>
  <div
    ref="select"
    tabindex="1"
    class="text-sm text-black dark:text-white font-bold rounded px-4 py-3 relative w-full flex items-center border border-medium-grey border-opacity-25 cursor-pointer hover:border-main-purple focus:border-main-purple group"
    @focusin="onFocusSelect"
  >
    <input ref="inputSelect" disabled v-bind="$attrs" class="w-full bg-white dark:bg-dark-grey cursor-pointer" />
    <IconArrowDown class="group-focus:hidden" />
    <IconArrowUp class="hidden group-focus:block" />
    <div
      ref="options"
      class="hidden absolute rounded left-0 top-full mt-4 w-full bg-white dark:bg-dark-grey group-focus:block"
    >
      <div
        v-for="(column, index) in store.getColumns"
        class="p-4 text-medium-grey hover:text-black dark:hover:text-white"
        @click="onClickOption(index, column.name)"
      >
        {{ column.name }}
      </div>
    </div>
  </div>
</template>
;
