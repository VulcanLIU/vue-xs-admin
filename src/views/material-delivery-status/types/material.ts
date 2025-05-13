///数据
//|-数据结构定义-定义接口返回的原始数据类型
export interface RawData {
  序号: string;
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
  库存数量: string;
  是否到货: string;
}

//-|-嵌套表内容结构接口
export interface PartItem {
  index?: string;
  part_serial_number?: string; //零件清单编号
  part_name: string; //零件名称
  part_number: string; //零件图号
  declared_Batch: string; //申报批次
  arrival_status: string; //到货状态
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
