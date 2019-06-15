
// 权限管理
import request from '@/utils/request'

// 资源管理列表
const resourceList = (params) => {
    return request({
        url: '/manage/resource/listDatas',
        method: 'post',
        data: params
    })
}

// 资源管理-编辑\新增
const updateResource = (params) => {
    return request({
        url: '/manage/resource/update',
        method: 'post',
        data: params
    })
}
const listDatas  = (params) => {//角色管理-列表
    return request({
        url: '/manage/role/listDatas',
        method: 'post',
        data: params
    })
}
const getRole  = (params) => {
    return request({
        url: 'manage/role/get',
        method: 'post',
        params
    })
}

const listDatasSave  = (params) => {//角色管理-新增
    return request({
        url: '/manage/role/save',
        method: 'post',
        data: params
    })
}
const listDatasUpdate = (params) => {//角色管理-修改
    return request({
        url: '/manage/role/update',
        method: 'post',
        data: params
    })
}
const listDatasEditStatus = (params) => {//角色管理-状态
    return request({
        url: '/manage/role/editStatus',
        method: 'post',
        data: params
    })
}
const roleDatas  = (params) => {//用户管理-获取所有角色
    return request({
        url: '/manage/role/resDatas',
        method: 'get',
        params
    })
}
const userRoleDatas = (params) => {
    return request({
        url: '/manage/user/listDatas',
        method: 'post',
        data:params
    })
}
const userListDatas= (params) => {
    return request({
        url: 'manage/user/roleDatas',
        method: 'get',
        params
    })
}
const addUser  = (params) => {
    return request({
        url: 'manage/user/save',
        method: 'post',
        data:params
    })
}
const editUser = (params) => {
    return request({
        url: 'manage/user/update',
        method: 'post',
        data:params
    })
}
const userEditStatus  = (params) => {//用户管理-状态
    return request({
        url: '/manage/user/editStatus',
        method: 'post',
        data:params
    })
}
const getUser = (params) => {
    return request({
        url: 'manage/user/get',
        method: 'post',
        data:params
    })
}
const resetPwd  = (params) => {
    return request({
        url: 'manage/user/resetPwd',
        method: 'post',
        data:params
    })
}

export {
    resourceList,
    updateResource,
	listDatas,listDatasSave,listDatasUpdate,listDatasEditStatus,roleDatas,userRoleDatas,userListDatas,addUser,getUser,editUser,resetPwd,userEditStatus,getRole
}