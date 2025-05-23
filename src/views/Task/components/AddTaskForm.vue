<script setup lang="ts">
import {
	ElButton,
	ElForm,
	ElFormItem,
	ElInput,
	ElMessage,
	ElOption,
	ElSelect,
} from "element-plus";
import { computed, reactive, ref } from "vue";
import Todo from "wangeditor/dist/menus/todo";
import { useUserInfoStoreHook } from "@/store/modules/user";
import { labelMap } from "../types/task";

import fetchdata from "./fetchdata.vue";
import type { TaskParams } from "../types/task";

//定义信号
const emit = defineEmits<{
	submited: [issubmited: boolean, from: TaskParams];
}>();

//获取子组件实例
const childRef = ref<InstanceType<typeof fetchdata> | null>(null);

const userInfoStore = useUserInfoStoreHook();

// 表单引用
const ruleFormRef = ref();

// 表单数据
const ruleForm = reactive({
	issuer: userInfoStore.userInfo?.name,
	responser: "",
	discription: "",
	priority: Object.keys(labelMap)[0] || "",
	node: "",
	content: "",
	status: 0,
});

// 自动生成任务ID（时间戳+下发人）
const taskId = computed(() => {
	const now = new Date();
	const pad = (n: number) => n.toString().padStart(2, "0");
	const timeStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
	return userInfoStore.userInfo?.userid
		? `${timeStr}_${userInfoStore.userInfo?.userid}`
		: "";
});

// 表单校验规则
const rules = {
	issuer: [{ required: true, message: "请输入任务下发人", trigger: "blur" }],
	responser: [{ required: true, message: "请输入任务责任人", trigger: "blur" }],
	discription: [{ required: true, message: "请输入任务描述", trigger: "blur" }],
	priority: [{ required: true, message: "请选择紧急程度", trigger: "change" }],
	node: [{ required: true, message: "请输入任务节点", trigger: "blur" }],
	content: [{ required: true, message: "请输入任务内容", trigger: "blur" }],
};

// 紧急程度选项
const priorityOptions = Object.keys(labelMap).map((key) => ({
	value: key,
	label: labelMap[key].label,
}));

// 提交表单
const submitForm = async () => {
	await ruleFormRef.value?.validate();
	// 这里可以emit或调用API
	ElMessage.success(`任务已创建，任务ID：${taskId.value}`);
	const taskData = transformData(ruleForm);
	await childRef.value?.upsertTaskInfo(taskData);
	//告诉AddTaskCard。已经完成提交
	emit("submited", true, taskData);
};

function transformData(formData: any): TaskParams {
	return {
		id: taskId.value,
		issuer: formData.issuer,
		responser: formData.responser,
		discription: formData.discription,
		priority: formData.priority,
		node: formData.node,
		content: formData.content,
		status: "Todo",
	};
}
</script>

<template>
	<ElForm
		ref="ruleFormRef"
		style="max-width: 600px"
		:model="ruleForm"
		:rules="rules"
		label-width="auto"
	>
		<ElFormItem label="任务ID">
			<ElInput :model-value="taskId" readonly />
		</ElFormItem>
		<ElFormItem label="任务下发人" prop="issuer">
			<ElInput v-model="ruleForm.issuer" placeholder="请输入任务下发人" />
		</ElFormItem>
		<ElFormItem label="任务责任人" prop="responser">
			<ElInput v-model="ruleForm.responser" placeholder="请输入任务责任人" />
		</ElFormItem>
		<ElFormItem label="任务描述" prop="discription">
			<ElInput
				v-model="ruleForm.discription"
				type="textarea"
				placeholder="请输入任务描述"
			/>
		</ElFormItem>
		<ElFormItem label="紧急程度" prop="priority">
			<ElSelect v-model="ruleForm.priority" placeholder="请选择紧急程度">
				<ElOption
					v-for="item in priorityOptions"
					:key="item.value"
					:label="item.label"
					:value="item.value"
				/>
			</ElSelect>
			<!-- <ElTag :type="labelMap[ruleForm.priority].type" style="margin-left: 10px">
				{{ labelMap[ruleForm.priority].label }}
			</ElTag> -->
		</ElFormItem>
		<ElFormItem label="任务节点" prop="node">
			<ElInput v-model="ruleForm.node" placeholder="请输入任务节点" />
		</ElFormItem>
		<ElFormItem label="任务内容" prop="content">
			<ElInput
				v-model="ruleForm.content"
				type="textarea"
				placeholder="请输入任务内容"
			/>
		</ElFormItem>
		<ElFormItem>
			<ElButton type="primary" @click="submitForm">提交</ElButton>
		</ElFormItem>
	</ElForm>
	<fetchdata ref="childRef" />
</template>
