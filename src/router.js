import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
  {
    path: '*',
    redirect: '/main/home'
  },
  {
    name: 'main',
    component: () => import('./view/main'),
    children: [{
      name: 'home',
      component: () => import('./view/home')
    },{
      name: 'cart',
      component: () => import('./view/cart'),
      meta:{
        single:false
      }
    },
    {
      name: 'user',
      component: () => import('./view/user'),
    }     
  ]
  },
  {
    name: 'user',
    component: () => import('./view/user'),
    meta: {
      title: '会员中心'
    }
  },
  {
      name: 'adderss',
      component: () => import('./view/user/adderss/index.vue') 
  },
  {
    name: 'addAdderss',
    component: () => import('./view/user/adderss/addAdeerss.vue') 
  },
  {
    name: 'cart',
    component: () => import('./view/cart'),
    meta: {
      title: '购物车',
      single:true
    }
  },
  {
    name: 'goods',
    component: () => import('./view/goods'),
    meta: {
      title: '商品详情'
    }
  }
];

// add route path
routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '');
  if(route.children){
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

export {
  router
};
