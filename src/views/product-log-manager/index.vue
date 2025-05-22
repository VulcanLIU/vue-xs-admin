<script>
import { computed, onMounted, ref } from "vue";
import { fetchAllProductionData } from "./component/fetchdata";
import ProductionChart from "./component/production-chart/ProductionChart.vue";
import ProductionTable from "./component/production-table/ProductionTable.vue";
import { TransformData } from "./component/types/production";
export default {
	name: "CarProductionChart",
	components: { ProductionChart, ProductionTable },
	setup() {
		const tableData = ref([]);
		onMounted(async () => {
			tableData.value = TransformData(await fetchAllProductionData());
			console.log(tableData.value);
		});
		return {
			tableData,
		};
	},
};
</script>

<template>
	<!-- 主容器（包含定位上下文） -->
	<div>
		<ElCard><ProductionChart /></ElCard>
		<ElCard style="margin-top: 20px">
			<ProductionTable :data="tableData" />
		</ElCard>
	</div>
</template>

<style scoped></style>
