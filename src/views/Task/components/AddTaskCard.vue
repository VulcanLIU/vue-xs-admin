<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import { ref } from "vue";
import AddTaskForm from "./AddTaskForm.vue";
const emit = defineEmits(["dragEnd", "statusChanged"]);

const centerDialogVisible = ref(false);
</script>

<template>
	<div ref="sortable-ref" class="task-list">
		<ElCard class="list-item" draggable="true" shadow="hover">
			<div
				class="card-header handle icon-center"
				@click="centerDialogVisible = true"
			>
				<ElIcon :size="32"><Plus /></ElIcon>
			</div>
		</ElCard>
		<ElDialog v-model="centerDialogVisible">
			<AddTaskForm
				@submited="
					(issubmited) => {
						if (issubmited) {
							centerDialogVisible = false;
						}
					}
				"
			/>
		</ElDialog>
	</div>
</template>

<style scoped>
.task-list {
	min-height: 2px;
}

.handle {
	cursor: move;
}

.list-item {
	margin: 10px;
}

deep(.status-Common) {
	background-color: #e1f5d3; /* 浅绿色 */
}
.icon-center {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 60px;
}
</style>
