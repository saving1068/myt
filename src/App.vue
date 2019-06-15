<template>
	<div id="app">
		<router-view/>
	</div>
</template>

<script>
import {CURRENT_ROUTE_NAME, CURRENT_ROUTE_QUERY} from '@/utils/const'
import {getUserResource, checkLogin, getUserInfo} from '@/api/common'
import addRouter from '@/utils/addRouter'


export default {
	name: 'App',
	watch: {
		'$route'(route) {
			// 保存当前路由名，以便刷新重定向当前页面, page是生成菜单里没有的自建的页面
			if(route.name && route.name !== 'login' && route.name !== '404' && route.name !== 'page'){
				window.sessionStorage.setItem(CURRENT_ROUTE_NAME, route.name)
				const query = route.query
				// 保存参数
				if(Object.keys(query).length){
					window.sessionStorage.setItem(CURRENT_ROUTE_QUERY, JSON.stringify(query))
				}else{
					window.sessionStorage.removeItem(CURRENT_ROUTE_QUERY)
				}
			}
		}
	},
	created() {
		
	},
	methods: {
		async init(){
			try {
				const isLogin = await checkLogin()
				if(isLogin){
					const info = await getUserInfo()
					this.$store.dispatch('saveUserInfo', info)  

					this.getMenu()
				}else{
					this.$router.push({
						name: 'admin'
					})
				}
			} catch (error) {
				console.error(error)
			}
		},
		async getMenu(){
            const menus = await getUserResource()
            const list = addRouter(menus)
            this.$router.addRoutes(list)

			const routeName = window.sessionStorage.getItem(CURRENT_ROUTE_NAME)
			const routeQuery = window.sessionStorage.getItem(CURRENT_ROUTE_QUERY)
			if(routeName && routeName !== 'login'){
				this.$router.push({
					name: routeName,
					query: JSON.parse(routeQuery)
				})
				return false
			}
            this.$router.push({
				name: 'index'
			})
		}
	}
}
</script>
<style>
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
	    -webkit-appearance: none;
	}
	input[type="number"]{
	    -moz-appearance: textfield;
	}
	input[type="file"]{
	    font-size: 0;
		cursor: pointer;
	}
</style>