<script setup>
  const props = defineProps({
    modelValue: String,
    inputName: String,
  });
</script>

<template>
  <div class="text-white relative flex flex-col gap-2">
    <label v-if="inputName" :for="inputName" class="text-medium-grey dark:text-white text-xs font-bold">
      {{ inputName }}
    </label>
    <textarea
      :id="inputName"
      :name="inputName"
      rows="4"
      class="resize-none px-4 py-2 text-black dark:text-white dark:bg-dark-grey text-sm rounded transition-colors outline outline-1 outline-medium-grey/25 cursor-pointer hover:outline-main-purple focus:outline-main-purple placeholder:text-black/25 dark:placeholder:text-white/25"
      :value="modelValue"
      v-bind="$attrs"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>
