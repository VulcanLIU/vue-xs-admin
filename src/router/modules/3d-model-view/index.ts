import { t } from '@/hooks/web/useI18n';
/* Layout */
// import Layout from '@/layouts/index.vue'
// import AppMain from '@/layouts/components/AppMain/index.vue'
import type { AppRouteRecordRaw } from '@/router/type';

const safeManagerRoutes: Array<AppRouteRecordRaw> = [
  {
    path: '/3d_model_view',
    name: 'Rt3dModelView',
    component: () => import('@/views/3d-model-view/index.vue'),
    meta: {
      title: t('3D模型显示'),
      icon: 'iEL-home-filled',
      position: 1,
      keepAlive: true,
    },
  },
];

export default safeManagerRoutes;
