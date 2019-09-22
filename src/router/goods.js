export default [{
    name: 'goods',
    path: '/goods/:pId/:pacId',
    component: () => import('@/view/goods'),
    meta: {
        title: '商品详情',
        keepAlive: false
    }
}];