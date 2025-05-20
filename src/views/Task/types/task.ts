import type { TagProps } from 'element-plus';

export const PRIORITY_LIST = ['Urgent', 'Important', 'Common'] as const; //Urgent:紧急 Important:重要 Common:一般
export type Priority = (typeof PRIORITY_LIST)[number];
export const STATUS_LIST = ['Todo', 'Doing', 'Stopped', 'Done'] as const;
export type Status = (typeof STATUS_LIST)[number];

//接口-新接口TaskData应该实现该接口
export interface TaskParams {
  id: number; //任务ID
  parent_id?: number; //父任务ID
  issuer: string; //下发人
  responser: string; //责任人
  priority: Priority;
  status: Status; //任务状态
  discription: string; //任务描述
  content: string; //任务内容
  node: Date;
  sub_id?: number; //子任务ID
}

export interface UserParams {
  username: string;
  userid: number;
}

export interface Item {
  type: TagProps['type'];
  label: string;
}

export const labelMap: Record<Priority, Item> = {
  Urgent: { type: 'danger', label: '紧急' },
  Important: { type: 'warning', label: '重要' },
  Common: { type: 'primary', label: '一般' },
};

export const statusMap: Record<Status, string> = {
  Todo: '待办',
  Doing: '进行中',
  Stopped: '暂停',
  Done: '完成',
};
