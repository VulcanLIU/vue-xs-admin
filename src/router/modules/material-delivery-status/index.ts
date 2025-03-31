import { t } from '@/hooks/web/useI18n';
import type { AppRouteRecordRaw } from '@/router/type';

const MyEcharts: AppRouteRecordRaw[] = [
  {
    path: '/status',
    name: 'RtStatus',
    component: () => import('@/views/material-delivery-status/index.vue'),
    meta: { title: '采购情况', icon: 'editor', position: 4 },
  },
];
export default MyEcharts;
