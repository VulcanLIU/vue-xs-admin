//主视图界面
<script setup lang="tsx">
import { saveAs } from "file-saver";
import { computed, onMounted, ref } from "vue";
import * as XLSX from "xlsx";
import { fetchData } from "./components/fetchdata";
import ComponentA, { type FormDataType } from "./components/form/index.vue";
import PartTable from "./components/PartTable.vue";
import type { ProductItem, RawData } from "./types/material";

defineOptions({
 name: "RtStatus",
});

const partTableRef = ref();

///进度卡片显示Speedlist
const speedList_1 = ref([
 {
  title: "附件可修率",
  online: 1,
  total: 1,
 },
]);

///进度卡片显示Speedlist
const speedList_2 = ref([
 {
  title: "物料到货率",
  online: 39,
  total: 100,
 },
]);

///全部数据
const raw_data = ref<RawData[]>([]);
///表格

//-|-嵌套表格内容声明
const nesting_tabList = ref<ProductItem[]>([]); //用户检索后的数据
const raw_nesting_tabList = ref<ProductItem[]>([]); //全部数据

const value = (online: number, total: number) => {
 if (online === 0 && total === 0) {
  return 0;
 }
 return Math.round((online / total) * 100);
};
//|-数据计算-进度数据自动计算
const statistics = computed(() => {
 //-|-新建一个盛放结果的数组
 const rateArray: number[] = new Array(nesting_tabList.value.length);
 const rateArray_str: string[] = new Array(nesting_tabList.value.length);
 //--|-循环读取嵌套表格中的条目
 let total = 0;
 let arrival_status_couter = 0;
 for (const key in nesting_tabList.value) {
  //---|-对每个条目下总数与“是”进行单独计数
  total = nesting_tabList.value[key].children.length;
  arrival_status_couter = 0;
  for (const child_item in nesting_tabList.value[key].children) {
   //console.log(nesting_tabList.value[key].children[child_item].arrival_status);
   if (
    nesting_tabList.value[key].children[child_item].arrival_status === "是"
   ) {
    arrival_status_couter++;
   }
  }
  //---|-将计算结果添加到数组中
  rateArray[key] = value(arrival_status_couter, total);
  rateArray_str[key] = `${arrival_status_couter}/${total}`;
  //console.log(total, arrival_status_couter, rateArray[key]);
 }
 //-|-计算物料到货率
 let total_part = 0;
 let qualified_part = 0;
 if (raw_data.value.length > 0) {
  total_part = raw_data.value.length;
  qualified_part = raw_data.value.filter(
   (item) => item?.是否到货 === "是",
  ).length;
 }

 //-|-计算附件可修率
 //--|-新建一个盛放结果的数组
 const rateArray_all: number[] = new Array(raw_nesting_tabList.value.length);
 //--|-循环读取嵌套表格中的条目
 let total_product_num = 0;
 let total_arrival_status_couter = 0;
 for (const key in raw_nesting_tabList.value) {
  //---|-对每个条目下总数与“是”进行单独计数
  total_product_num = raw_nesting_tabList.value[key].children.length;
  total_arrival_status_couter = 0;
  for (const child_item in raw_nesting_tabList.value[key].children) {
   if (
    raw_nesting_tabList.value[key].children[child_item].arrival_status === "是"
   ) {
    total_arrival_status_couter++;
   }
  }
  //---|-将计算结果添加到数组中
  rateArray_all[key] = value(total_arrival_status_couter, total_product_num);
 }
 //--|-挑选出rate为100的条目
 const total_product = rateArray_all.length;
 const qualified_product = rateArray_all.filter(
  (item) => item?.valueOf() === 100,
 ).length;
 return {
  total_part,
  qualified_part,
  total_product,
  qualified_product,
  rateArray_str,
  rateArray,
 };
});

//|-数据检索
const submitForm = (value: FormDataType) => {
 const args = ref("");
 const index = ref(0);
 for (const key in value) {
  if (value[key] !== "") {
   if (index.value === 0) {
    args.value = `${args.value}?${key}=${value[key]}`;
   } else {
    args.value = `${args.value}&${key}=${value[key]}`;
   }
   index.value++;
  }
 }
 fetchData(args.value).then((result) => {
  if (args.value === "") {
   raw_data.value = result[0];
  }
  raw_nesting_tabList.value = result[1];
  nesting_tabList.value = result[2];
 });
 console.log(args.value);
};

// 导出主表数据为 Excel
function exportToExcel() {
 // 1. 构造表头
 const header = [
  "序号",
  "产品名称",
  "产品图号",
  "责任人",
  "零件完备率",
  "工装完备率",
 ];
 // 2. 构造数据
 const data = nesting_tabList.value.map((item, idx) => [
  item.index,
  item.product_name,
  item.product_number,
  item.person,
  item.part_arrival_rate,
  item.tooling_arrival_rate,
 ]);
 // 3. 合并表头和数据
 const wsData = [header, ...data];
 // 4. 创建 worksheet 和 workbook
 const ws = XLSX.utils.aoa_to_sheet(wsData);
 const wb = XLSX.utils.book_new();
 XLSX.utils.book_append_sheet(wb, ws, "产品表");
 // 5. 导出
 const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
 saveAs(new Blob([wbout], { type: "application/octet-stream" }), "产品表.xlsx");
}

function onUpdateData() {
 fetchData().then((result) => {
  raw_data.value = result[0];
  raw_nesting_tabList.value = result[1];
  nesting_tabList.value = result[2];
 });
}
//初始化加载-页面初始化自动装载fetchData()函数
onMounted(() => {
 onUpdateData();
});
</script>

<template>
 <div class="enter-y">
  <!--进度卡片-->
  <el-row :gutter="20">
   <el-col
    v-for="(item, index) in speedList_1"
    :key="index"
    :xs="24"
    :sm="24"
    :md="6"
    :lg="6"
    :xl="6"
   >
    <el-card class="box-card">
     <template #header>
      <div class="card-header cursor text-xl">
       <span>{{ item.title }}</span>
       <SvgIcon name="iEL-arrow-right" />
      </div>
     </template>
     <div class="card-content">
      <div class="numerical-value">
       <span class="number">
        {{ statistics.qualified_product }}/{{ statistics.total_product }}
       </span>
       <span>可修/总数</span>
      </div>
      <el-progress
       :text-inside="true"
       :stroke-width="26"
       :percentage="
        value(statistics.qualified_product, statistics.total_product)
       "
      />
     </div>
    </el-card>
   </el-col>
   <el-col
    v-for="(item, index) in speedList_2"
    :key="index"
    :xs="24"
    :sm="24"
    :md="6"
    :lg="6"
    :xl="6"
   >
    <el-card class="box-card">
     <template #header>
      <div class="card-header cursor text-xl">
       <span>{{ item.title }}</span>
       <SvgIcon name="iEL-arrow-right" />
      </div>
     </template>
     <div class="card-content">
      <div class="numerical-value">
       <span class="number">
        {{ statistics.qualified_part }}/{{ statistics.total_part }}
       </span>
       <span>到货/总数</span>
      </div>
      <el-progress
       :text-inside="true"
       :stroke-width="26"
       :percentage="value(statistics.qualified_part, statistics.total_part)"
      />
     </div>
    </el-card>
   </el-col>
  </el-row>
  <!--嵌套表格-->
  <el-card class="box-card">
   <ComponentA @submit-form="submitForm" />
   <template #header>
    <div class="card-header">
     <span class="text-xl">产品查询</span>
     <el-button type="primary" style="margin: 12px" @click="exportToExcel">
      导出Excel
     </el-button>
    </div>
   </template>
   <PartTable
    ref="partTableRef"
    :data="nesting_tabList"
    @update:data="(val) => onUpdateData()"
   >
    <template #hh="slotData">
     <el-progress
      :text-inside="true"
      :stroke-width="26"
      :percentage="statistics.rateArray[slotData.$index]"
     />
     <span>{{ statistics.rateArray_str[slotData.$index] }}</span>
    </template>
   </PartTable>
  </el-card>
 </div>
</template>

<style lang="scss" scoped>
.box-card {
 margin-bottom: 20px;
 :deep(.el-card__header) {
  padding-bottom: 0;
  border: none;
 }
 .card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
 }
 .card-content {
  :deep(.el-progress-bar__outer) {
   height: 17px !important;
  }
  .numerical-value {
   display: flex;
   align-items: flex-end;
   justify-content: space-between;
   margin-bottom: 10px;
   .number {
    color: var(--text-color-primary);
    font-size: var(--font-size-extra-large);
    font-weight: 600;
   }
  }
 }
}
</style>
