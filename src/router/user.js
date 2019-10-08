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
  component: () => import('@/view/user/setting/userInfo/index.vue')
},
{
  path: '/account',
  component: () => import('@/view/user/setting/account/index.vue')
},
{
  path: '/editCheck',
  component: () => import('@/view/user/setting/account/editCheck.vue')
},
{
  path: '/editMobile',
  component: () => import('@/view/user/setting/account/editMobile.vue')
},
{
  path: '/editPassword',
  component: () => import('@/view/user/setting/account/editPassword.vue')
},
{
  path: '/nameSet',
  component: () => import('@/view/user/setting/userInfo/nameSet.vue')
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
  path: '/mobileLogin',
  component: () => import('@/view/user/login/mobileLogin/index.vue')
},
{
  path: '/forgetPass',
  component: () => import('@/view/user/login/mobileLogin/forgetPass.vue')
},
{
  path: '/inputMobile',
  component: () => import('@/view/user/login/mobileLogin/inputMobile.vue')
},
{
  path: '/inputsms',
  component: () => import('@/view/user/login/mobileLogin/inputsms.vue')
},
{
  path: '/bindAgentNo',
  component: () => import('@/view/user/login/bindAgentNo.vue')
},
{
  path: '/register',
  component: () => import('@/view/user/login/register.vue')
}
,{
  path: '/bankCard',
  component: () => import('@/view/user/bankCard/index.vue')
}
,{
  path: '/editBankCard',
  component: () => import('@/view/user/bankCard/aditBankCard.vue')
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