import request from '@/utils/request'

// 顾问列表
const getAdviserList = (params) => {
    return request({
        url: 'sellerstaff/getAdvisers',
        method: 'post',
        data: params
    })
}

// 顾问管理 停用/启用
const setAdviserStatus = (params) => {
    return request({
        url: '/sellerstaff/stopAdviser',
        method: 'post',
        data: params
    })
}

// 删除顾问
const delAdviser = (params) => {
    return request({
        url: '/sellerstaff/deleteAdviser',
        method: 'post',
        data: params
    })
}

// 审核顾问
const auditAdviser = (params) => {
    return request({
        url: '/sellerstaff/auditAdviser',
        method: 'post',
        data: params
    })
}

// 推手库
const getPushHands = (params) => {
    return request({
        url: '/pushhand/getPushHands',
        method: 'post',
        data: params
    })
}
const adviserList =  (params) => {//获取顾问
    return request({
        url: '/pushhand/adviserList',
        method: 'post',
        data: params
    })
}
const sellerAgentList = (params) => {//全部代理商
    return request({
        url: '/pushhand/sellerAgentList',
        method: 'get',
    })
}
// 导入外拓数据
const doWtExcel = (params) => {
    return request({
        url: '/sellerstaff/doWtExcel',
        method: 'post',
        data: params
    })
}
const pageAgents = (params) => {	
    return request({
        url: '/agent/pageAgents',
        method: 'post',
        data: params
    })
}
// 导入网销数据接口
const doWxExcel = (params) => {
    return request({
        url: '/sellerstaff/doWxExcel',
        method: 'post',
        data: params
    })
}
const setBossMobile = (params) => {
    return request({
        url: '/agent/setBossMobile',
        method: 'post',
        data: params
    })
}
const querySellerAgentCondition  = (params) => {
    return request({
        url: '/agent/querySellerAgentCondition',
        method: 'get',
        params
    })
}
const editSellerAgentCondition  = (params) => {
    return request({
        url: '/agent/editSellerAgentCondition',
        method: 'post',
        data:params
    })
}
const addSellerAgentCondition  = (params) => {
    return request({
        url: '/agent/addSellerAgentCondition',
        method: 'post',
        data:params
    })
}
const auditStatus = (params) => {
    return request({
        url: '/agent/auditStatus',
        method: 'post',
        data:params
    })
}
const transferCustomer  = (params) => {
    return request({
        url: '/sellerstaff/transferCustomer',
        method: 'post',
        data:params
    })
}

export {
    getAdviserList,
    setAdviserStatus,
    delAdviser,
    auditAdviser,
    getPushHands,
    doWxExcel,
    doWtExcel,
	sellerAgentList,
	adviserList,
	pageAgents,
	setBossMobile,
	querySellerAgentCondition,
	editSellerAgentCondition,
	addSellerAgentCondition,
	auditStatus,
	transferCustomer
}