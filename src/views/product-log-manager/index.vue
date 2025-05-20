<script>
// 导入Chart.js图表库（自动包含所有插件）
import Chart from "chart.js/auto";
import { ElCol, ElRow } from "element-plus";
// 导入Vue响应式API：computed(计算属性)、onMounted(挂载生命周期)、ref(响应式变量)、watch(监听器)
import { computed, onMounted, ref, watch } from "vue";
// 导入Vue路由钩子，用于页面跳转
import { useRouter } from "vue-router";
// 导入外部数据：下拉选项、数据映射表、生产步骤列表
import {
	dropdownOptions,
	fetchData,
	lineDataMap,
	optionDataMap,
	steps,
} from "./component/fetchdata";

export default {
	name: "CarProductionChart",
	setup() {
		// 组合式API入口函数
		// 图表canvas元素的引用（用于操作DOM）
		const chartRef = ref(null);
		// 初始化路由实例（用于页面跳转）
		const router = useRouter();
		// 下拉框选中值的响应式变量（初始值为'option1'）
		const selectedOption = ref("option1");
		// const lineData = ref();
		// const cylinderData = ref();
		// const steps = ref();
		// 计算属性：动态计算当前选中选项的柱状图数据百分比
		const barPercentages = computed(() => {
			// 获取当前选中选项的柱状图数据
			const currentData = optionDataMap[selectedOption.value];
			// 计算数据总和
			const total = currentData.reduce((sum, value) => sum + value, 0);
			// 计算每个数据点的百分比（保留两位小数）
			return currentData.map((value) => ((value / total) * 100).toFixed(2));
		});

		// 新增：折线图百分比计算（假设已在fetchdata.ts中定义lineDataMap）
		const linePercentages = computed(() => {
			const currentData = lineDataMap[selectedOption.value]; // 需在fetchdata.ts中添加lineDataMap
			const total = currentData.reduce((sum, value) => sum + value, 0);
			return currentData.map((value) => ((value / total) * 100).toFixed(2));
		});

		const selectedLabel = computed(() => {
			const option = dropdownOptions.value.find(
				(item) => item.value === selectedOption.value,
			);
			return option ? option.label : "";
		});
		// 图表核心数据配置（新增折线图数据集）
		const combinedData = computed(() => ({
			labels: steps.value,
			datasets: [
				// 原柱状图配置（保持不变）
				{
					type: "bar",
					label: "生产数据",
					data: optionDataMap[selectedOption.value],
					backgroundColor: "rgba(54, 162, 235, 0.5)",
					borderColor: "rgba(54, 162, 235, 1)",
					borderWidth: 1,
					tooltip: {
						callbacks: {
							label(context) {
								const percentage = barPercentages.value[context.dataIndex];
								return `${context.dataset.label}: ${context.raw} (${percentage}%)`;
							},
						},
					},
				},
				// 新增折线图配置
				{
					type: "line",
					label: "生产趋势",
					data: lineDataMap[selectedOption.value], // 折线图数据（需配合lineDataMap）
					backgroundColor: "rgba(75, 192, 192, 0.2)", // 半透明青绿色背景
					borderColor: "rgba(75, 192, 192, 1)", // 不透明青绿色线条
					borderWidth: 2, // 线条宽度
					tension: 0.4, // 曲线平滑度（0为直线，1为最平滑）
					pointBackgroundColor: "white", // 数据点背景色
					pointBorderColor: "rgba(75, 192, 192, 1)", // 数据点边框色
					pointRadius: 5, // 数据点半径
					fill: false, // 不填充线条下方区域
					tooltip: {
						callbacks: {
							label(context) {
								const percentage = linePercentages.value[context.dataIndex];
								return `${context.dataset.label}: ${context.raw} (${percentage}%)`;
							},
						},
					},
				},
			],
		}));

		// 图表样式和交互配置
		const chartOptions = {
			responsive: true, // 响应式布局（随容器尺寸变化）
			maintainAspectRatio: false, // 不保持宽高比（完全适配容器）
			layout: { padding: { top: 30, left: 50, right: 50 } }, // 图表内边距
			scales: {
				// 坐标轴配置
				y: {
					// 纵轴（数值轴）
					beginAtZero: true, // 从0开始显示
					title: { display: true, text: "数据值" }, // 轴标题（显示"数据值"）
					ticks: { stepSize: 10, max: 100 }, // 刻度间隔10，最大值100
				},
				x: {
					// 横轴（分类轴）
					title: {
						// 轴标题配置
						display: true, // 显示标题
						text: "生产步骤", // 标题内容
						position: "bottom", // 标题位置（底部）
					},
				},
			},
			plugins: {
				// 插件配置
				legend: { position: "top" }, // 图例位置（顶部）
				title: {
					// 图表标题配置
					display: true, // 显示标题
					text: "部附件生产数据展示", // 标题内容
					font: { size: 36, weight: "bold" }, // 标题字体（16号加粗）
				},
				annotation: {
					// 标注插件（当前空配置）
					annotations: [],
				},
			},
			// 点击事件处理逻辑（点击图表元素时触发）
			onClick: (event, elements, chart) => {
				if (elements.length > 0) {
					// 检测到点击图表元素
					// 跳转到名称为'HelloWorld'的路由页面
					router.push({ name: "HelloWorld" });
				}
			},
		};

		// 初始化图表的函数（处理销毁和重新创建逻辑）
		const initChart = async (args = "") => {
			//获取数据
			const result = await fetchData(args);

			if (!chartRef.value) return null; // 未获取到canvas元素时返回

			// 如果已存在图表实例，先销毁旧实例避免内存泄漏
			if (window.myChart) {
				window.myChart.destroy();
			}
			optionDataMap[selectedOption.value] = [...result.cylinderData];
			lineDataMap[selectedOption.value] = [...result.lineData];
			steps.value = [...result.steps];
			// 创建新的图表实例（绑定canvas上下文、数据和配置）
			window.myChart = new Chart(chartRef.value.getContext("2d"), {
				data: combinedData.value,
				options: chartOptions,
			});
		};

		// 监听下拉选项变化（动态更新图表数据）
		watch(selectedOption, () => {
			if (window.myChart) {
				// 图表实例存在时
				initChart(selectedLabel.value).then(window.myChart.update());
			}
		});

		// 组件挂载生命周期钩子（DOM渲染完成后执行）
		onMounted(() => {
			initChart(selectedLabel.value); // 调用初始化图表函数
		});

		// 暴露给模板的响应式变量和方法
		return {
			chartRef, // 图表canvas引用
			selectedOption, // 下拉框选中值
			options: dropdownOptions, // 下拉选项列表
		};
	},
};
</script>

<template>
	<!-- 主容器（包含定位上下文） -->
	<div class="product-log-container">
		<!-- 下拉框容器（绝对定位在右上角） -->
		<div class="dropdown-container" style="text-align: center">
			<!-- 下拉选择框（v-model双向绑定选中值） -->
			<ElRow>
				<ElCol :span="7">
					<span>修理方式</span>
				</ElCol>
				<ElCol :span="13">
					<select v-model="selectedOption" class="dropdown">
						<!-- 循环渲染下拉选项（使用options列表） -->
						<option
							v-for="option in options"
							:key="option.value"
							:value="option.value"
						>
							{{ option.label }}
							<!-- 显示选项文本 -->
						</option>
					</select>
				</ElCol>
			</ElRow>
		</div>

		<!-- 图表区域容器（控制尺寸和布局） -->
		<div class="chart-wrapper">
			<!-- 图表canvas元素（通过ref绑定到chartRef） -->
			<canvas ref="chartRef" />
		</div>
	</div>
</template>

<style scoped>
/* 主容器样式 */
.product-log-container {
	font-family: "Avenir", sans-serif; /* 字体 */
	text-align: left; /* 文本居中 */
	color: #1b5084; /* 文字颜色 */
	padding: 20px; /* 内边距 */
	position: relative; /* 相对定位（为子元素提供定位上下文） */
}

/* 下拉框容器样式 */
.dropdown-container {
	position: absolute; /* 绝对定位 */
	top: 20px; /* 距离顶部20px */
	right: 20px; /* 距离右侧20px */
	left: auto; /* 取消左侧定位 */
	z-index: 100; /* 层级（确保在图表上方） */
	background-color: rgba(21, 2, 2, 0); /* 背景色 */
	padding: 8px; /* 内边距 */
	border: 1px solid #0e0101; /* 边框 */
	border-radius: 4px; /* 圆角 */
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影 */
}

/* 下拉选择框样式 */
.dropdown {
	padding: 8px 16px; /* 内边距 */
	font-size: 16px; /* 字体大小 */
	border: 1px solid #ddd; /* 边框 */
	border-radius: 4px; /* 圆角 */
	width: 180px; /* 宽度 */
}

/* 图表区域容器样式 */
.chart-wrapper {
	width: 100%; /* 宽度占满父容器 */
	height: 600px; /* 高度500px */
	max-width: 1400px; /* 最大宽度1400px */
	margin: 80px auto 0; /* 顶部边距80px，左右自动居中 */
}
</style>
