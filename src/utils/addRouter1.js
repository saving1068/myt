import store from '@/store'
import router from '@/router'

import index from '@/router/modules/index'
import product from '@/router/modules/product'
import stores from '@/router/modules/store'
import auth from '@/router/modules/auth'
import marketing from '@/router/modules/marketing'
import customer from '@/router/modules/customer'

// 路由菜单集合
const allMenuList = [...index, ...product, ...stores, ...auth, ...marketing, ...customer]



export default (menuList = []) => {


    // const newList = getFilterList(menuList)
    // const __list = getNewList(newList)

    // console.log('new+++', __list)

    if(!menuList.length) return []

    let lists = loadMenu(menuList, [])

    console.log(lists)
    
    const other = [
        {
            path: '/',
            redirect: 'index/platform/data'
        },
        {
            path: '*',
            redirect: '/404',
        }
    ]

    lists = [...lists, ...other]

    const saveList = [...router.options.routes, ...lists]

    // console.log('init_route_menu+++++++++++++', saveList)

    store.dispatch('saveMenu', saveList)

    return lists

}

function getFilterList(list){
    try {
        return list.filter(item => {
            const o = allMenuList.find(v => v.code === item.code)
    
            if(o && item.adminResourceInfos && item.adminResourceInfos.length){
                item.adminResourceInfos = getFilterList(item.adminResourceInfos)
                return item.adminResourceInfos
            }
            return o
        })
    } catch (error) {
        console.log(error)
    }
}

function getNewList(list){
    try {
        return list.map(item => {

            if(item.adminResourceInfos && item.adminResourceInfos.length){
                if(item.code.length == 4){
                    const prop = {...item}
                    prop.name = prop.name + '__test'
                    delete prop.adminResourceInfos
                    item.adminResourceInfos.unshift(prop)
                }else{
                    item.adminResourceInfos =  getNewList(item.adminResourceInfos)
                    return item
                }
            }
            return item
        })
    } catch (error) {
        console.log(error)
    }
}

// 生成菜单
function loadMenu(list, routes, componentURL) {

    try {
        
        for(let item of list){
        // list.forEach(item => {
            const o = allMenuList.find(v => v.code === item.code)
            
            // type = 2 按钮类型
            if(!o && item.type == 2){
                continue
            }
    
            // 如果在路由集合里，没找到对应的跌幅
            // 默认跳到一个404页面
            if(!o){
                console.log('in..........')
                const noPageRouteOptions = toNotFoundPage(item)
                routes.push(noPageRouteOptions)
                break
            }
    
            const meta = {title: o.title ? o.title : item.name}
            let path = o.name
            
            const component_paths = getComponentPath(item.code)
    
            // console.log(component_paths)
    
            // 顶级菜单
            if(!item.parentCode){
                meta.icon = o.icon || ''
                path = `/${path}`
            }
            
            // 二级菜单组件路径
            if(o.parentCode && o.icon){
                meta.icon = o.icon
            }
            
            const options = {
                meta,
                path,
                hidden: o.hidden || false,
                name: o.name,
                cpmURL: component_paths,
                component: LoadComponent(component_paths),
            }

    
            // 存在子级菜单
            if(item.adminResourceInfos && item.adminResourceInfos.length){

                // for(let [keyIdx, childItem] of item.adminResourceInfos.entries()){
                //     let child = allMenuList.find(v => v.code === childItem.code)
                //     if(!child){
                //         continue
                //     }else{
                //         const component_path = componentURL ? componentURL : o.name
                
                //         const firstChild = allMenuList.find(v => v.code === item.adminResourceInfos[0].code)
                //         let childCpmUrl = ''
                //         // if(firstChild){
                //             // childCpmUrl = `${component_path}/${firstChild.name}`
                //             // 重定向默认到第一个子菜单
                //             options.redirect = '/' + getRedirectPath(childItem.parentCode) + child.name
                //             // options.redirect = '/' + getRedirectPath(childItem.parentCode) + child.name
                //             // console.log('redirect>>>>', '/' + childCpmUrl)
                //             // console.log('redirect++++', '/' + getRedirectPath(childItem.parentCode) + child.name)
                //         // }
                        
                //         options.children = loadMenu(item.adminResourceInfos, [], childCpmUrl)
                
                //     }
                // }
                
                let child = allMenuList.find(v => v.code === item.adminResourceInfos[0].code)
                if(child){
                    const component_path = componentURL ? componentURL : o.name
                    let childCpmUrl = `${component_path}/${child.name}`
        
                    // 重定向默认到第一个子菜单
                    // options.redirect = '/' + childCpmUrl
                    let redirectPath = '/' + getRedirectPath(item.adminResourceInfos[0].parentCode) + child.name
                    
                    // 默认跳到门店列表
                    if(redirectPath == '/store/account'){
                        redirectPath = '/store/organize/storeManage'
                    }

                    options.redirect = redirectPath

                    options.children = loadMenu(item.adminResourceInfos, [], childCpmUrl)
                }
            }
    
            routes.push(options)
        }
    } catch (error) {
        console.log(error)
    }

    return routes
}

function LoadComponent(url) {
    return () => import(`@/pages/${url}`)
}

function getRedirectPath(parentCode, path = ''){
    const parent = allMenuList.find(v => v.code === parentCode)

    if(parent){
        path = parent.name + '/' + path
        if(parent.parentCode){
            return getRedirectPath(parent.parentCode, path)
        }
    }

    return path
}

/**
 * 生成Component路径
 * @param code {Number} 当前CODE
 * @param path {String} 拼接路径
 * @param isFind {Boolean} 是否向上找到parentCode
 */
function getComponentPath(code, path, isFind){
    const o = allMenuList.find(v => v.code === code)

    if(o.parentCode && o.icon && !isFind){
        const parent = allMenuList.find(v => v.code === o.parentCode)
        return parent.name
    }

    if(!o.parentCode && !isFind){
        path = 'layout/Layout'
    }else if(!o.parentCode && isFind){
        path = o.name + '/' + path
    }else {
        path = o.name + (path ? '/' + path : '')
        return getComponentPath(o.parentCode, path, true)
    }
    
    return path
}

// 没在路由集合里添加的是，默认跳转到一个集中页
function toNotFoundPage(item, page_index = ''){
    let path = 'page'
    // 为了防止 name 重复了
    let name = 'page' + (page_index == 0 ? '' : page_index)
    let cmpPath = `notFound/page`
    const meta = {title: item.name}

    // 顶级菜单
    if(!item.parentCode){
        path = '/notFound'
        name = 'notFound'
        meta.icon = 'bi'
        cmpPath = `layout/Layout`
    }

    const options = {
        meta,
        path,
        name,
        cpmURL: cmpPath,
        component: LoadComponent(cmpPath),
    }

    // 存在子级菜单
    if(item.adminResourceInfos){
        // 重定向默认到第一个子菜单
        const childs = item.adminResourceInfos.filter(v => v.type == 1)
        if(childs.length){
            let childCpmUrl = `notFound/page`
            options.redirect = '/' + childCpmUrl
            options.children = childs.map((v,idx) => toNotFoundPage(v,idx))
        }
    }

    return options
}
