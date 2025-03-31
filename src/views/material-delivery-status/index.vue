<script setup lang="ts">
  import Table from '@/components/Table/index.vue';
  import { h, ref } from 'vue';
  import type { TableColumnProps } from '@/components/Table/types/table';
  defineOptions({
    name: 'RtStatus',
  });

  const speedList = [
    {
      title: '附件可修率',
      online: 24,
      total: 70,
    },
    {
      title: '物料到货率',
      online: 39,
      total: 100,
    },
  ];

  const value = (online: number, total: number) => {
    return Math.round((online / total) * 100);
  };

  interface TableData {
    date: string;
    name: string;
    address: string;
    children?: TableData[];
  }
  const option: TableColumnProps<TableData>[] = [
    {
      label: 'Date',
      prop: 'date',
      sortable: true,
    },
    {
      label: 'PreName',
      children: [
        {
          label: 'Name',
          prop: 'name',
          isSlots: true,
        },
      ],
    },
    {
      label: 'Address',
      prop: 'address',
      render_header: (slotData: any) => {
        return h('span', {}, `render_header：${slotData.customItem.label}`);
      },
      render: (slotData: any) => {
        return h('span', {}, `render：${slotData.row.address}`);
      },
    },
  ];
  const tabList = ref<TableData[]>([
    {
      date: '2016-05-03',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-02',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-04',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
      children: [
        {
          date: '2016-05-05',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-06',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
      ],
    },
    {
      date: '2016-05-01',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
  ]);
</script>

<template>
  <el-row :gutter="20" class="enter-y">
    <el-col v-for="(item, index) in speedList" :key="index" :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
      <el-card class="box-card">
        <template #header>
          <div class="card-header cursor">
            <span>{{ item.title }}</span>
            <SvgIcon name="iEL-arrow-right" />
          </div>
        </template>
        <div class="card-content">
          <div class="numerical-value">
            <span class="number">{{ item.online }}/{{ item.total }}</span>
            <span>Online/Total</span>
          </div>
          <el-progress :text-inside="true" :stroke-width="26" :percentage="value(item.online, item.total)" />
        </div>
      </el-card>
    </el-col>
  </el-row>
  <el-row :gutter="20" class="enter-y">
    <el-col>
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>表格</span>
          </div>
        </template>

        <Table :data="tabList" border row-key="date" :option="option">
          <template #name_header="slotData">
            <span>{{ `插槽：${slotData.customItem.label}` }}</span>
          </template>
          <template #name="slotData">
            <span>{{ slotData.row.name }}</span>
          </template>
        </Table>
      </el-card>
    </el-col>
  </el-row>
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
