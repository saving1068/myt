import request from '@/utils/request'

// 菜单权限
const getUserResource = (params) => {
    return request({
        url: '/home/getUserResource',
        method: 'get',
        params
    })
}

// 检测登录态
const checkLogin = (params) => {
    return request({
        url: '/login/checkOnLine',
        method: 'get',
        params
    })
}

// 退出
const logout = (params) => {
    return request({
        url: '/login/logout',
        method: 'get',
        params
    })
}

// 检查权限接口
const checkPower = (params) => {
    return request({
        url: '/home/checkPower',
        method: 'get',
        params
    })
}

// 用户信息
const getUserInfo = (params) => {
    return request({
        url: '/login/userinfo',
        method: 'get',
        params
    })
}

// 图片上传
const uploadPic = (params) => {
    return request({
        url: '/upload/uploadPic',
        method: 'post',
        data: params
    })
}

// 商户车系接口
const getSaleBrandDtos = (params) => {
    return request({
        url: '/car/getCorporationBrands',
        method: 'get',
        params
    })
}

// 商户获取车型接口
const getSaleCarTypeDtos = (params) => {
    return request({
        url: '/car/getSaleCarTypeDtos',
        method: 'get',
        params
    })
}

// 门店集合接口
const getStoreList = (params) => {
    return request({
        url: '/sellerstore/getSellerStoreList',
        method: 'get',
        params
    })
}

// 顾问集合接口
const getAdviserList = (params) => {
    return request({
        url: 'pushhand/adviserList',
        method: 'post',
        data:params
    })
}

// 推手集合接口
const getPushHandList = (params) => {
    return request({
        url: '/pushhand/getPushHandList',
        method: 'get',
        params
    })
}

// 客户意向级别
const getLevels = (params) => {
    return request({
        url: '/customer/getLevels',
        method: 'get',
        params
    })
}

// 获取字典数据
// 字典类型:1-经销商代码,2-经销商区域,3-车系级别,4-顾问跟进标签,5-触客方式,6-意向等级,7-任务类型,8-福利方案实物,9-客户来源,10-所属分网,11-产品分类
const getDictInfos = (params) => {
    return request({
        url: '/dict/getDict',
        method: 'get',
        params
    })
}

const getDictSellerInfo = (params) => {
    return request({
        url: '/dict/getDictSellerInfo',
        method: 'get',
        params
    })
}
const querySelectSaleCarType = (params) => {//车型列表
    return request({
        url: '/car/querySelectSaleCarType',
        method: 'post',
        data:params
    })
}

const editEnableWelfare = (params) => {//开通分润
    return request({
        url: '/sellerinfo/editEnableWelfare',
        method: 'post',
        data:params
    })
}


export {
    getUserResource,
    checkLogin,
    checkPower,
    getUserInfo,
    logout,
    uploadPic,
    getSaleBrandDtos,
    getSaleCarTypeDtos,
    getStoreList,
    getAdviserList,
    getPushHandList,
    getLevels,
    getDictInfos,
	getDictSellerInfo,
	querySelectSaleCarType,
	editEnableWelfare
}