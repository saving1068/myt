/**
 * 门店管理
 * @param code {String} 权限资源管理对应的code
 * @param parentCode {String} 对应的父级code => null 代表是顶级菜单
 * @param name {String} 对应route的name、path一致，还有就是对应的page下加载页面vue路径名，所以整个路由集合的name不要重复命名
 * @param icon {String} 图标  == parentCode为null时，icon对应的是大菜单，如果是有值时，是对应二级菜单的icon
 * @param hidden {Boolean} 是否显示在页面
 */
// export default [
//     {code: '05', parentCode: null, name: 'store', icon: 'store'},
//     {code: '0501', parentCode: '05', name: 'account'},
//     {code: '0502', parentCode: '05', name: 'organize', icon: 'bi'},
//     {code: '050202', parentCode: '0502', name: 'storeManage'},
//     // {code: '05020205', parentCode: '050202', name: 'storeList'},
//     {code: '05020203', parentCode: '050202', name: 'addStore', hidden: false},
//     {code: '05020204', parentCode: '050202', name: 'editStore', hidden: false},
//     {code: '050201', parentCode: '0502', name: 'staffManage', hidden: false},
//     {code: '05020101', parentCode: '050201', name: 'adviserList', title: '团队库'},
//     {code: '05020105', parentCode: '050201', name: 'pushHandList', hidden: false},
// ]


import Layout from '@/pages/layout/Layout'

export default [
    {
        path: '/store',
        name: 'store',
        meta: {title: '门店', icon: 'bi'},
        code: '05',
        redirect: '/store/organize',
        component: Layout,
        children: [
            {
                path: 'account',
                name: 'account',
                meta: {title: '账号管理'},
                code: '0501',
                component: () => import('@/pages/store/account'),
            },
            {
                path: 'organize',
                name: 'organize',
                meta: {title: '组织管理', icon: 'organization'},
                code: '0502',
                redirect: '/store/organize/storelist',
                component: () => import('@/pages/store/organize'),
                children: [
                    {
                        path: 'storelist',
                        name: 'storelist',
                        meta: {title: '分店列表'},
                        code: '05020205',
                        component: () => import('@/pages/store/organize/storeManage/list'),
                    },
                    {
                        path: 'addStore',
                        name: 'addStore',
                        meta: {title: '添加分店'},
                        hidden: true,
                        code: '05020203',
                        component: () => import('@/pages/store/organize/storeManage/addStore'),
                    },
                    {
                        path: 'editStore',
                        name: 'editStore',
                        meta: {title: '编辑分店'},
                        hidden: true,
                        code: '05020204',
                        component: () => import('@/pages/store/organize/storeManage/editStore'),
                    },
                    {
                        path: 'team',
                        name: 'team',
                        meta: {title: '团队库'},                        
                        code: '050201',
                        component: () => import('@/pages/store/organize/staffManage/index'),
                    },
                    {
                        path: 'bossList',
                        name: 'bossList',
                        meta: {title: 'BOSS列表'},                        
                        code: '05020301',
                        component: () => import('@/pages/store/organize/bossManage/list'),
                    },
                    // {
                    //     path: 'adviserList',
                    //     name: 'adviserList',
                    //     meta: {title: '顾问列表'},
                    //     hidden:true,
                    //     code: '05020101',
                    //     component: () => import('@/pages/store/organize/staffManage/adviserList'),
                    // },
                    // {
                    //     path: 'pushHandList',
                    //     name: 'pushHandList',
                    //     meta: {title: '推手列表'},
                    //     hidden:true,
                    //     code: '05020105',
                    //     component: () => import('@/pages/store/organize/staffManage/pushHandList'),
                    // }
                ]
            }
        ]
    }
]