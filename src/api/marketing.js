import request from '@/utils/request'

// 获取分润列表
const getWelfares = (params) => {
    return request({
        url: '/welfare/getWelfares',
        method: 'get',
        params
    })
}

// 编辑分润
const editWelfares = (params) => {
    return request({
        url: '/welfare/editWelfares',
        method: 'post',
        data: params
    })
}

// 添加分润礼品
const addRebate = (params) => {
    return request({
        url: '/welfare/addRebate',
        method: 'post',
        data: params
    })
}

// 分润方案纪录
const getWelfareLogs = (params) => {
    return request({
        url: '/welfare/getWelfareLogs',
        method: 'get',
        params
    })
}

// 推手分润纪录
const getAdviserPushHandWelfares = (params) => {
    return request({
        url: '/welfare/getAdviserPushHandWelfares',
        method: 'post',
        data: params
    })
}

// 生成分润提现码
const getMoneyCode = (params) => {
    return request({
        url: '/welfare/qrcode',
        method: 'post',
        data: params
    })
}

// 扫码后，轮询查看推手分润纪录状态
const eachWelfareStatus = (params) => {
    return request({
        url: '/welfare/eachWelfareStatus',
        method: 'get',
        params
    })
}

const setWelfares  = (params) => {
    return request({
        url: '/welfare/editWelfareMobile',
        method: 'post',
        data: params
    })
}
const setIsUnifiedWelfare = (params) => {
    return request({
        url: '/welfare/setIsUnifiedWelfare',
        method: 'post',
        data: params
    })
}

export {
    getWelfares,
    editWelfares,
    addRebate,
    getWelfareLogs,
    getAdviserPushHandWelfares,
    getMoneyCode,
    eachWelfareStatus,
	setWelfares,
	setIsUnifiedWelfare
}