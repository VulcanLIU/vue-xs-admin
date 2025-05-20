///数据

import type { TagProps } from "element-plus";
import type { Slot } from "vue";

export interface Item {
    type: TagProps["type"];
    label: string;
}
export const PROPERTY_LIST = ["寿命件", "必换件", "易损件", "改装件"] as const; //Urgent:紧急 Important:重要 Common:一般
export type Property = (typeof PROPERTY_LIST)[number];

export const labelMap: Record<Property, Item> = {
    必换件: { type: "danger", label: "必换件" },
    寿命件: { type: "warning", label: "寿命件" },
    易损件: { type: "primary", label: "易损件" },
    改装件: { type: "success", label: "改装件" },
};

//|-数据结构定义-定义接口返回的原始数据类型
//-|-XvQiuData,王胜尧这边写的需求表-在数据库中的字段
export interface XvQiuData {
    序号?: string; //序号
    物料编码?: string; //没到货的零件在后端匹配会出现无物料编码
    名称: string;
    图号: string;
    单位: string;
    数量: string;
    厂家: string;
    负责人: string;
    所属产品名称: string;
    所属产品图号: string;
    属性: string;
    第几批申报: string;
}

//-|-RawData,原始数据-数据库匹配后得到的数据
export interface RawData extends XvQiuData {
    库存数量: string;
    是否到货: string;
}

//-|-嵌套表内容结构接口
export interface PartItem {
    index?: string;
    part_serial_number?: string; //零件清单编号
    part_name: string; //零件名称
    part_number: string; //零件图号
    per_unit_quantity: string; //单机数量
    unit: string; //单位
    property: string; //属性
    declared_Batch: string; //申报批次
    arrival_status: string; //到货状态
    manufacturer: string; //厂家
    storage: string;
    edit?: Slot;
}
export interface ProductItem {
    index: string;
    product_name: string; //产品名称
    product_number: string; //产品图号
    part_arrival_rate?: string; //零件完备率
    person?: string; //责任人
    tooling_arrival_rate?: string; //工装完备率
    children?: PartItem[];
}

// 将 RawData 映射为 PartItem
export interface RawDataToPartItem<T extends RawData> {
    part_serial_number?: T["物料编码"];
    part_name: T["名称"];
    part_number: T["图号"];
    per_unit_quantity: T["数量"];
    property: T["属性"];
    declared_Batch: T["第几批申报"];
    manufacturer: T["厂家"];
    person?: T["负责人"];
    arrival_status?: T["是否到货"];
    // 其它字段可按需添加
}

// 将 RawData 映射为 ProductItem
export interface RawDataToProductItem<T extends RawData> {
    product_name: T["所属产品名称"];
    product_number: T["所属产品图号"];
    person?: T["负责人"];
    part_arrival_rate?: string; // 需要业务计算
    tooling_arrival_rate?: string; // 需要业务计算
    children?: RawDataToPartItem<T>[]; // 嵌套的零件列表
}

/**
 * 提取 RawData 转换为 PartItem
 */

export function rawDataToPartItem(raw: RawData): PartItem {
    return {
        index: raw.序号,
        part_serial_number: raw.物料编码,
        part_name: raw.名称,
        part_number: raw.图号,
        per_unit_quantity: raw.数量,
        unit: raw.单位,
        property: raw.属性,
        declared_Batch: raw.第几批申报,
        manufacturer: raw.厂家,
        arrival_status: raw.是否到货,
        storage: raw.库存数量,
    };
}

/**
 * 将 RawData[] 转换为 ProductItem[]
 */
export function rawData_2_ProductItemList(raw: RawData[]): ProductItem[] {
    const productItemList: ProductItem[] = [];
    raw.forEach((item) => {
        const productKey = item.所属产品图号;
        if (
            !productItemList.some(
                (product) => product.product_number === productKey,
            )
        ) {
            productItemList.push({
                index: String(productItemList.length + 1),
                product_name: item.所属产品名称,
                product_number: item.所属产品图号,
                person: item.负责人,
                children: [],
            });
        }
        const productItem = productItemList.find(
            (product) => product.product_number === productKey,
        );
        if (productItem) {
            productItem.children?.push(rawDataToPartItem(item));
        }
    });

    return productItemList; // 返回第一个产品项
}

/**
 * 将 ProductItem[] 转换为 RawData[]
 */
export function productItemList_2_RawData(
    productItemList: ProductItem[],
): RawData[] {
    const rawDataList: RawData[] = [];
    productItemList.forEach((product) => {
        if (product.children && product.children.length > 0) {
            product.children.forEach((part) => {
                rawDataList.push({
                    序号: part.index,
                    物料编码: part.part_serial_number,
                    名称: part.part_name,
                    图号: part.part_number,
                    单位: part.unit, // 如有需要可补充
                    数量: part.per_unit_quantity,
                    厂家: part.manufacturer,
                    负责人: product.person ?? "",
                    所属产品名称: product.product_name,
                    所属产品图号: product.product_number,
                    属性: part.property,
                    第几批申报: part.declared_Batch,
                    库存数量: "", // 如有需要可补充
                    是否到货: part.arrival_status,
                });
            });
        }
    });
    return rawDataList;
}

/**
 * 将 RawData[] 转换为 XvQiuData[]
 */
export function rawData_2_xvQiuData(rawData: RawData[]): XvQiuData[] {
    const xvQiuDataList: XvQiuData[] = [];
    rawData.forEach((item) => {
        xvQiuDataList.push({
            序号: item.序号,
            物料编码: item.物料编码,
            名称: item.名称,
            图号: item.图号,
            单位: item.单位,
            数量: item.数量,
            厂家: item.厂家,
            负责人: item.负责人,
            所属产品名称: item.所属产品名称,
            所属产品图号: item.所属产品图号,
            属性: item.属性,
            第几批申报: item.第几批申报,
        });
    });
    return xvQiuDataList;
}

/**
 * 将 RawData[] 转换为 XvQiuDatsa[]
 */
export function productItemList_2_xvQiuData(
    productItemList: ProductItem[],
): XvQiuData[] {
    return rawData_2_xvQiuData(productItemList_2_RawData(productItemList));
}
