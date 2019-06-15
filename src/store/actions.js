import * as types from './types'
import {checkLogin} from '@/api/common'

export default {
    // 检查登录态信息
    checkLogin({commit}){
        return new Promise(async (resolve,reject) => {
            const isLogin = await checkLogin()
            commit(types.LOGIN_INFO, isLogin)
            if(isLogin){
                resolve()
            }else{
                reject()
            }
        })
    },
    // 菜单权限资源
    saveMenu({commit}, list){
        commit(types.SAVE_MENU, list)
    },
    // 保存用户信息
    saveUserInfo({commit}, params){
        return new Promise(resolve => {
            commit(types.SAVA_USER_INFO, params)
            resolve()
        })
    },
    // 清空用户信息
    clearUserInfo({commit}) {
        commit(types.CLEAR_USER_INFO)
    },
    // 大菜单对应的子级菜单
    addSideRoute({commit}, menus){
        commit(types.ADD_SIDE_ROUTE, menus);
    },
    // 添加tags
    addTagsView({commit}, route){
        commit(types.ADD_TAGS_VIEW, route)
    },
    // 删除tags
    delTagsView({commit, state}, route){
        return new Promise(resolve => {
            commit(types.DEL_TAGS_VIEW, route)
            resolve({
              visitedViews: [...state.tagsView.visitedViews],
              cachedViews: [...state.tagsView.cachedViews]
            })
        })
    }
}