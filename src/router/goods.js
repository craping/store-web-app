export default [{
    path: '/goods/:id',
    component: () => import('@/view/goods'),
    meta: {
        title: '商品详情'
    }
}];