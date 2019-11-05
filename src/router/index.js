import Vue from 'vue';
import store from '@/store';

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
}, {
    name: 'search',
    component: () => import('@/view/search'),
    meta: {
        keepAlive: true
    }
}, {
    name: 'main',
    component: () => import('@/view/main'),
    children: [{
        name: 'home',
        component: () => import('@/view/home'),
        meta: {
            keepAlive: true
        }
    }, {
        name: 'bargain',
        component: () => import('@/view/bargain'),
        meta: {
            single: false
        }
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
//打包WAP包用此处
// const router = new Router({ mode: 'history', routes });
//打包APP用此处代码
const router = new Router({ routes });

router.beforeEach((to, from, next) => {
    const title = to.meta && to.meta.title;
    if (title) {
        document.title = title;
    }
    if (to.query.shopId) {
        next();
        return
    }
    let redirectPath = ""
    if(to.path == '/login') { // 全局处理未登录跳登录页面
        if(!store.state.user.isLogin) {
            if (from.path != '/register' && from.path != '/mobileLogin') {
                store.commit("user/SET_BEFOREPATH", from.path);
            }
        } else {
            // 登录了就跳转到首页
            redirectPath = '/main/home'
        }
    }
    if (from.query.shopId) {
        next({
            path: redirectPath || to.path,
            query: {
                ...to.query, 
                shopId:from.query.shopId,
                recommenderId:from.query.recommenderId,
                recommenderNo:from.query.recommenderNo
            }
        })
    } else {
        if(redirectPath){
            next(redirectPath)
        }else{
            next()
        }
    }
});

export default router