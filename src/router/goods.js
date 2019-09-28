export default [{
    name: 'goods',
    path: '/goods/:id',
    component: () => import('@/view/goods'),
    meta: {
        title: '商品详情',
        keepAlive: false
    }
}];