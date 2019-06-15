/**
 * 商品管理
 * @param code {String} 权限资源管理对应的code
 * @param parentCode {String} 对应的父级code => null 代表是顶级菜单
 * @param name {String} 对应route的name、path一致，还有就是对应的page下加载页面vue路径名，所以整个路由集合的name不要重复命名
 * @param icon {String} 图标  == parentCode为null时，icon对应的是大菜单，如果是有值时，是对应二级菜单的icon
 */
// export default [
//     {code: '04', parentCode: null, name: 'product', icon: 'car'},
//     {code: '0401', parentCode: '04', name: 'newCar'},
//     {code: '0402', parentCode: '04', name: 'stockManage'},
// ]

import Layout from '@/pages/layout/Layout'

export default [{
	path: '/product',
	component: Layout,
	name: 'product',
	meta: {
		title: '商品管理',
		icon: 'car'
	},
	code: '04',
	redirect: '/product/newcar',
	children: [{
			path: 'newCar',
			name: 'newCar',
			meta: {
				title: '新车库'
			},
			code: '0401',
			component: () => import('@/pages/product/newCar'),
		},
		{
			path: 'makeParameters',
			name: 'makeParameters',
			meta: {
				title: '制作参数模板',
			},
			hidden: true,
			code: '040106',
			component: () => import('@/pages/product/newCar/makeParameters.vue'),
		},
		{
			path: 'addPicModel',
			name: 'addPicModel',
			meta: {
				title: '上传参数模板图片',
			},
			hidden: true,
			code: '040121',
			component: () => import('@/pages/product/newCar/addPicModel.vue'),
		},
		{
			path: 'addCarSystem',
			name: 'addCarSystem',
			meta: {
				title: '新增车系',
			},
			hidden: true,
			code: '040106',
			component: () => import('@/pages/product/newCar/addCarSystem.vue'),
		},
		{
			path: 'carAdmin',
			name: 'carAdmin',
			meta: {
				title: '车型管理',
			},
			hidden: true,
			code: '040114',
			component: () => import('@/pages/product/newCar/carAdmin.vue'),
		},
		{
			path: 'addCarModel',
			name: 'addCarModel',
			meta: {
				title: '新增车型',
				
			},
			hidden: true,
			code: '040108',
			component: () => import('@/pages/product/newCar/addCarModel.vue'),
		},
		{
			path: 'mainCart',
			name: 'mainCart',
			meta: {
				title: '主推管理车系',
			},
			code: '040116',
			component: () => import('@/pages/product/mainCart'),
		},
		{
			path: 'record',
			name: 'record',
			meta: {
				title: '过往主推车系',
			},
			hidden: true,
			code: '040120',
			component: () => import('@/pages/product/mainCart/record'),
		},
		{
			path: 'addVideo',
			name: 'addVideo',
			meta: {
				title: '主推管理车系新增视频',
			},
			hidden: true,
			code: '040118',
			component: () => import('@/pages/product/mainCart/video'),
		},
		{
			path: 'addArticle',
			name: 'addArticle',
			meta: {
				title: '主推管理车系新增文章',
			},
			hidden: true,
			code: '040119',
			component: () => import('@/pages/product/mainCart/article'),
		},
		{
			path: 'stockmanage',
			name: 'stockmanage',
			meta: {
				title: '库存管理'
			},
			code: '0402',
			component: () => import('@/pages/product/stockManage'),
		}
	]
}]
