<<<<<<< Updated upstream
<script lang="ts" setup generic="T extends Object">
import Form from "@/components/Form/index.vue";
import { h, reactive, ref, shallowRef } from "vue";
import type { FormProps } from "@/components/Form/types/from";
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
  (e: "submitForm", form_1: FormDataType): boolean;
}>();

const form = ref<FormDataType>({ product_name: "" });

const formOption = reactive<FormProps<FormDataType>>({
  labelPosition: "right",
  formItem: [
    {
      gutter: 30,
      itemList: [
        {
          component: "ElInput",
          label: "产品名称",
          prop: "product_name",
          rules: [{ required: false, type: "string" }],
          props: {
            onChange: (e: string) => {
              console.log(e);
            },
          },
        },
        {
          component: "ElInput",
          label: "产品图号",
          prop: "product_number",
          rules: [{ required: false, type: "string" }],
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
  if (val === "vertical") {
    formOption.formItem.map((res) => {
      res.md = 24;
      res.lg = 24;
      res.xl = 24;
      return res;
    });
  } else if (val === "horizontal") {
    formOption.formItem.map((res) => {
      delete res.md;
      delete res.lg;
      delete res.xl;
      return res;
    });
  }
};
handlerForm("horizontal");

//此处是检索，再通过emit发送给父组件
const submitForm = (value: FormDataType) => {
  emit("submitForm", shallowRef(value).value);
};

const resetForm = (value: FormDataType) => {
  for (const item in form.value) {
    form.value[item] = "";
    //console.log(item);
  }
  emit("submitForm", shallowRef(value).value);
};
</script>

<template>
  <div class="page-container">
    <Form
      ref="formRef"
      :form-data="form"
      :form-option="formOption"
      @submit-form="submitForm"
      @reset-form="resetForm"
    />
  </div>
</template>

<style lang="scss" scoped>
.config {
  margin-bottom: 20px;
}
</style>
=======
//查询表单组件
<script lang="ts" setup generic="T extends Object">
  //引入一个已经封装好的通用表单组件，能根据配置生成各种表单项（输入框、下拉框等）
  import Form from '@/components/Form/index.vue';
  // 引入 Vue 的响应式工具
  import { h, reactive, ref, shallowRef } from 'vue';
  // 引入表单组件的配置类型
  import type { FormProps } from '@/components/Form/types/from';
  //定义表单类型
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

  //定义表单的提交事件
  const emit = defineEmits<{
    (e: 'submitForm', form_1: FormDataType): boolean;
  }>();
  //初始化表单数据
  const form = ref<FormDataType>({ product_name: '' });

  //配置表单的外观和逻辑
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
  //切换表单的布局
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

  const resetForm = (value: FormDataType) => {
    for (const item in form.value) {
      form.value[item] = '';
      //console.log(item);
    }
    emit('submitForm', shallowRef(value).value);
  };
</script>

//引入一个名字叫form的表单
<template>
  <div class="page-container">
    <Form ref="formRef" :form-data="form" :form-option="formOption" @submit-form="submitForm" @reset-form="resetForm" />
  </div>
</template>

<style lang="scss" scoped>
  .config {
    margin-bottom: 20px;
  }
</style>
>>>>>>> Stashed changes
