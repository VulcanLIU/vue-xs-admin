import { t } from '@/hooks/web/useI18n';
import type { AppRouteRecordRaw } from '@/router/type';

const MyEcharts: AppRouteRecordRaw[] = [
  {
    path: '/hello',
    name: 'RtHello',
    component: () => import('@/views/product-log-manager/index.vue'),
    meta: { title: '产品日志管理', icon: 'editor', position: 4 },
  },
];
export default MyEcharts;
