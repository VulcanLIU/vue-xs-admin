//此文件指定了访问路径 /status ，
// 对应的组件为 @/views/material-delivery-status/index.vue
// 并设置了路由元信息，如标题、图标和位置。

import { t } from "@/hooks/web/useI18n";
import type { AppRouteRecordRaw } from "@/router/type";

const MyEcharts: AppRouteRecordRaw[] = [
	{
		path: "/status",
		name: "RtStatus",
		component: () => import("@/views/material-delivery-status/index.vue"),
		meta: { title: "采购情况", icon: "editor", position: 4 },
	},
];
export default MyEcharts;
