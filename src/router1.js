import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [{
  path: '/',
  redirect: '/main/home'
}, 

{
  name: 'main',
  component: () => import('./view/main'),
  children: [{
    name: 'home',
    component: () => import('./view/home')
  }, {
    name: 'cart',
    component: () => import('./view/cart'),
    meta: {
      single: false
    }
  }, {
    name: 'user',
    component: () => import('./view/user'),
  }]
}, 

{
  path: '/user',
  component: () => import('./view/user'),
  meta: {
    title: '会员中心'
  }
}, 
{
  path: '/address',
  component: () => import('./view/user/address/index.vue')
}, 
{
  path: '/addAddress',
  component: () => import('./view/user/address/addAdress.vue')
}, 
{
  path: '/setting',
  component: () => import('./view/user/setting/index.vue')
},
{
  path: '/userInfo',
  component: () => import('./view/user/setting/userInfo.vue')
},
{
  path: '/nameSet',
  component: () => import('./view/user/setting/nameSet.vue')
},
{
  path: '/cart',
  component: () => import('./view/cart'),
  meta: {
    title: '购物车',
    single: true
  }
}, {
  path: '/goods/:id',
  component: () => import('./view/goods'),
  meta: {
    title: '商品详情'
  }
}];

// add route path
routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '');
  if (route.children) {
    route.children.forEach(r => {
      r.path = r.path || (r.name || '');
    })
  }
});

const router = new Router({ routes });

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  next();
});

export default router
