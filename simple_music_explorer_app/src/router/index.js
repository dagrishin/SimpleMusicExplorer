import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    redirect: { name: 'About' }
  },
  {
    path: '/activate/:uid/:token/',
    name: 'User activation',
    props: true,
    component: () => import(/* webpackChunkName: "UserActivation" */ '../views/UserActivation.vue')
  },
  {
    path: '/username/reset/confirm/:uid/:token/',
    name: 'Username reset confirm',
    props: true,
    component: () => import(/* webpackChunkName: "UsernameResetConfirm" */ '../views/UsernameResetConfirm.vue')
  },
  {
    path: '/password/reset/confirm/:uid/:token/',
    name: 'Password reset confirm',
    props: true,
    component: () => import(/* webpackChunkName: "PasswordResetConfirm" */ '../views/PasswordResetConfirm.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "about" */ '../views/NotFound.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
