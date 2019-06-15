/**
 * 权限管理
 * @param code {String} 权限资源管理对应的code
 * @param parentCode {String} 对应的父级code => null 代表是顶级菜单
 * @param name {String} 对应route的name、path一致，还有就是对应的page下加载页面vue路径名，所以整个路由集合的name不要重复命名
 * @param icon {String} 图标  == parentCode为null时，icon对应的是大菜单，如果是有值时，是对应二级菜单的icon
 */
// export default [
//     {code: '02', parentCode: null, name: 'auth', icon: 'auth'},
//     {code: '0201', parentCode: '02', name: 'roleManage'},
//     {code: '0202', parentCode: '02', name: 'userManage'},
//     {code: '0203', parentCode: '02', name: 'resourceManage'},
//     {code: '0204', parentCode: '02', name: 'logManage'},
// ]


import Layout from '@/pages/layout/Layout'

export default [
    {
        path: '/auth',
        name: 'auth',
        meta: {title: '管理权限', icon: 'auth'},
        code: '02',
        redirect: '/auth/role',
        component: Layout,
        children: [
            {
                path: 'role',
                name: 'role',
                meta: {title: '员工管理'},
                code: '0201',
                component: () => import('@/pages/auth/role'),
            },
			{
			    path: 'addRole',
			    name: 'addRole',
			    meta: {title: '添加角色'},
			    code: '020101',
				hidden:true,
			    component: () => import('@/pages/auth/role/addRole'),
			},
			{
			    path: 'editRole',
			    name: 'editRole',
			    meta: {title: '编辑角色'},
			    code: '020102',
				hidden:true,
			    component: () => import('@/pages/auth/role/editRole'),
			},
            {
                path: 'user',
                name: 'user',
                meta: {title: '用户管理'},
                code: '0202',
                component: () => import('@/pages/auth/user'),
            },
			{
			    path: 'addUser',
			    name: 'addUser',
			    meta: {title: '添加用户'},
			    code: '020101',
				hidden:true,
			    component: () => import('@/pages/auth/user/addUser'),
			},
			{
			    path: 'editUser',
			    name: 'editUser',
			    meta: {title: '修改用户'},
			    code: '020202',
				hidden:true,
			    component: () => import('@/pages/auth/user/editUser'),
			},
            {
                path: 'resource',
                name: 'resource',
                meta: {title: '资源管理'},
                code: '0203',
                component: () => import('@/pages/auth/resource'),
            },
            {
                path: 'log',
                name: 'log',
                meta: {title: '日志管理'},
                code: '0204',
                component: () => import('@/pages/auth/log'),
            },
        ]
    }
]