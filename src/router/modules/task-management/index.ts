/* Layout */
// import Layout from '@/layouts/index.vue'
// import AppMain from '@/layouts/components/AppMain/index.vue'
import type { AppRouteRecordRaw } from "@/router/type";

const taskPage: Array<AppRouteRecordRaw> = [
	{
		path: "/task2",
		name: "RtTask2",
		component: () => import("@/views/task-management/index.vue"),
		meta: {
			title: "任务管理",
			icon: "iEL-home-filled",
			position: 4,
		},
	},
];

export default taskPage;
