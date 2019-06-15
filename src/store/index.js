
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const state = {
    isOpenMenu: true,
    isLogin: false, // 是否已登录
    menuList: [], // 菜单权限
    sideRoute: {}, // 侧边子菜单
    userInfo: '', // 用户信息
    tagsView: {
        visitedViews: [],
        cachedViews: []
    },
	getContentSize:0,
}

export default new Vuex.Store({
    state,
    mutations,
    actions
})




