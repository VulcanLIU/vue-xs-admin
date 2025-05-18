import axios from "axios";
import { flatMap } from "lodash-es";
import { ref } from "vue";
import { rawData_2_ProductItemList } from "../types/material";
import type { ProductItem, RawData } from "../types/material";

//|-数据获取-API调用函数
export const fetchData = async (args: string = "") => {
    // eslint-disable-next-line no-var
    var raw_data: RawData[] = [];
    const raw_nesting_tabList = ref<ProductItem[]>([]);
    const nesting_tabList = ref<ProductItem[]>([]);
    try {
        //-|-使用API获取数据
        const response = await axios.get<RawData[]>(
            `http://localhost:5000/api/perchase_data${args}`,
        );

        //-|-如果API无传入数据则是在索取全部数据-保存在raw_data变量中
        if (args === "") {
            raw_data = response.data.data;
            raw_nesting_tabList.value = rawData_2_ProductItemList(
                response.data.data,
            );
        }
        nesting_tabList.value = rawData_2_ProductItemList(response.data.data);
    } catch (error) {
        console.error("数据获取失败:", error);
    }
    return [raw_data, raw_nesting_tabList.value, nesting_tabList.value];
};

//
export const upsertParts = async (part: Partial<RawData>) => {
    try {
        const response = await axios.post(
            `http://localhost:5000/api/upsert_part`,
            part,
        );
        if (response.status === 200) {
            console.log("数据更新成功:", response.data);
        }
        // 处理成功的响应
        return true;
    } catch (error) {
        console.error("数据更新失败:", error);
        return false;
    }
};

export const deleteParts = async (part: Partial<RawData>) => {
    try {
        const response = await axios.post(
            `http://localhost:5000/api/delete_part`,
            part,
        );
        if (response.status === 200) {
            console.log("数据更新成功:", response.data);
        }
        // 处理成功的响应
        return true;
    } catch (error) {
        console.error("数据更新失败:", error);
        return false;
    }
};
