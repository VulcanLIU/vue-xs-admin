/* Layout */
// import Layout from '@/layouts/index.vue'
// import AppMain from '@/layouts/components/AppMain/index.vue'
import type { AppRouteRecordRaw } from '@/router/type';

const taskPage: Array<AppRouteRecordRaw> = [
  {
    path: '/task',
    name: 'RtTask',
    component: () => import('@/views/Task/index.vue'),
    meta: {
      title: '任务管理',
      icon: 'iEL-home-filled',
      position: 2,
    },
  },
];

export default taskPage;
