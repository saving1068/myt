import store from '@/store'
import router from '@/router'

import index from '@/router/modules/index'
import product from '@/router/modules/product'
import stores from '@/router/modules/store'
import auth from '@/router/modules/auth'
import marketing from '@/router/modules/marketing'
import customer from '@/router/modules/customer'

// 路由菜单集合
const allRoutesList = [...index, ...stores, ...auth, ...product, ...marketing, ...customer]

// 所有权限菜单
const allResourceList = [];

function getNewList(arr){
    arr.forEach(item => {
        const childs = item.adminResourceInfos
        if(childs && childs.length){
            const data = {...item}
            delete data.adminResourceInfos
            allResourceList.push(data);
            getNewList(childs);
        }else{
            allResourceList.push(item);
        }
    })
}

export default (menuList = []) => {
    getNewList(menuList)

    // console.log('newList+++', allResourceList)

    if(!allResourceList.length) return []

    let lists = loadMenu(allRoutesList, [])

    console.log('loadMenu+++++++',lists)
    
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

    console.log('init_route_menu+++++++++++++', saveList)

    store.dispatch('saveMenu', saveList)

    return lists

}

// 匹配菜单显示
function loadMenu(routesList, arr) {
    
    for(let item of routesList){
        // 是否匹配权限路由
        const findItem = allResourceList.find(v => v.code == item.code)
        if(!findItem){
            continue
        }

        const data = item
        data.meta.title = findItem.name
        arr.push(data)

        if(data.children){
            data.children = loadMenu(item.children, [])
        }
    }

    return arr
}
