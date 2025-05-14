<script setup lang="tsx">
import Table from "@/components/Table/index.vue";
import axios from "axios";
import { ElMessage } from "element-plus";
// filepath: e:\1-projects\2-Vue\2-My-vue-xs-admin\src\views\material-delivery-status\components\PartTable.vue
import { reactive, ref } from "vue";
import type { TableColumnProps } from "@/components/Table/types/table";
import type { PartItem, ProductItem } from "../types/material";

// 父表数据由父组件传入
const props = defineProps<{
  data: ProductItem[];
}>();
const emit = defineEmits(["update:data"]);

// 编辑弹窗相关
const editDialogVisible = ref(false);
const editForm = reactive<Partial<PartItem>>({});
const editFormRef = ref();
const editFormRules = {
  part_serial_number: [
    { required: true, message: "物料编码必填", trigger: "blur" },
  ],
  part_name: [{ required: true, message: "零件名称必填", trigger: "blur" }],
  // ...其他校验规则...
};
let editParentIndex = -1;

// 打开弹窗
function openEditDialog(parentIndex: number) {
  Object.assign(editForm, {}); // 新增时清空
  editParentIndex = parentIndex;
  editDialogVisible.value = true;
}

//将其暴露给父组件
defineExpose({
  openEditDialog,
});

// 提交表单
async function handleEditSubmit() {
  const formRef = editFormRef.value as any;
  await formRef.validate();
  // 新增到嵌套表格
  if (editParentIndex > -1) {
    props.data[editParentIndex].children.push({ ...editForm });
    emit("update:data", props.data); // 通知父组件数据变化
    // 发送到后端
    await axios.post("/api/your-endpoint", editForm); // 替换为你的接口
    ElMessage.success("新增成功");
  }
  editDialogVisible.value = false;
}

// 嵌套表格列
const getNgOption = (parentIndex: number): TableColumnProps<PartItem>[] => [
  { label: "物料编码", prop: "part_serial_number", sortable: true },
  { label: "零件名称", prop: "part_name" },
  { label: "零件图号", prop: "part_number" },
  { label: "申报批次", prop: "declared_Batch" },
  { label: "到货状态", prop: "arrival_status" },
  {
    label: "编辑",
    prop: "edit",
    render: () => (
      <el-button
        type="primary"
        size="small"
        onClick={() => openEditDialog(parentIndex)}
      >
        新增
      </el-button>
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
  { label: "工装完备率", prop: "tooling_arrival_rate" },
];
</script>

<template>
  <Table :data="data" border row-key="index" :option="nestingOption">
    <template #part_arrival_rate="slotData">
      <slot name="hh" v-bind="slotData" />
    </template>
  </Table>
  <el-dialog v-model="editDialogVisible" title="新增零件" width="400px">
    <el-form
      ref="editFormRef"
      :model="editForm"
      :rules="editFormRules"
      label-width="100px"
    >
      <el-form-item label="物料编码" prop="part_serial_number">
        <el-input v-model="editForm.part_serial_number" />
      </el-form-item>
      <el-form-item label="零件名称" prop="part_name">
        <el-input v-model="editForm.part_name" />
      </el-form-item>
      <!-- 其他表单项 -->
      <el-form-item label="到货状态" prop="arrival_status">
        <el-select v-model="editForm.arrival_status" placeholder="请选择">
          <el-option label="是" value="是" />
          <el-option label="否" value="否" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleEditSubmit">提交</el-button>
    </template>
  </el-dialog>
</template>
