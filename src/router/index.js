import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/signIn',
      component: resolve => require(['@/components/page/index'], resolve),
      meta: {title: '登录'}
    },
    {
      path: '/signUp',
      component: resolve => require(['@/components/page/register'], resolve),
      meta: {title: '注册'}
    },
    {
      path: '/',
      component: resolve => require(['@/components/common/Home'], resolve),
      redirect: "/showAll",
      children: [
        {
          path: '/addWord',
          component: resolve => require(['@/components/page/addWord'], resolve),
          meta: {title: '添加单词'}
        },
        // {
        //   path: '/reviewWord',
        //   component: resolve => require(['@/components/page/reviewWord'], resolve),
        //   meta: {title: '复习单词'}
        // },
        {
          path: '/showAll',
          component: resolve => require(['@/components/page/showAll'], resolve),
          meta: {title: '词库'}
        }
      ]
    },
  ]
})
