export default [
  { path: '/order', component: () => import('@/view/order/index.vue') },
  {
    path: '/successfulOrder',
    component: () => import('@/view/order/successfulOrder/index.vue')
  },
  {
    path: '/productExpress',
    component: () => import('@/view/order/productExpress/index.vue')
  }
]
