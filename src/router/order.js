export default [
  {
    path: '/order', //订单中心
    name: 'order',
    component: () => import('@/view/order/index.vue')
  },
  {
    path: '/successfulOrder', //确定收货
    name: 'successfulOrder',
    component: () => import('@/view/order/successfulOrder/index.vue')
  },
  {
    path: '/productExpress', //查看物流
    name: 'productExpress',
    component: () => import('@/view/order/productExpress/index.vue')
  },
  {
    path: '/refund', //退款服务类型
    name: 'refund',
    component: () => import('@/view/order/refund/index.vue')
  },
  {
    path: '/applyrefund', //申请退款
    name: 'applyrefund',
    component: () => import('@/view/order/refund/applyrefund.vue')
  },
  {
    path: '/orderinfo', //订单详情
    name: 'orderinfo',
    component: () => import('@/view/order/orderinfo/index.vue')
  },
  {
    path: '/comment', //客户评论
    name: 'comment',
    component: () => import('@/view/order/comment/index.vue')
  },
  {
    path: '/aftersale', //我的售后
    name: 'aftersale',
    component: () => import('@/view/order/afterSale/index.vue')
  },
  {
    path: '/refundInfo', //退货详情
    name: 'refundInfo',
    component: () => import('@/view/order/refundInfo/index.vue')
  },
  {
    path: '/confirmOrder', //退货详情
    name: 'confirmOrder',
    component: () => import('@/view/order/confirmOrder/index.vue')
  }
]
