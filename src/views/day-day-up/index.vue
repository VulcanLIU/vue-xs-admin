<script lang="ts" setup>
  defineOptions({
    name: 'RtHello',
  });
</script>

<template>
  <div class="day day up">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>打印</span>
        </div>
      </template>
      <div class="day-day-up">
        <h1>day-day-up!</h1>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
  .hello-world {
    padding: 20px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .hello-text {
    text-align: center;
    padding: 20px;
  }
</style>
