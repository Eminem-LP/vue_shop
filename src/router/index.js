import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/login',
    component: () => import('../components/Login')
  },
  {
    path: '/home',
    component: () => import('../components/Home'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: () => import('../components/Welcome')
      },
      {
        path: '/users',
        component: () => import('../components/user/Users')
      },
      {
        path: '/rights',
        component: () => import('../components/power/Rights')
      },
      {
        path: '/roles',
        component: () => import('../components/power/Roles')
      },
      {
        path: '/categories',
        component: () => import('../components/goods/Category')
      },
      {
        path: '/params',
        component: () => import('../components/goods/Params')
      },
      {
        path: '/goods',
        component: () => import('../components/goods/GoodList')
      },
      {
        path: '/goods/add',
        component: () => import('../components/goods/AddGoods')
      },
      {
        path: '/orders',
        component: () => import('../components/order/Order')
      },
      {
        path: '/reports',
        component: () => import('../components/report/Report')
      }
    ]
  }
]

const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  return next()
})

export default router
