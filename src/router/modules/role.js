export default [
  {
      path: '/role',
      meta: {requireLogin: false},
      component: () => import(/* webpackChunkName: 'root' */ '@/views/home'),
      children: [
          {
              path: '/',
              meta: {requireLogin: false},
              component: () => import(/* webpackChunkName: 'root' */ '@/views/role/index')
          },
      ]
  }

]
