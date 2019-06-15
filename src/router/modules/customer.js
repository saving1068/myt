

/**
 * 客户库管理
 * @param code {String} 权限资源管理对应的code
 * @param parentCode {String} 对应的父级code => null 代表是顶级菜单
 * @param name {String} 对应route的name、path一致，还有就是对应的page下加载页面vue路径名，所以整个路由集合的name不要重复命名
 * @param icon {String} 图标  == parentCode为null时，icon对应的是大菜单，如果是有值时，是对应二级菜单的icon
 */
// export default [
//     {code: '08', parentCode: null, name: 'customer', icon: 'supreme'},
//     {code: '0801', parentCode: '08', name: 'customerManage', hidden: true},
//     {code: '080101', parentCode: '0801', name: 'customerList', title: '客户库'},
// ]


import Layout from '@/pages/layout/Layout'

export default [
    {
        path: '/customer',
        name: 'customer',
        meta: {title: '客户', icon: 'supreme'},
        code: '08',
        redirect: '/customer/customerManage',
        component: Layout,
        children: [
            {
                path: 'customerManage',
                name: 'customerManage',
                meta: {title: '客户库', icon: 'menu'},
                hidden: true,
                code: '0801',
                redirect: '/customer/customerManage/customerList',
                component: () => import('@/pages/customer'),
                children: [
                    {
                        path: 'customerList',
                        name: 'customerList',
                        meta: {title: '客户库'},
                        code: '080101',
                        component: () => import('@/pages/customer/customerManage/list'),
                    }
                ]
            }
        ]
    }
]