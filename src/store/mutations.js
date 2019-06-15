import * as types from './types'
import {CURRENT_ROUTE_NAME, CURRENT_ROUTE_QUERY} from '@/utils/const'

export default {
    // 登录态信息
    [types.LOGIN_INFO](state, status = false) {
        state.isLogin = status
    },
    // 菜单权限
    [types.SAVE_MENU](state, list = []) {
        state.menuList = [...list]
    },
    // 用户信息
    [types.SAVA_USER_INFO](state, params = {}) {
        state.userInfo = params
    },
    // 清空用户信息
    [types.CLEAR_USER_INFO](state) {
        state.userInfo = ''
        window.sessionStorage.removeItem(CURRENT_ROUTE_NAME)
        window.sessionStorage.removeItem(CURRENT_ROUTE_QUERY)
    },
    // 左侧菜单的开关
    [types.SET_OPEN_MENU](state, status) {
        state.isOpenMenu = status
    },
    // 大菜单对应的子级菜单
    [types.ADD_SIDE_ROUTE](state, routes = {}) {
        state.sideRoute = routes;
    },
    // 添加tags
    [types.ADD_TAGS_VIEW](state, view) {

        const {visitedViews, cachedViews} = state.tagsView;

        // 菜单上是否已经存在此标签
        const _index = visitedViews.findIndex(v => v.path === view.path);
        if(_index > -1){
            
            // 这里的处理，改名避免缓存中修改的代码，切换到另一页面时，再换种参数，数据要重新拉新
            // 如果商品列表点编辑跳到编辑页面，如果只做缓存的时候，只拉到第一次的数据，以后都不请求ajax了
            // 又避免同一个编辑页面参数一样，切换回来，还保留着
            const cachedView_index = cachedViews.findIndex( v => v.name === view.name);
            if(cachedViews[cachedView_index] && cachedViews[cachedView_index].fullPath !== view.fullPath){
                // 替换掉
                state.tagsView.cachedViews.splice(cachedView_index, 1);
                setTimeout(()=>{
                    state.tagsView.cachedViews.push({
                        name: view.name,
                        fullPath: view.fullPath
                    })
                },10)
            }else{
                if(!view.meta.noCache && cachedView_index < 0){
                    state.tagsView.cachedViews.push({
                        name: view.name,
                        fullPath: view.fullPath
                    })
                }
            }

            // 替换
            const query = view.query;
            if(Object.keys(query).length){
                return state.tagsView.visitedViews.splice(_index, 1, {
                    name: view.name,
                    path: view.path,
                    query: view.query,
                    title: view.meta.title || 'no-name'
                })
            }
            return;
        }
        

        // 新页面
        state.tagsView.visitedViews.push({
            name: view.name,
            path: view.path,
            query: view.query,
            title: view.meta.title || 'no-name'
        })
        
        // 是否需要缓存页面
        if (!view.meta.noCache) {
            state.tagsView.cachedViews.push({
                name: view.name,
                fullPath: view.fullPath
            })
        }
    },
    // 删除tags
    [types.DEL_TAGS_VIEW](state, view) {
        const {visitedViews, cachedViews} = state.tagsView;

        for (let [i, v] of visitedViews.entries()) {
            if (v.path === view.path) {
                state.tagsView.visitedViews.splice(i, 1)
                break
            }
        }

        for (let item of cachedViews) {
            if (item.name === view.name) {
                const index = cachedViews.findIndex(v => v.name == view.name);
                state.tagsView.cachedViews.splice(index, 1);
                break
            }
        }
    }
}
