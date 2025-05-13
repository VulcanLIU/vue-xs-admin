import axios from 'axios';
import { ref } from 'vue';
import type { ProductItem, RawData } from '../types/material';

//|-数据匹配-将扁平数据转化为树形数据-将从数据库传过来的数据，根据所属产品图号进行排列
const transformData = (rawData: RawData[]): ProductItem[] => {
  const productMap = new Map<string, ProductItem>();
  rawData.forEach(item => {
    const productKey = item.所属产品图号;
    if (!productMap.has(productKey)) {
      productMap.set(productKey, {
        index: String(productMap.size + 1),
        product_name: item.所属产品名称,
        product_number: item.所属产品图号,
        children: [],
      });
    }
    productMap.get(productKey)?.children.push({
      part_serial_number: item.物料编码,
      part_name: item.名称,
      part_number: item.图号,
      declared_Batch: item.第几批申报,
      arrival_status: item.是否到货,
    });
  });
  return Array.from(productMap.values());
};

//|-数据获取-API调用函数
export const fetchData = async (args: string = '') => {
  // eslint-disable-next-line no-var
  var raw_data: RawData[] = [];
  const raw_nesting_tabList = ref<ProductItem[]>([]);
  const nesting_tabList = ref<ProductItem[]>([]);
  try {
    //-|-使用API获取数据
    const response = await axios.get<RawData[]>(`http://localhost:5000/api/perchase_data${args}`);

    //-|-如果API无传入数据则是在索取全部数据-保存在raw_data变量中
    if (args === '') {
      raw_data = response.data.data;
      raw_nesting_tabList.value = transformData(response.data.data);
    }
    nesting_tabList.value = transformData(response.data.data);
  } catch (error) {
    console.error('数据获取失败:', error);
  }
  return [raw_data, raw_nesting_tabList.value, nesting_tabList.value];
};
