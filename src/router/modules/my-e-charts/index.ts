//import { t } from '@/hooks/web/useI18n';
import type { AppRouteRecordRaw } from "@/router/type";
import component from "../components";

const MyEcharts: AppRouteRecordRaw[] = [
	{
		path: "/myecharts",
		name: "RtMyEcharts",
		component: () => import("@/views/components/my-e-charts/index.vue"),
		meta: { title: "MyEcharts", icon: "editor", position: 4 },
	},
];
export default MyEcharts;
