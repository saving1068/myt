import Vue from 'vue'
import Router from 'vue-router'

import admin from './modules/admin'

Vue.use(Router)

const routes = [
	...admin,
	{
		path: '/404',
		name: '404',
		meta: {title: '404'},
		hidden: true,
		component: () => import('@/pages/404')
	}
]

function setFullPath(routes){
	return findChild(routes)
}

function findChild(list, basePath){
	return list.map(item => {
		if(item.name){
			item.fullPaths = (basePath ? basePath + '/' : '') + item.path 
			if(item.children && item.children.length){
				findChild(item.children, item.fullPaths)
			}
		}
		return item;
	})
}

const newRoters = setFullPath(routes)


// console.log(newRoters)

export default new Router({
	mode: 'history',//process.env.NODE_ENV == 'development' ? 'hash' : 'history',
	routes: newRoters
})
