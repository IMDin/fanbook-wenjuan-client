export default [
    {
        path: '/project/form',
        meta: {requireLogin: false},
        component: () => import(/* webpackChunkName: 'root' */ '@/views/form'),
        children: [
            {
                path: '',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/form/editor')
            },
            {
                path: 'editor',
                name: 'editor',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/form/editor')
            },
            {
                path: 'logic',
                name: 'logic',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/form/logic')
            },
            {
                path: 'preview',
                name: 'preview',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/form/preview')
            },
            {
                path: 'setting',
                name: 'setting',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/form/setting')
            },
            {
                path: 'publish',
                name: 'publish',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/form/publish')
            },
            {
                path: 'theme',
                name: 'theme',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/form/theme')
            },
            {
                path: 'statistics',
                name: 'statistics',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/form/statistics')
            },
            {
              path: 'postQuestionnaire',
              meta: {requireLogin: true},
              component: () => import(/* webpackChunkName: 'root' */ '@/views/form/postQuestionnaire')
            },
            {
              path: 'pushChannelPage',
              meta: {requireLogin: true},
              component: () => import(/* webpackChunkName: 'root' */ '@/views/form/pushChannelPage')
            }
        ]
    }
]
