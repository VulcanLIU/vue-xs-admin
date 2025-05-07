<script setup></script>

<template>
  <div>
    <button
      type="button"
      v-bind="$attrs"
      class="text-white font-bold text-sm py-2.5 px-4 w-full rounded-3xl bg-red hover:bg-red-light"
    >
      <slot />
    </button>
  </div>
</template>
