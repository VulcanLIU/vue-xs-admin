<script lang="ts" setup>
import { ref } from "vue";
import { useUserInfoStoreHook } from "@/store/modules/user";
import { deffHttp } from "@/utils/axios";
import type { TaskParams, UserParams } from "../types/task";

const props = defineProps<{ type: String }>();

const emit = defineEmits<{
	(e: "submitForm"): boolean;
}>();

const userInfoStore = useUserInfoStoreHook();

//获取数据信息-实际与后端通信的API
const getTaskInfo = async (user: string, id: number) => {
	if (props.type === "我下发的任务") {
		return deffHttp.post<TaskParams, { issuer: String; userid: number }>(
			{
				url: "http://localhost:5000/api/getTaskInfo",
				data: { issuer: user, userid: id },
			},
			{ errorMessageMode: "modal", withToken: false },
		);
	} else if (props.type === "我待办的任务") {
		return deffHttp.post<TaskParams, { responser: String; userid: number }>(
			{
				url: "http://localhost:5000/api/getTaskInfo",
				data: { responser: user, userid: id },
			},
			{ errorMessageMode: "modal", withToken: false },
		);
	}
};

//拉取数据
const FetchData = async (task_data: TaskParams[]) => {
	const res = await getTaskInfo(
		userInfoStore.userInfo?.name,
		userInfoStore.userInfo?.userid,
	);
	console.log(res.data);
	res.data.forEach((element) => {
		task_data.push(element);
	});

	console.log(task_data);

	emit("submitForm");
};

const upsertTaskInfo = async (task_data: TaskParams) => {
	deffHttp.post<TaskParams>(
		{
			url: "http://localhost:5000/api/upsertTaskInfo",
			data: task_data,
		},
		{ errorMessageMode: "modal", withToken: false },
	);
};

defineExpose({ FetchData, upsertTaskInfo });
</script>

<template>
	<div />
</template>
