export default [{
    path: '/cart',
    component: () => import('@/view/cart'),
    meta: {
        title: '购物车',
        single: true
    }
}];