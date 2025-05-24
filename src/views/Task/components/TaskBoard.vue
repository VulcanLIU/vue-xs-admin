<script setup lang="ts">
import {
	ElAside,
	ElContainer,
	ElHeader,
	ElMain,
	ElRow,
	ElTabPane,
	ElTabs,
} from "element-plus";
import { forEach } from "lodash-es";
import { onMounted, ref } from "vue";
import type { TabsInstance } from "element-plus";
import { STATUS_LIST, TaskCategory } from "../types/task";
import AddTaskCard from "./AddTaskCard.vue";
import fetchdata from "./fetchdata.vue";
import TaskCard from "./TaskCard.vue";
import type { Status, TaskParams } from "../types/task";

const props = defineProps<{
	type: String;
}>();

const tabPosition = ref<TabsInstance["tabPosition"]>("left");

//获取子组件实例
const childRef = ref<InstanceType<typeof fetchdata> | null>(null);

const titleMap: Record<Status, string> = {
	Todo: "待办",
	Doing: "执行中",
	Done: "完成",
	Stopped: "暂停",
};

//经过任务分类后的任务数据
const taskCategoryList = ref<TaskCategory[]>([]);

//任务数据
const TaskData2 = ref<TaskParams[]>([]);
const TodoTaskData = ref<TaskParams[]>([]);
const DoingTaskData = ref<TaskParams[]>([]);
const DoneTaskData = ref<TaskParams[]>([]);
const StoppedTaskData = ref<TaskParams[]>([]);

//|——对任务数据进行归类状态到数据 ref 的映射
const taskDataMap: Record<Status, typeof TodoTaskData> = {
	Todo: TodoTaskData,
	Doing: DoingTaskData,
	Done: DoneTaskData,
	Stopped: StoppedTaskData,
};

// 初始化：按状态分类填充每个 ref
function sortByStatus(raw: TaskParams[], target: Status) {
	return raw.filter((i) => i.status === target);
}

function getCategoryList(raw: TaskParams[]) {
	//获取所有的category
	const _categoryList = raw.map((item) => item.category);

	//对category进行去重
	const categoryList = [...new Set(_categoryList)];

	//根据category数量生成数组
	//|- 如果 taskCategoryList 不为空，则清空
	if (taskCategoryList.value.length > 0) {
		taskCategoryList.value = [];
	}

	//|-先填入我的待办任务、我下发的任务
	taskCategoryList.value.push({
		category: props.type,
		children: raw,
	});
	//|-填充分类后的任务
	categoryList.forEach((categoryItem) => {
		taskCategoryList.value.push({
			category: categoryItem,
			children: raw.filter((i) => i.category === categoryItem),
		});
	});
}
//子组件完成数据获取后完成此回调函数
function loadData() {
	//
	for (const status of STATUS_LIST) {
		taskDataMap[status].value = sortByStatus(TaskData2.value, status);
	}
	getCategoryList(TaskData2.value);
}

onMounted(() => {
	//拉取数据-该用户的任务数据
	FetchData(TaskData2.value);
	console.log(props);
});

//调用子组件函数获取数据
function FetchData(task_data: TaskParams[]) {
	childRef.value?.FetchData(task_data);
}

// 拖拽处理函数
function onTaskDragEnd({
	fromStatus,
	toStatus,
	oldIndex,
	newIndex,
	fromEl,
	toEl,
	itemEl,
	evt,
}: {
	fromStatus: Status;
	toStatus: Status;
	oldIndex: number;
	newIndex: number;
	fromEl: HTMLElement;
	toEl: HTMLElement;
	itemEl: HTMLElement;
	evt: any;
}) {
	const fromList = taskDataMap[fromStatus].value;
	const toList = taskDataMap[toStatus].value;

	const taskEl = itemEl as HTMLElement;
	const taskId = taskEl.querySelector(".card-header span")?.textContent || "";

	const task = fromList.splice(oldIndex, 1)[0];
	if (task && fromStatus !== toStatus) {
		task.status = toStatus;
	}
	toList.splice(newIndex, 0, task);
	console.log(TodoTaskData.value);
	console.log(DoingTaskData.value);
}

//子组件中，任务状态在界面上修改后在此处对数组修改，由于都是响应式数据会再次传递到子组件中
function handleData(previousState: Status, targetState: Status, index: number) {
	const tt: TaskParams = taskDataMap[previousState].value[index];
	tt.status = targetState;
	taskDataMap[previousState].value.splice(index, 1); //删除来源数组中的任务
	taskDataMap[targetState].value.push(tt);

	//对数据库中的相应条目进行更新
	childRef.value?.updateTaskInfo(tt);
}
</script>

<template>
	<div>
		<div class="common-layout">
			<!-- 由taskCategoryList的category字段生成ElTabs -->
			<ElTabs tab-position="left">
				<ElTabPane
					v-for="(categoryItem, index) in taskCategoryList"
					:key="index"
					:label="categoryItem.category"
				>
					<ElRow class="row-bg" justify="space-evenly">
						<ElCol v-for="item in STATUS_LIST" :key="item" :span="6" gutter="20">
							<div class="column-header">{{ titleMap[item] }}</div>
						</ElCol>
					</ElRow>
					<ElRow class="row-bg" justify="space-evenly">
						<ElCol v-for="item in STATUS_LIST" :key="item" :span="6" gutter="20">
							<div v-if="categoryItem.category === props.type">
								<div v-for="(data, index) in taskDataMap[item].value" :key="index">
									<TaskCard
										:task-data="data"
										:status="item"
										@status-changed="
											(targetState) => handleData(item, targetState, index)
										"
									/>
								</div>
								<div v-if="titleMap[item] === '待办'">
									<AddTaskCard />
								</div>
							</div>
							<div v-else>
								<div
									v-for="(data, index) in taskDataMap[item].value.filter(
										(i) => i.category === categoryItem.category,
									)"
									:key="index"
								>
									<TaskCard
										:task-data="data"
										:status="item"
										@status-changed="
											(targetState) => handleData(item, targetState, index)
										"
									/>
								</div>
								<div v-if="titleMap[item] === '待办'">
									<AddTaskCard />
								</div>
							</div>
						</ElCol>
					</ElRow>
				</ElTabPane>
			</ElTabs>
		</div>
		<fetchdata ref="childRef" :type="props.type" @submit-form="loadData" />
	</div>
</template>

<style>
.column-header {
	color: #6b7280; /* medium grey 颜色值 */
	font-weight: 700; /* 相当于 font-bold */
	font-size: 1rem; /* 12px，相当于 text-xs */
	text-transform: uppercase;
	text-align: center;
	align-items: center;
}
.layout-container-demo .el-aside {
	color: var(--el-text-color-primary);
	background: var(--el-color-primary-light-8);
}

.demo-tabs > .el-tabs__content {
	padding: 32px;
	color: #6b778c;
	font-size: 32px;
	font-weight: 600;
}

.el-tabs--right .el-tabs__content,
.el-tabs--left .el-tabs__content {
	height: 100%;
}
</style>
