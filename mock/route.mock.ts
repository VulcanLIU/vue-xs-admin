import path from "path";
import { defineFakeRoute } from "vite-plugin-fake-server/client";

//基础路由（所有用户共有）
const power = [
	{
		path: "/welcome",
		name: "RtWelcome",
	},
	// {
	//   path: '/3d_model_view',
	//   name: 'Rt3dModelView',
	// },
	{
		path: "/task",
		name: "RtTask",
		children: [
			{
				path: "taskIssued",
				name: "RtTaskIssued",
			},
			{
				path: "taskDelegated",
				name: "RtTaskDelegated",
			},
		],
	},
	{
		path: "/task2",
		name: "RtTask2",
	},
	{
		path: "/hello",
		name: "RtHello",
	},
	{
		path: "/status",
		name: "RtStatus",
		children: [
			{
				path: "myecharts",
				name: "RtMyEcharts",
			},
		],
	},
	{
		path: "/components",
		name: "RtComponents",
		children: [
			{
				path: "form",
				name: "RtForm",
			},
			{
				path: "table",
				name: "RtTable",
			},
			{
				path: "drag",
				name: "RtDrag",
			},
			{
				path: "count-to",
				name: "RtCountTo",
			},
			{
				path: "seamless-scroll",
				name: "RtSeamlessScroll",
			},
			{
				path: "date-time",
				name: "DateTime",
				children: [
					{
						path: "date-select",
						name: "RtDate",
					},
					{
						path: "calendar",
						name: "RtCalendar",
					},
				],
			},
		],
	},
	{
		path: "/echarts",
		name: "RtEcharts",

		children: [
			{
				path: "bar",
				name: "RtBar",
			},
			{
				path: "map",
				name: "RtMap",
			},
		],
	},
	{
		path: "/editor",
		name: "RtEditor",
		children: [
			{
				path: "rich-text",
				name: "RtRichText",
			},
			{
				path: "markdown",
				name: "RtMarkdown",
			},
			{
				path: "logic-flow",
				name: "RtLogicFlow",
			},
		],
	},
];

//管理员额外权限路由
const adminPermissionRouter = [
	{
		path: "/permissions",
		name: "RtPermissions",
		children: [
			{
				path: "page",
				name: "RtPermissionsPage",
			},
			{
				path: "test-page-admin",
				name: "RtPermissionsTestPageAdmin",
			},
		],
	},
	{
		path: "/nested",
		name: "RtNested",
		children: [
			{
				path: "menu1",
				name: "RtMenu1",
				children: [
					{
						path: "menu1-1",
						name: "RtMenu1-1",
					},
					{
						path: "menu1-2",
						name: "RtMenu1-2",
						children: [
							{
								path: "menu1-2-1",
								name: "RtMenu1-2-1",
							},
							{
								path: "menu1-2-2",
								name: "RtMenu1-2-2",
							},
						],
					},
					{
						path: "menu1-3",
						name: "RtMenu1-3",
					},
				],
			},
			{
				path: "menu2",
				name: "RtMenu2",
			},
		],
	},
	{
		path: "/external-link",
		name: "RtExternal",
		children: [
			{
				path: "https://github.com/SuperCuteXiaoSi/xiaosiAdmin",
				name: "RtGitLink",
			},
		],
	},
	{
		path: "/about",
		name: "RtAdminInfo",
		children: [
			{
				path: "",
				name: "RtAbout",
			},
		],
	},
	{
		path: "/details_page",
		name: "RtDetailsPage",
	},
];

//测试用户额外权限路由
const testPermissionRouter = [
	{
		path: "/permissions",
		name: "RtPermissions",
		children: [
			{
				path: "page",
				name: "RtPermissionsPage",
			},
			{
				path: "test-page-test",
				name: "RtPermissionsTestPageTest",
			},
		],
	},
];

// permissionRouter
//定义模拟接口：根据用户角色返回路由权限
export default defineFakeRoute([
	{
		url: "/mock_api/getRoute",
		timeout: 0,
		method: "post",
		response: ({ body }: { body: Recordable }) => {
			const { name } = body;
			if (name === "admin") {
				return {
					data: [...power, ...adminPermissionRouter],
					code: 1,
					message: "ok",
				};
			} else if (name === "test") {
				return {
					data: [...power, ...testPermissionRouter],
					code: 1,
					message: "ok",
				};
			} else {
				return {
					data: [],
					code: -1,
					message: "账号错误",
				};
			}
		},
	},
]);
