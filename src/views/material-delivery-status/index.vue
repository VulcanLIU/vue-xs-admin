<script setup lang="tsx">
  import Table from '@/components/Table/index.vue';
  import axios from 'axios';
  import { computed, h, onMounted, ref } from 'vue';
  import $ from 'wangeditor/dist/utils/dom-core';
  import type { TableColumnProps } from '@/components/Table/types/table';
  import ComponentA, { type FormDataType } from './components/form/index.vue';
  defineOptions({
    name: 'RtStatus',
  });

  ///进度卡片显示Speedlist
  const speedList_1 = ref([
    {
      title: '附件可修率',
      online: 1,
      total: 1,
    },
  ]);

  ///进度卡片显示Speedlist
  const speedList_2 = ref([
    {
      title: '物料到货率',
      online: 39,
      total: 100,
    },
  ]);

  ///表格
  //|-扁平表格
  //-|-扁平表格内容结构-定义该表格中的列名数据结构
  interface TableData {
    index: string; //序号
    part_serial_number: string; //零件清单编号
    part_name: string; //零件名称
    part_number: string; //零件图号
    part_arrival_rate: string; //零件完备率
    product_name: string; //产品名称
    product_number: string; //产品图号
    unit: string; //单位
    quantity: number; //数量
    manufacturer: string; //制造厂商
    purchasing_manager: string; //负责人
    per_quantity: number; //单机数量
    arrival_status: string; //到货状态
    declared_Batch: string; //申报批次
    repairable_status: string; //可维修状态
    tooling_arrival_rate: string; //工装完备率
    children?: TableData[];
  }
  //-|-扁平表格格式定义-option
  const option: TableColumnProps<TableData>[] = [
    {
      label: '序号',
      prop: 'index',
      sortable: true,
    },
    {
      label: '物料编码',
      prop: 'part_serial_number',
      sortable: true,
    },
    {
      label: '名称',
      prop: 'part_name',
      sortable: true,
    },
    {
      label: '图号',
      prop: 'part_number',
      sortable: true,
    },
    {
      label: '单位',
      prop: 'unit',
      sortable: true,
    },
    {
      label: '数量',
      prop: 'quantity',
      sortable: true,
    },
    {
      label: '产品名称',
      prop: 'product_name',
      sortable: true,
    },
    {
      label: '产品图号',
      prop: 'product_number',
      sortable: true,
    },
    {
      label: '申报批次',
      prop: 'declared_Batch',
      sortable: true,
    },
    {
      label: '制造厂商',
      prop: 'manufacturer',
      sortable: true,
    },
    {
      label: '负责人',
      prop: 'purchasing_manager',
      sortable: true,
    },
    {
      label: '单机数量',
      prop: 'per_quantity',
      sortable: true,
    },
    {
      label: '到货状态',
      prop: 'arrival_status',
      sortable: true,
    },
  ];
  //-|-扁平表格内容声明
  const tabList = ref<TableData[]>([]);

  //|-嵌套表格
  //-|-嵌套表内容结构接口
  interface PartItem {
    index: string;
    part_serial_number: string; //零件清单编号
    part_name: string; //零件名称
    part_number: string; //零件图号
    declared_Batch: string; //申报批次
    arrival_status: string; //到货状态
  }
  interface ProductItem {
    index: string;
    product_name: string; //产品名称
    product_number: string; //产品图号
    part_arrival_rate?: string; //零件完备率
    tooling_arrival_rate?: string; //工装完备率
    children?: PartItem[];
  }
  //-|-嵌套表格格式定义-nestingOption
  const nestingOption: TableColumnProps<ProductItem>[] = [
    {
      type: 'expand',
      render: (slotData: any) => {
        const ngOption: TableColumnProps<PartItem>[] = [
          {
            label: '物料编码',
            prop: 'part_serial_number',
            sortable: true,
          },
          {
            label: '零件名称',
            prop: 'part_name',
          },
          {
            label: '零件图号',
            prop: 'part_number',
          },
          {
            label: '申报批次',
            prop: 'declared_Batch',
          },
          {
            label: '到货状态',
            prop: 'arrival_status',
          },
        ];
        return (
          <div style={{ padding: '0 8px' }}>
            <Table data={slotData.row.children || []} border option={ngOption}></Table>
          </div>
        );
      },
    },
    {
      label: '序号',
      prop: 'index',
      sortable: true,
    },
    {
      label: '产品名称',
      prop: 'product_name',
    },
    {
      label: '产品图号',
      prop: 'product_number',
    },
    {
      label: '零件完备率',
      prop: 'part_arrival_rate',
      isSlots: true,
    },
    {
      label: '工装完备率',
      prop: 'tooling_arrival_rate',
    },
  ];
  //-|-嵌套表格内容声明
  const nesting_tabList = ref<ProductItem[]>([]);
  const raw_nesting_tabList = ref<ProductItem[]>([]);
  ///数据
  //|-数据结构定义-定义接口返回的原始数据类型
  interface RawData {
    序号: string;
    清单编号: string;
    名称: string;
    图号: string;
    所属产品名称: string;
    所属产品图号: string;
    单位: string;
    数量: string;
    厂家: string;
    负责人: string;
    申报批次: string;
    单机数量: string;
    是否到货: string;
  }
  //|-数据匹配-将扁平数据转化为树形数据
  const transformData = (rawData: RawData[]): ProductItem[] => {
    const productMap = new Map<string, ProductItem>();
    rawData.forEach(item => {
      const productKey = `${item.所属产品名称}`;
      if (!productMap.has(productKey)) {
        productMap.set(productKey, {
          index: String(productMap.size + 1),
          product_name: item.所属产品名称,
          product_number: item.所属产品图号,
          children: [],
        });
      }
      productMap.get(productKey)?.children.push({
        part_serial_number: item.清单编号,
        part_name: item.名称,
        part_number: item.图号,
        declared_Batch: item.申报批次,
        arrival_status: item.是否到货,
      });
    });
    return Array.from(productMap.values());
  };

  //|-数据获取-API调用函数
  const fetchData = async (args: string = '') => {
    try {
      const response = await axios.get(`http://localhost:5000/api/perchase_data${args}`);
      if (args === '') {
        raw_nesting_tabList.value = transformData(response.data.data);
      }
      nesting_tabList.value = transformData(response.data.data);
    } catch (error) {
      console.error('数据获取失败:', error);
    }
  };

  const value = (online: number, total: number) => {
    return Math.round((online / total) * 100);
  };
  //|-数据计算-进度数据自动计算
  const statistics = computed(() => {
    //-|-新建一个盛放结果的数组
    const rateArray: number[] = new Array(nesting_tabList.value.length);
    //-|-循环读取嵌套表格中的条目
    let total = 0;
    let arrival_status_couter = 0;
    for (const key in nesting_tabList.value) {
      //--|-对每个条目下总数与“是”进行单独计数
      total = nesting_tabList.value[key].children.length;
      arrival_status_couter = 0;
      for (const child_item in nesting_tabList.value[key].children) {
        //console.log(nesting_tabList.value[key].children[child_item].arrival_status);
        if (nesting_tabList.value[key].children[child_item].arrival_status === '是') {
          arrival_status_couter++;
        }
      }
      //--|-将计算结果添加到数组中
      rateArray[key] = value(arrival_status_couter, total);
      console.log(total, arrival_status_couter, rateArray[key]);
    }
    const total_all = tabList.value.length;
    const qualified = tabList.value.filter(item => item.arrival_status === '是').length;
    return { total_all, qualified, rateArray };
  });

  //|-数据检索
  const submitForm = (value: FormDataType) => {
    const args = ref('');
    const index = ref(0);
    for (const key in value) {
      if (value[key] !== '') {
        if (index.value === 0) {
          args.value = `${args.value}?${key}=${value[key]}`;
        } else {
          args.value = `${args.value}&${key}=${value[key]}`;
        }
        index.value++;
      }
    }
    fetchData(args.value);
    console.log(args.value);
  };
  //初始化加载-页面初始化自动装载fetchData()函数
  onMounted(() => {
    fetchData();
  });
</script>
<template>
  <div>
    <!--进度卡片-->
    <el-row :gutter="20" class="enter-y">
      <el-col v-for="(item, index) in speedList_1" :key="index" :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
        <el-card class="box-card">
          <template #header>
            <div class="card-header cursor">
              <span>{{ item.title }}</span>
              <SvgIcon name="iEL-arrow-right" />
            </div>
          </template>
          <div class="card-content">
            <div class="numerical-value">
              <span class="number">{{ statistics.qualified }}/{{ statistics.total_all }}</span>
              <span>可修/总数</span>
            </div>
            <el-progress :text-inside="true" :stroke-width="26" :percentage="value(item.online, item.total)" />
          </div>
        </el-card>
      </el-col>
      <el-col v-for="(item, index) in speedList_2" :key="index" :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
        <el-card class="box-card">
          <template #header>
            <div class="card-header cursor">
              <span>{{ item.title }}</span>
              <SvgIcon name="iEL-arrow-right" />
            </div>
          </template>
          <div class="card-content">
            <div class="numerical-value">
              <span class="number">{{ statistics.qualified }}/{{ statistics.total_all }}</span>
              <span>到货/总数</span>
            </div>
            <el-progress :text-inside="true" :stroke-width="26" :percentage="value(item.online, item.total)" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!--嵌套表格-->
    <el-card class="box-card">
      <ComponentA @submit-form="submitForm" />
      <template #header>
        <div class="card-header">
          <span>产品查询</span>
        </div>
      </template>
      <Table :data="nesting_tabList" border row-key="index" :option="nestingOption">
        <template #part_arrival_rate="slotData">
          <el-progress :text-inside="true" :stroke-width="26" :percentage="statistics.rateArray[slotData.$index]" />
        </template>
      </Table>
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
