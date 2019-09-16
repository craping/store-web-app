export default [{
  path: '/address',
  component: () => import('@/view/user/address/index.vue')
}, 
{
  path: '/addAddress',
  component: () => import('@/view/user/address/addAdress.vue')
}, 
{
  path: '/setting',
  component: () => import('@/view/user/setting/index.vue')
},
{
  path: '/userInfo',
  component: () => import('@/view/user/setting/userInfo.vue')
},
{
  path: '/nameSet',
  component: () => import('@/view/user/setting/nameSet.vue')
},
{
  path: '/about',
  component: () => import('@/view/user/setting/about.vue')
},
{
  path: '/about-detail',
  component: () => import('@/view/user/setting/aboutDetail.vue')
},
{
  path: '/login',
  component: () => import('@/view/user/login/index.vue')
},
{
  path: '/register',
  component: () => import('@/view/user/login/register.vue')
},
{
  path: '/accountLogin',
  component: () => import('@/view/user/login/accountLogin.vue')
}
,{
  path: '/bankCard',
  component: () => import('@/view/user/bankCard/index.vue')
}
,{
  path: '/addBankCard',
  component: () => import('@/view/user/bankCard/addBankCard.vue')
},
{
  path: '/bill',
  component: () => import('@/view/user/bill/index.vue')
},
{
  path: '/billDetail',
  component: () => import('@/view/user/bill/billDetail.vue')
},
{
  path: '/unliquidated',
  component: () => import('@/view/user/bill/unliquidated.vue')
},
{
  path: '/like',
  component: () => import('@/view/user/like/index.vue')
},
{
  path: '/message',
  component: () => import('@/view/user/message/index.vue')
},
{
  path: '/messageList',
  component: () => import('@/view/user/message/list.vue')
},
{
  path: '/messageDetail',
  component: () => import('@/view/user/message/detail.vue')
}
];