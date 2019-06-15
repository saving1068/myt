/**
 * 营销管理
 * @param code {String} 权限资源管理对应的code
 * @param parentCode {String} 对应的父级code => null 代表是顶级菜单
 * @param name {String} 对应route的name、path一致，还有就是对应的page下加载页面vue路径名，所以整个路由集合的name不要重复命名
 * @param icon {String} 图标  == parentCode为null时，icon对应的是大菜单，如果是有值时，是对应二级菜单的icon
 * @param hidden {Boolean} 是否显示在页面
 */
// export default [
//     {code: '06', parentCode: null, name: 'marketing', icon: 'marketing'},
//     {code: '0602', parentCode: '06', name: 'welfareManage', icon: 'marketing', hidden: true},
//     {code: '060202', parentCode: '0602', name: 'welfareList', title: '推手分润'},
//     // {code: '060201', parentCode: '0602', name: 'editWelfare'},
//     {code: '060204', parentCode: '0602', name: 'welfareRecord', hidden: true},
//     {code: '0603', parentCode: '06', name: 'advertManage', icon: 'marketing', hidden: true},
//     {code: '060301', parentCode: '0603', name: 'adList'},
// ]


import Layout from '@/pages/layout/Layout'

export default [
    {
        path: '/marketing',
        name: 'marketing',
        meta: {title: '营销', icon: 'marketing'},
        code: '06',
        redirect: '/marketing/welfareManage',
        component: Layout,
        children: [
            {
                path: 'welfareManage',
                name: 'welfareManage',
                meta: {title: '分润管理', icon: 'menu'},
                hidden: true,
                code: '0602',
                redirect: '/marketing/welfareManage/welfareList',
                component: () => import('@/pages/marketing'),
                children: [
                    {
                        path: 'welfareList',
                        name: 'welfareList',
                        meta: {title: '分润列表'},
                        code: '060202',
                        component: () => import('@/pages/marketing/welfareManage/welfareList'),
                    },
                    {
                        path: 'welfareRecord',
                        name: 'welfareRecord',
                        meta: {title: '分润记录'},
                        hidden: true,
                        code: '060204',
                        component: () => import('@/pages/marketing/welfareManage/welfareRecord'),
                    }
                ]
            },
            {
                path: 'advertManage',
                name: 'advertManage',
                meta: {title: '广告管理', icon: 'menu'},
                hidden: true,
                code: '0603',
                redirect: '/marketing/advertManage/adList',
                component: () => import('@/pages/marketing'),
                children: [
                    {
                        path: 'adList',
                        name: 'adList',
                        meta: {title: '广告列表'},
                        code: '060301',
                        component: () => import('@/pages/marketing/advertManage/adList'),
                    }
                ]
            }
        ]
    }
]