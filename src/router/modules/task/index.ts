/* Layout */
// import Layout from '@/layouts/index.vue'
// import AppMain from '@/layouts/components/AppMain/index.vue'
import type { AppRouteRecordRaw } from "@/router/type";

const taskPage: Array<AppRouteRecordRaw> = [
	{
		path: "/task",
		name: "RtTask",
		meta: {
			title: "任务管理",
			icon: "iEL-message-box",
			position: 2,
		},
		children: [
			{
				path: "taskIssued",
				name: "RtTaskIssued",
				component: () => import("@/views/Task/index.vue"),
				meta: {
					title: "下发的任务",
					type: "我下发的任务",
				},
			},
			{
				path: "taskDelegated",
				name: "RtTaskDelegated",
				component: () => import("@/views/Task/index.vue"),
				meta: {
					title: "待办的任务",
					type: "我待办的任务",
				},
			},
		],
	},
];

export default taskPage;
