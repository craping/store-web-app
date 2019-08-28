export default [
  {
    path: '/order',
    name: 'order',
    component: () => import('@/view/order/index.vue')
  },
  {
    path: '/successfulOrder',
    name: 'successfulOrder',
    component: () => import('@/view/order/successfulOrder/index.vue')
  },
  {
    path: '/productExpress',
    name: 'productExpress',
    component: () => import('@/view/order/productExpress/index.vue')
  },
  {
    path: '/refund',
    name: 'refund',
    component: () => import('@/view/order/refund/index.vue')
  }
]
