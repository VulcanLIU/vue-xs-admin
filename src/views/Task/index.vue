<script lang="ts" setup>
import TaskBoard from "./components/TaskBoard.vue";
defineOptions({
	name: "RtTask",
});
</script>

<template>
	<div class="no-padding-card">
		<ElCard class="no-padding-card">
			<TaskBoard />
		</ElCard>
	</div>
</template>

<style scoped>
.no-padding-card .el-card__body {
	padding: 0 !important;
}
</style>
