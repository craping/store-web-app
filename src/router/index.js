import Vue from 'vue';
import Router from 'vue-router';

import user from './user';
import order from './order';
import goods from './goods';
import cart from './cart';
import vip from './vip';

Vue.use(Router);

const routes = [{
    path: '/',
    redirect: '/main/home'
},

{
    name: 'main',
    component: () => import('@/view/main'),
    children: [{
        name: 'home',
        component: () => import('@/view/home')
    }, {
        name: 'search',
        component: () => import('@/view/search')
    }, {
        name: 'cart',
        component: () => import('@/view/cart'),
        meta: {
            single: false
        }
    }, {
        name: 'user',
        component: () => import('@/view/user'),
    }]
}, ...user, ...order, ...goods, ...cart, ...vip]

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