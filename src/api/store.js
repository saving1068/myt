import request from '@/utils/request'

// 门店列表
const storeList = (params) => {
    return request({
        url: '/sellerstore/getSellerStores',
        method: 'post',
        data:params
    })
}
const stopStatus = (params) => {//停用分组组长
    return request({
        url: 'sellerstore/stopStatus',
        method: 'post',
        data:params
    })
}
const querySellerStoreById  = (params) => {//查询单个分组信息
    return request({
        url: 'sellerstore/querySellerStoreById',
        method: 'post',
        data:params
    })
}

const addSellerStorePlan   = (params) => {//保存月目标（仅用于从未设置过月目标
    return request({
        url: 'sellerstore/addSellerStorePlan',
        method: 'post',
        data:params
    })
}
const editStoreTarget  = (params) => {//设置分组月目标（修改）
    return request({
        url: 'sellerstore/editStoreTarget',
        method: 'post',
        data:params
    })
}


const querySellerStorePlan  = (params) => {//查询月目标
    return request({
        url: 'sellerstore/querySellerStorePlan',
        method: 'post',
        data:params
    })
}
const addSellerStoreGroup = (params) => {//添加分组
    return request({
        url: 'sellerstore/addSellerStoreGroup',
        method: 'post',
        data:params
    })
}
const repealStore= (params) => {//撤销分组
    return request({
        url: 'sellerstore/repealStore',
        method: 'post',
        data:params
    })
}
const auditStatus= (params) => {//审核分组组长
    return request({
        url: 'sellerstore/auditStatus',
        method: 'post',
        data:params
    })
}
const editSellerStoreName  = (params) => {//修改分组名称
    return request({
        url: 'sellerstore/editSellerStoreName',
        method: 'post',
        data:params
    })
}

const querySellerQrcode  = (params) => {//查询分组下的二维码
    return request({
        url: '/sellerstore/querySellerQrcode',
        method: 'post',
        data:params
    })
}

// 门店信息
const getSellerStoreInfo = (params) => {
    return request({
        url: '/sellerstore/getSellerStoreInfo',
        method: 'get',
        params
    })
}

// 新增门店
const addStore = (params) => {
    return request({
        url: '/sellerstore/addSellerStore',
        method: 'post',
        data: params
    })
}

// 编辑门店
const editStore = (params) => {
    return request({
        url: '/sellerstore/editSellerStore',
        method: 'post',
        data: params
    })
}

// 门店状态
const editStoreStatus = (params) => {
    return request({
        url: '/sellerstore/editStoreStatus',
        method: 'post',
        data: params
    })
}

// boss列表
const bossList = (params) => {
    return request({
        url: '/boss/queryBoss',
        method: 'post',
        params
    })
}

// 修改状态
const editBossStatus = (params) => {
    return request({
        url: '/boss/operationStatus',
        method: 'post',
        data: params
    })
}

// Boss账号 / 下载Boss码
const getBossCode = (params) => {
    return request({
        url: '/boss/downloadBossCode',
        method: 'get',
        params
    })
}

export {
    storeList,
    getSellerStoreInfo,
    addStore,
    editStore,
    editStoreStatus,
    bossList,
    editBossStatus,
    getBossCode,
	stopStatus,
	querySellerQrcode,
	addSellerStoreGroup,
	querySellerStoreById,
	editSellerStoreName,
	querySellerStorePlan,
	addSellerStorePlan,
	editStoreTarget,
	repealStore,
	auditStatus
}