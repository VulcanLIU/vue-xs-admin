<script setup lang="tsx">
import { ElMessage, ElTag } from "element-plus";
import { reactive, ref } from "vue";
import Table from "@/components/Table/index.vue";
import type { TableColumnProps } from "@/components/Table/types/table";
import { deleteParts, upsertParts } from "./fetchdata";
import type { ProductionItem, ProductionSubItem } from "../types/production";
// 父表数据由父组件传入
const props = defineProps<{
	data: ProductionItem[];
}>();
const emit = defineEmits(["update:data"]);

// 主表格列
const nestingOption: TableColumnProps<ProductionItem>[] = [
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
	{ label: "技术员", prop: "technician" },
	{ label: "修理方式", prop: "repair_method" },
	{
		label: "编辑",
		prop: "edit",
		render: (slotData: any) => (
			<div style={{ textAlign: "center" }}>
				<el-row style={{ margin: "0 0 5px" }} justify="center" align="middle">
					<el-col span={12}>
						<el-button
							type="primary"
							size="small"
							onClick={() => {
								console.log(`${slotData.$index}`);
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
								console.log(`${slotData.$index}`);
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

//嵌套表格列
const getNgOption = (
	parentIndex: number,
): TableColumnProps<ProductionSubItem>[] => [
	{ label: "件号", prop: "serial_number" },
	{ label: "数量", prop: "quantity" },
	{ label: "厂家", prop: "manufacturer" },
	{ label: "数量", prop: "quantity" },
	{ label: "所属系统", prop: "system" },
];
</script>

<template>
	<div>
		<Table :data="data" border row-key="index" :option="nestingOption">
			<template #edit="slotData">
				<slot name="hh" v-bind="slotData" />
			</template>
		</Table>
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
