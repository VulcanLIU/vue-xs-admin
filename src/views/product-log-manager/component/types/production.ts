import type { Slot } from "vue";

export interface ProductionItem {
	index: string; //序号
	product_name: string; //产品名称
	product_number: string; //产品图号
	//serial_number: string; //件号
	//quantity: number; //数量
	//manufacturer: string; //厂家
	//system: string; //所属系统
	technician: string; //技术员
	//repair_section: string; //修理工段
	//operator: string; //操作者
	//reinspection: string; //故检
	//inspection: string; //检验
	//leader: string; //挂钩领导
	repair_method: string; //修理方式
	//set_period: number; //成套
	//set_period_cycle: string; //成套周期
	//remark: string; //备注
	edit?: Slot; // 编辑按钮
	children?: ProductionSubItem;
}

export interface ProductionSubItem {
	//index: string; //序号
	//product_name: string; //产品名称
	//product_number: string; //产品图号
	serial_number: string; //件号
	quantity: number; //数量
	manufacturer: string; //厂家
	system: string; //所属系统
	//technician: string; //技术员
	repair_section: string; //修理工段
	operator: string; //操作者
	reinspection: string; //故检
	inspection: string; //检验
	leader: string; //挂钩领导
	//repair_method: string; //修理方式
	set_period: number; //成套
	set_period_cycle: string; //成套周期
	remark: string; //备注
}

// SQL 数据库中的数据结构
export interface ProductionItemINSQL {
	序号: string; //序号
	名称: string; //产品名称
	图号: string; //产品图号
	件号: string; //件号
	数量: number; //数量
	厂家: string; //厂家
	系统: string; //所属系统
	技术员: string; //技术员
	修理工段: string; //修理工段
	操作者: string; //操作者
	故检: string; //故检
	检验: string; //检验
	挂钩领导: string; //挂钩领导
	修理方式: string; //修理方式
	成套: number; //成套
	成套周期: string; //成套周期
	备注: string; //备注
}

export function TransformData(
	rawData: ProductionItemINSQL[],
): ProductionItem[] {
	const ProductionItemList: ProductionItem[] = [];
	rawData.forEach((item) => {
		if (
			ProductionItemList.findIndex((i) => i.product_name === item.名称) === -1
		) {
			// 如果已经存在该产品名称，则将其添加到子项中
			ProductionItemList.push({
				index: item.序号,
				product_name: item.名称,
				product_number: item.图号,
				technician: item.技术员,
				repair_method: item.修理方式,
				// edit 字段可选，通常由组件插槽赋值
			});
		}

		const parentIndex = ProductionItemList.findIndex(
			(i) => i.product_name === item.名称,
		);
		if (parentIndex !== -1) {
			// 如果父项存在，则将子项添加到该父项的 children 数组中
			if (!ProductionItemList[parentIndex].children) {
				ProductionItemList[parentIndex].children = [];
			}
			ProductionItemList[parentIndex].children.push({
				serial_number: item.件号,
				quantity: item.数量,
				manufacturer: item.厂家,
				system: item.系统,
				repair_section: item.修理工段,
				operator: item.操作者,
				reinspection: item.故检,
				inspection: item.检验,
				leader: item.挂钩领导,
				set_period: item.成套,
				set_period_cycle: item.成套周期,
				remark: item.备注,
			});
		}
	});
	return ProductionItemList;
}
