export type Priority = 'Urgent' | 'Normal' | 'Common';
export const STATUS_LIST = ['Todo', 'Doing', 'Done', 'Stopped'] as const;
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
