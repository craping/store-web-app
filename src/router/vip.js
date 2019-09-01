export default [
    {
        path: '/vip',
        component: () => import('@/view/vip/index.vue')
    },
    {
        path: '/withdraw',
        component: () => import('@/view/vip/withdraw.vue')
    },
    {
        path: '/withdrawLog',
        component: () => import('@/view/vip/withdrawLog.vue')
    },
    
    
];