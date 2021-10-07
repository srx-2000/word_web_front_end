import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/signIn',
      component: () => import('../components/page/index'),
      meta: {title: '登录'}
    },
    {
      path: '/signUp',
      component: () => import('../components/page/register'),
      meta: {title: '注册'}
    },
    {
      path: '/',
      component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
      meta: {title: '自述文件'},
      redirect: "/showAll",
      children: [
        {
          path: '/addWord',
          component: () => import('../components/page/addWord'),
          meta: {title: '添加单词'}
        },
        {
          path: '/reviewWord',
          component: () => import('../components/page/reviewWord'),
          meta: {title: '复习单词'}
        },
        {
          path: '/showAll',
          component: () => import('../components/page/showAll'),
          meta: {title: '词库'}
        }
      ]
    },
    // {
    //   path: '/addWord',
    //   component: () => import('../components/page/addWord'),
    //   meta: {title: '添加单词'}
    // },
    // {
    //   path: '/reviewWord',
    //   component: () => import('../components/page/reviewWord'),
    //   meta: {title: '复习单词'}
    // },
    // {
    //   path: '/showAll',
    //   component: () => import('../components/page/showAll'),
    //   meta: {title: '已入库单词'}
    // },
    // {
    //   path: '/',
    //   redirect: "/addWord"
    // }
  ]
})
