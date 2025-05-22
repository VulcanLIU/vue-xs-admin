import axios from "axios";
import { ref } from "vue";
// 生产步骤数据
export const steps = ref([
	"生产步骤1",
	"生产步骤2",
	"生产步骤3",
	"生产步骤4",
	"生产步骤5",
	"生产步骤6",
]);

// 为每个选项定义对应的柱状图数据
export const optionDataMap = {
	option1: [120, 250, 30, 60, 80, 40, 70, 90, 10, 35], // 选项1的数据
	option2: [80, 180, 50, 70, 90, 30, 60, 80, 20, 40], // 选项2的数据
	option3: [150, 200, 40, 50, 70, 20, 50, 70, 15, 30], // 选项3的数据
	option4: [90, 220, 35, 65, 85, 35, 65, 85, 12, 32], // 选项4的数据
	option5: [110, 230, 25, 55, 75, 25, 55, 75, 18, 38], // 选项5的数据
	option6: [130, 240, 45, 75, 95, 45, 75, 95, 22, 42], // 选项6的数据
	option7: [100, 210, 55, 85, 105, 55, 85, 105, 25, 45], // 选项7的数据
};

// 下拉框选项数据
export const dropdownOptions = ref([
	{ value: "option1", label: "更换" },
	{ value: "option2", label: "维修" },
	{ value: "option3", label: "返厂" },
]);

// 新增：每个选项对应的折线图数据
export const lineDataMap = {
	option1: [15, 40, 25, 55, 75, 30, 65, 85, 12, 30],
	option2: [20, 35, 30, 50, 80, 25, 60, 70, 15, 25],
	option3: [18, 38, 28, 52, 78, 28, 62, 82, 14, 28],
	option4: [22, 32, 32, 48, 82, 22, 58, 78, 16, 22],
	option5: [19, 39, 29, 51, 79, 29, 61, 81, 13, 29],
	option6: [21, 31, 31, 49, 81, 21, 59, 79, 17, 21],
	option7: [17, 37, 27, 53, 77, 27, 63, 83, 11, 27],
};

export interface ExchangeData {
	//折线图
	lineData: number[];
	//柱状图
	cylinderData: number[];
	//生产步骤
	steps: string[];
}

//|-数据获取-API调用函数
export const fetchData = async (args: string = "") => {
	// eslint-disable-next-line no-var
	var raw_data: ExchangeData = {
		lineData: [],
		cylinderData: [],
		steps: [],
	};
	try {
		//-|-使用API获取数据
		const response = await axios.get<ExchangeData[]>(
			`http://localhost:5000/api/product_schedule?修理方式=${args}`,
		);

		//-|-如果API无传入数据则是在索取全部数据-保存在raw_data变量中
		if (args !== "") {
			raw_data.lineData = [...response.data.count_stages_current_array];
			raw_data.cylinderData = [...response.data.stage_complete_ratio_array];
			raw_data.steps = [...response.data.stages_select];
		}
	} catch (error) {
		console.error("数据获取失败:", error);
	}
	return raw_data;
};

//|-数据获取-API调用函数
export const fetchAllProductionData = async () => {
	const response = ref("");
	try {
		//-|-使用API获取数据
		response.value = await axios.get(
			`http://localhost:5000/api/product_schedule_all`,
		);
	} catch (error) {
		console.error("数据获取失败:", error);
	}
	return response.value.data.data;
};
