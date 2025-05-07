import { t } from '@/hooks/web/useI18n';
import type { AppRouteRecordRaw } from '@/router/type';

const MyTask: AppRouteRecordRaw[] = [
  {
    path: '/task-management',
    name: 'RtTask',
    component: () => import('@/views/my-task-management-v2/index.vue'),
    meta: { title: '任务管理', icon: 'editor', position: 5 },
  },
];
export default MyTask;
