<script lang="ts" setup generic="T extends Object">
  import Form from '@/components/Form/index.vue';
  import { h, reactive, ref, shallowRef } from 'vue';
  import type { FormProps } from '@/components/Form/types/from';
  //componentA组件
  export interface FormDataType {
    product_name?: string;
    product_number?: string;
    dateTime?: string;
    cascader?: string[];
    select?: string;
    checkbox?: string[];
    radio?: string;
    slotInput?: string;
    renderInput?: string;
    admin?: number;
  }
  const emit = defineEmits<{
    (e: 'submitForm', form_1: FormDataType): boolean;
  }>();

  const form = ref<FormDataType>({ product_name: '' });

  const formOption = reactive<FormProps<FormDataType>>({
    labelPosition: 'right',
    formItem: [
      {
        gutter: 30,
        itemList: [
          {
            component: 'ElInput',
            label: '产品名称',
            prop: 'product_name',
            rules: [{ required: false, type: 'string' }],
            props: {
              onChange: (e: string) => {
                console.log(e);
              },
            },
          },
          {
            component: 'ElInput',
            label: '产品图号',
            prop: 'product_number',
            rules: [{ required: false, type: 'string' }],
            props: {
              onChange: (e: string) => {
                console.log(e);
              },
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
  handlerForm('horizontal');

  //此处是检索，再通过emit发送给父组件
  const submitForm = (value: FormDataType) => {
    emit('submitForm', shallowRef(value).value);
  };
</script>

<template>
  <div class="page-container">
    <Form ref="formRef" :form-data="form" :form-option="formOption" @submit-form="submitForm" />
  </div>
</template>

<style lang="scss" scoped>
  .config {
    margin-bottom: 20px;
  }
</style>
