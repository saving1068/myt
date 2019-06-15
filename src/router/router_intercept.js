import router from '@/router'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import store from '@/store'
import {CURRENT_ROUTE_NAME, CURRENT_ROUTE_QUERY} from '@/utils/const'
import {getUserResource, getUserInfo} from '@/api/common'
import addRouter from '@/utils/addRouter'
import { Loading } from 'element-ui'

NProgress.configure({ showSpinner: false })

const whiteList = ['login', 'findPasswords']


router.beforeEach(async (to, from, next) => {

    const {name, path, fullPath, meta} = to
    const {userInfo} = store.state

    if(meta && meta.title){
        document.title = `${meta.title}_索引管理后台`
    }
    
    NProgress.start()

    // console.log('sessionStorage++++++',sessionStorage.getItem(CURRENT_ROUTE_NAME))
    // 页面刷新, to.name = null
    if(name === null){
        store.dispatch('checkLogin').then( async (res) => {
            console.log('登录态 <<<______>>> %c "状态正常"',"color:blue")
            const info = await getUserInfo()
            store.dispatch('saveUserInfo', info)
            // 动态加载菜单
            addRouteMenu(to, next)
        }).catch(_ => {
            console.log('登录态 <<<______>>> %c "状态失效"',"color:red")
            next(`/admin/login?redirect=${fullPath}`)
            NProgress.done()
        })
        return false
    }else {
        // 已登出
        if(!userInfo){
            if(whiteList.includes(name)){
                next()
            } else {
                // 否则全部重定向到登录页
                next({
                    path:`/admin/login?redirect=${fullPath}`, 
                    replace: true
                })
                NProgress.done()
            }
        }else if(name == 'login' && userInfo){
            NProgress.done() 
            next({
                name: 'index',
                replace: true
            })
        }else{
            next()
        }
    }
    
})

router.afterEach(() => {
    NProgress.done() 
})

// 动态加载菜单
async function addRouteMenu(to, next){
    try{

        const loadingInstance = Loading.service({ 
            fullscreen: true,
            text: '正进入管理系统...'
        });

        const menus = await getUserResource()

        // 没有菜单列表
        if(!menus || !menus.length){
            NProgress.done()
            return alert('没有配菜单权限')
        }

        const list = addRouter(menus)
        router.addRoutes(list)

        NProgress.done()
        const routeName = window.sessionStorage.getItem(CURRENT_ROUTE_NAME)
        const routeQuery = window.sessionStorage.getItem(CURRENT_ROUTE_QUERY)

        loadingInstance.close();
        
        if(routeName && routeName !== 'null' && routeName !== 'login'){
            next({
                name: routeName,
                replace: true,
                query: JSON.parse(routeQuery)
            })
            return false
        }
        
        next({
            name: 'index'
        })
    }catch(err){
        next()
    }
}