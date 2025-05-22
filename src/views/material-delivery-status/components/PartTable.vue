<script setup lang="tsx">
import { ElMessage, ElTag } from "element-plus";
import { reactive, ref } from "vue";
import Table from "@/components/Table/index.vue";
import type { TableColumnProps } from "@/components/Table/types/table";
import { labelMap, productItemList_2_xvQiuData } from "../types/material";
import { deleteParts, upsertParts } from "./fetchdata";
import type { PartItem, ProductItem, XvQiuData } from "../types/material";
// 父表数据由父组件传入
const props = defineProps<{
	data: ProductItem[];
}>();
const emit = defineEmits(["update:data"]);

// 编辑弹窗相关
const editDialogVisible = ref(false);
const editForm = reactive<Partial<ProductItem & PartItem>>({});
const editFormItems = [
	{ label: "物料编码", prop: "part_serial_number" },
	{ label: "零件名称", prop: "part_name" },
	{ label: "零件图号", prop: "part_number" },
	{ label: "零件属性", prop: "property" },
	{ label: "单机数量", prop: "per_unit_quantity" },
	{ label: "单位", prop: "unit" },
	{ label: "厂家", prop: "manufacturer" },
	{ label: "申报批次", prop: "declared_Batch" },
	{ label: "责任人", prop: "person" },
	{ label: "所属产品名称", prop: "product_name" },
	{ label: "所属产品图号", prop: "product_number" },
];
const editFormRef = ref();
const editFormRules = {
	// part_serial_number: [
	//   { required: true, message: "物料编码必填", trigger: "blur" },
	// ],
	part_name: [{ required: true, message: "零件名称必填", trigger: "blur" }],
	person: [{ required: true, message: "责任人必填", trigger: "blur" }],
	part_number: [{ required: true, message: "零件图号必填", trigger: "blur" }],
	per_unit_quantity: [{ required: true, message: "单机数量", trigger: "blur" }],
	declared_Batc: [{ required: true, message: "申报批次必填", trigger: "blur" }],
	product_name: [
		{ required: true, message: "所属产品名称必填", trigger: "blur" },
	],
	product_number: [
		{ required: true, message: "所属产品图号必填", trigger: "blur" },
	],
	manufacturer: [{ required: true, message: "厂家必填", trigger: "blur" }],
	unit: [{ required: true, message: "单位必填", trigger: "blur" }],
	pro: [{ required: true, message: "属性必填", trigger: "blur" }],
};

let editParentIndex = -1;
let editSubIndex = -1;
// 打开弹窗
function openEditDialog(parentIndex: number, Index: number) {
	//Object.assign(editForm, {}); // 新增时清空
	if (
		parentIndex >= 0 &&
		Index >= 0 &&
		props.data[parentIndex] &&
		props.data[parentIndex].children &&
		props.data[parentIndex].children[Index]
	) {
		Object.assign(editForm, props.data[parentIndex]);
		Object.assign(editForm, props.data[parentIndex].children[Index]);
		editParentIndex = parentIndex;
		editSubIndex = Index;

		editDialogVisible.value = true;
	}
}

// 打开新增弹窗
function openNewDialog(parentIndex: number, Index: number) {
	// 清空表单
	Object.keys(editForm).forEach((key) => {
		// @ts-ignore
		editForm[key] = undefined;
	});
	// 设定父级索引，子级索引为-1表示新增
	editParentIndex = parentIndex;
	editSubIndex = -1;
	// 需要把所属产品信息带入
	if (props.data[parentIndex]) {
		editForm.product_name = props.data[parentIndex].product_name;
		editForm.product_number = props.data[parentIndex].product_number;
		editForm.person = props.data[parentIndex].person;
	}
	editDialogVisible.value = true;
}

//将其暴露给父组件
defineExpose({
	openEditDialog,
	openNewDialog,
});

// 提交表单
async function handleEditSubmit() {
	const formRef = editFormRef.value as any;
	try {
		await formRef.validate();
	} catch (error) {
		ElMessage.error("请完整填写表单后再提交");
		return;
	}
	const partItemKeys: (keyof PartItem)[] = [
		"index",
		"part_serial_number",
		"part_name",
		"part_number",
		"per_unit_quantity",
		"unit",
		"property",
		"declared_Batch",
		"manufacturer",
		"arrival_status",
	];
	const productItemKeys: (keyof ProductItem)[] = [
		"index",
		"product_name",
		"product_number",
		"person",
		"part_arrival_rate",
		"tooling_arrival_rate",
	];
	if (editParentIndex > -1) {
		const xvQiuData = ref<XvQiuData>();
		if (editSubIndex === -1) {
			// 新增
			const partItem = ref<PartItem>({} as PartItem);
			const productItem = ref<ProductItem>({} as ProductItem);
			// 将表单的数据放到新建的partItem、productItem类型变量中
			partItemKeys.forEach((key) => {
				partItem.value[key] = editForm[key] ?? "NULL";
			});
			productItemKeys.forEach((key) => {
				productItem.value[key] = editForm[key] ?? "NULL";
			});
			productItem.value.children = [partItem.value];
			xvQiuData.value = productItemList_2_xvQiuData([productItem.value])[0];
			upsertParts(xvQiuData.value).then((result) => {
				if (result) {
					ElMessage.success("新增成功");
					emit("update:data", props.data); // 通知父组件数据变化
				} else {
					ElMessage.error("新增失败");
				}
			});
		} else {
			// 编辑
			if (editForm.children?.length > 0) {
				const partItem = ref<PartItem>({} as PartItem);
				partItemKeys.forEach((key) => {
					partItem.value[key] = editForm[key] ?? "NULL";
				});
				editForm.children[editSubIndex] = partItem.value;
			}
			xvQiuData.value = productItemList_2_xvQiuData([editForm])[editSubIndex];
			upsertParts(xvQiuData.value).then((result) => {
				if (result) {
					ElMessage.success("编辑成功");
					emit("update:data", props.data); // 通知父组件数据变化
				} else {
					ElMessage.error("编辑失败");
				}
			});
		}
	}
	editDialogVisible.value = false;
}

// 删除确认对话框相关
const deleteDialogVisible = ref(false);
let deleteParentIndex = -1;
let deleteSubIndex = -1;

function openDeleteDialog(parentIndex: number, Index: number) {
	deleteParentIndex = parentIndex;
	deleteSubIndex = Index;
	deleteDialogVisible.value = true;
}

async function handleDeleteConfirm() {
	// 新增到嵌套表格
	if (deleteParentIndex > -1) {
		//将表单的数据放到新建的XvQiuData类型变量中
		const xvQiuData = ref<XvQiuData>();
		xvQiuData.value = productItemList_2_xvQiuData([
			props.data[deleteParentIndex],
		])[deleteSubIndex];
		deleteParts(xvQiuData.value).then((result) => {
			if (result) {
				ElMessage.success("删除成功");
				emit("update:data", props.data); // 通知父组件数据变化
			} else {
				ElMessage.error("删除失败");
			}
		});
	}
	deleteDialogVisible.value = false;
}

// 嵌套表格列
const getNgOption = (parentIndex: number): TableColumnProps<PartItem>[] => [
	{ label: "物料编码", prop: "part_serial_number" },
	{ label: "零件名称", prop: "part_name" },
	{ label: "零件图号", prop: "part_number" },
	{ label: "单机数量", prop: "per_unit_quantity" },
	{ label: "单位", prop: "unit" },
	{
		label: "零件属性",
		prop: "property",
		render: (slotData) => (
			<div style="text-align: center;">
				<ElTag
					type={
						labelMap[props.data[parentIndex].children[slotData.$index].property].type
					}
				>
					{props.data[parentIndex].children[slotData.$index].property}
				</ElTag>
			</div>
		),
	},
	{ label: "厂家", prop: "manufacturer" },
	{ label: "申报批次", prop: "declared_Batch" },
	{ label: "到货状态", prop: "arrival_status" },
	{
		label: " ",
		prop: "edit",
		renderHeader: (slotData: any) => (
			<div style="text-align: center;">
				<el-button
					type="primary"
					size="small"
					onClick={() => {
						openNewDialog(parentIndex, -1);
					}}
				>
					新增零件
				</el-button>
			</div>
		),
		render: (slotData: any) => (
			<div style={{ textAlign: "center" }}>
				<el-row style={{ margin: "0 0 5px" }} justify="center" align="middle">
					<el-col span={12}>
						<el-button
							type="primary"
							size="small"
							onClick={() => {
								openEditDialog(parentIndex, slotData.$index);
							}}
						>
							编辑
						</el-button>
					</el-col>
					<el-col span={12}>
						<el-button
							type="danger"
							size="small"
							onClick={() => {
								openDeleteDialog(parentIndex, slotData.$index);
							}}
						>
							删除
						</el-button>
					</el-col>
				</el-row>
			</div>
		),
	},
];

// 主表格列
const nestingOption: TableColumnProps<ProductItem>[] = [
	{
		type: "expand",
		render: (slotData: any) => {
			const parentIndex = slotData.$index;
			return (
				<div style={{ padding: "0 8px" }}>
					<Table
						class="warning-row"
						data={slotData.row.children || []}
						border
						option={getNgOption(parentIndex)}
					></Table>
				</div>
			);
		},
	},
	{ label: "序号", prop: "index", sortable: true },
	{ label: "产品名称", prop: "product_name" },
	{ label: "产品图号", prop: "product_number" },
	{ label: "责任人", prop: "person" },
	{ label: "零件完备率", prop: "part_arrival_rate", isSlots: true },
	//{ label: "工装完备率", prop: "tooling_arrival_rate" },
];
</script>

<template>
	<div>
		<Table :data="data" border row-key="index" :option="nestingOption">
			<template #part_arrival_rate="slotData">
				<slot name="hh" v-bind="slotData" />
			</template>
		</Table>
		<ElDialog v-model="editDialogVisible" title="编辑零件信息" width="1000px">
			<el-form
				ref="editFormRef"
				:model="editForm"
				:rules="editFormRules"
				label-width="150px"
				:inline="true"
				class="demo-form-inline"
			>
				<el-form-item
					v-for="item in editFormItems"
					:key="item.prop"
					:label="item.label"
					:prop="item.prop"
				>
					<el-input v-model="editForm[item.prop]" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="editDialogVisible = false">取消</el-button>
				<el-button type="primary" @click="handleEditSubmit">提交</el-button>
			</template>
		</ElDialog>
		<!-- 删除确认对话框 -->
		<ElDialog v-model="deleteDialogVisible" title="确认删除" width="400px">
			<span>确定要删除该条目吗？</span>
			<template #footer>
				<el-button @click="deleteDialogVisible = false">取消</el-button>
				<el-button type="danger" @click="handleDeleteConfirm">删除</el-button>
			</template>
		</ElDialog>
	</div>
</template>

<style scoped>
:deep(.el-table .warning-row) {
	--el-table-tr-bg-color: rgba(247, 170, 106, 0.074);
}

.demo-form-inline .el-input {
	--el-input-width: 300px;
}
</style>
