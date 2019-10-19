export default [
    {
        path: '/vip',
        component: () => import('@/view/vip/index.vue')
    },
    {
        path: '/withdraw',
        component: () => import('@/view/vip/withdraw/index.vue')
    },
    {
        path: '/withdrawCheck',
        component: () => import('@/view/vip/withdraw/withdrawCheck.vue')
    },
    {
        path: '/team',
        component: () => import('@/view/vip/team/index.vue')
    },
    {
        path: '/vipGrade',
        component: () => import('@/view/vip/vipGrade.vue')
    },
];