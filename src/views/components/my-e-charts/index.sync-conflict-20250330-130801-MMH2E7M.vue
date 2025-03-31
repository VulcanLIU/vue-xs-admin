<script lang="ts" setup>
  import Form from '@/components/Form/index.vue';
  import axios from 'axios';
  import { ElInput } from 'element-plus';
  import { h, reactive, ref } from 'vue';
  import type { FormProps } from '@/components/Form/types/from';
  import DatabaseInterface from './DatabaseInterface/DatabaseInterface.vue';
  //import echarts from './echarts/echarts.vue';

  defineOptions({
    name: 'RtMyEcharts',
  });

  interface FormDataType {
    name: string;
    job: string;
    age: string;
    dateTime?: string;
    cascader?: string[];
    select?: string;
    checkbox?: string[];
    radio?: string;
    slotInput?: string;
    renderInput?: string;
    admin?: number;
  }

  const form = ref<FormDataType>({ name: '', job: '', age: '' });

  const formOption = reactive<FormProps<FormDataType>>({
    labelPosition: 'right',
    formItem: [
      {
        gutter: 30,
        itemList: [
          {
            component: 'ElInput',
            label: '姓名',
            prop: 'name',
            rules: [{ required: true, type: 'string' }],
            props: {
              onChange: (e: string) => {
                console.log(e);
              },

              // onChange: (e: any) => {
              //   console.log(e);
              // },
            },
          },
          {
            component: 'ElInput',
            label: '职业',
            prop: 'job',
            rules: [{ required: true, type: 'string' }],
            props: {
              onChange: (e: string) => {
                console.log(e);
              },

              // onChange: (e: any) => {
              //   console.log(e);
              // },
            },
          },
          {
            component: 'ElInput',
            label: '年龄',
            prop: 'age',
            rules: [{ required: true, type: 'string' }],
            props: {
              onChange: (e: string) => {
                console.log(e);
              },

              // onChange: (e: any) => {
              //   console.log(e);
              // },
            },
          },
        ],
      },
    ],
  });

  const handlerForm = async (val: string) => {
    if (val === 'vertical') {
      formOption.formItem.map(res => {
        res.md = 24;
        res.lg = 24;
        res.xl = 24;
        return res;
      });
    } else if (val === 'horizontal') {
      formOption.formItem.map(res => {
        delete res.md;
        delete res.lg;
        delete res.xl;
        return res;
      });
    }
  };
  handlerForm('vertical');

  const submitForm = (value: object) => {
    form.value = { ...value, ...form.value };
    //console.log(form.value);
  };
</script>

<template>
  <div class="page-container">
    <div class="config" class1="dd">
      <el-button @click="handlerForm('vertical')"> 垂直 </el-button>
      <el-button @click="handlerForm('horizontal')"> 水平 </el-button>
    </div>
    <Form ref="formRef" :form-data="form" :form-option="formOption" @submit-form="submitForm">
      <template #slotInput="{ formModel }">
        <ElInput v-model="formModel.slotInput" placeholder="自定义输入框" />
      </template>
    </Form>
    <DatabaseInterface />
  </div>
</template>

<style lang="scss" scoped>
  .config {
    margin-bottom: 20px;
  }
</style>
