/**
 * 首页
 * @param code {String} 权限资源管理对应的code
 * @param parentCode {String} 对应的父级code => null 代表是顶级菜单
 * @param name {String} 对应route的name、path一致，还有就是对应的page下加载页面vue路径名，所以整个路由集合的name不要重复命名
 * @param icon {String} 图标  == parentCode为null时，icon对应的是大菜单，如果是有值时，是对应二级菜单的icon
 */
// export default [
//     {code: '03', parentCode: null, name: 'index', icon: 'bi'},
//     {code: '0301', parentCode: '03',name: 'platform', icon: 'user'},
//     {code: '030101', parentCode: '0301', name: 'data'},
//     {code: '030102', parentCode: '0301', name: 'realTime'},
//     {code: '0302', parentCode: '03', name: 'biReport', icon: 'bi'},
//     {code: '030201', parentCode: '0302', name: 'userData'},
//     {code: '030202', parentCode: '0302', name: 'orderData'},
//     {code: '030203', parentCode: '0302', name: 'productData'},
//     {code: '030204', parentCode: '0302', name: 'marketingData'},
//     {code: '030205', parentCode: '0302', name: 'adviserData'},
//     {code: '030206', parentCode: '0302', name: 'storeData'},
//     {code: '030207', parentCode: '0302', name: 'webData'},
// ]


import Layout from '@/pages/layout/Layout'

export default [
    {
        path: '/index',
		name: 'index',
        meta: {title: '首页', icon: 'bi'},
        code: '03',
		component: Layout,
		redirect: 'index/platform',
		children: [
            {
                path: 'platform',
                name: 'platform',
                meta: {title: '平台实况', icon: 'platform'},
                code: '0301',
				component: () => import('@/pages/index'),
				redirect: '/index/platform/data',
                children: [
                    {
                        path: 'data',
                        name: 'data',
                        meta: {title: '一量九率'},
                        code: '030101',
                        component: () => import('@/pages/index/platform/data')
                    },
                    {
                        path: 'realTime',
                        name: 'realTime',
                        meta: {title: '实时概况'},
                        code: '03010111111',
                        component: () => import('@/pages/index/platform/realTime'),
                    }
                ]
            },
            {
                path: 'biReport',
                name: 'biReport',
                meta: {title: 'BI报表', icon: 'bi'},
                code: '0302',
                component: () => import('@/pages/index'),
                redirect: '/index/biReport/userData',
                children: [
                    {
                        path: 'userData',
                        name: 'userData',
                        meta: {title: '用户数据'},
                        code: '030201',
                        component: () => import('@/pages/index/biReport/userData/index'),
                    },
                    {
                        path: 'orderData',
                        name: 'orderData',
                        meta: {title: '订单数据'},
                        code: '030202',
                        component: () => import('@/pages/index/biReport/orderData/index'),
                        // redirect: '/index/biReport/orderData/testDrive',
                        // children: [
                        //     {
                        //         path: 'testDriveOrder',
                        //         name: 'testDriveOrder',
                        //         meta: {title: '试驾单'},
                        //         code: '03020201',
                        //         component: () => import('@/pages/index/biReport/orderData/testDrive')
                        //     },
                        //     {
                        //         path: 'selectCarOrder',
                        //         name: 'selectCarOrder',
                        //         meta: {title: '选车单'},
                        //         code: '03020202',
                        //         component: () => import('@/pages/index/biReport/orderData/selectCar')
                        //     },
                        // ]
                    },
                    // {
                    //     path: 'productData',
                    //     name: 'productData',
                    //     meta: {title: '商品数据'},
                    //     component: () => import('@/pages/index/biReport/productData')
                    // },
                    // {
                    //     path: 'marketingData',
                    //     name: 'marketingData',
                    //     meta: {title: '营销数据'},
                    //     component: () => import('@/pages/index/biReport/marketingData'),
                    // },
                    // {
                    //     path: 'adviserData',
                    //     name: 'adviserData',
                    //     meta: {title: '顾问数据'},
                    //     component: () => import('@/pages/index/biReport/adviserData')
                    // },
                    // {
                    //     path: 'storeData',
                    //     name: 'storeData',
                    //     meta: {title: '分店数据'},
                    //     component: () => import('@/pages/index/biReport/storeData'),
                    // },
                    // {
                    //     path: 'webData',
                    //     name: 'webData',
                    //     meta: {title: '页面数据'},
                    //     component: () => import('@/pages/index/biReport/webData'),
                    // }
                ]
            }
        ]
    }
]