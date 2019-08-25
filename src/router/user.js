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
  path: '/login',
  component: () => import('@/view/user/login/index.vue')
},
{
  path: '/accountLogin',
  component: () => import('@/view/user/login/accountLogin.vue')
},
];