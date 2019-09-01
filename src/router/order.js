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
  },
  {
    path: '/applyrefund',
    name: 'applyrefund',
    component: () => import('@/view/order/refund/applyrefund.vue')
  },
  {
    path: '/orderinfo',
    name: 'orderinfo',
    component: () => import('@/view/order/orderinfo/index.vue')
  },
  {
    path: '/comment',
    name: 'comment',
    component: () => import('@/view/order/comment/index.vue')
  },
  {
    path: '/aftersale',
    name: 'aftersale',
    component: () => import('@/view/order/afterSale/index.vue')
  }
]
