<script lang="ts" setup>
import { useRoute } from "vue-router";
import TaskBoard from "./components/TaskBoard.vue";

defineOptions({
	name: "RtTask",
});

const route = useRoute();
const type = route.meta.type as string;
</script>

<template>
	<div class="no-padding-card">
		<ElCard class="no-padding-card">
			<TaskBoard :type="type" />
		</ElCard>
	</div>
</template>

<style scoped>
.no-padding-card .el-card__body {
	padding: 0 !important;
}
</style>
