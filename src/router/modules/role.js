export default [
  {
      path: '/role',
      meta: {requireLogin: true},
      component: () => import(/* webpackChunkName: 'root' */ '@/views/home'),
      children: [
          {
              path: '/',
              meta: {requireLogin: true},
              component: () => import(/* webpackChunkName: 'root' */ '@/views/role/index')
          },
      ]
  }

]
