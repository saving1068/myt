
import request from '@/utils/request'

// 订单数据-试驾单列表
const testdriveList = (params) => {
    return request({
        url: '/bireport/order/testdrive/listDatas',
        method: 'post',
        data: params
    })
}

// 订单数据-选车单列表
const reservecarList = (params) => {
    return request({
        url: '/bireport/order/reservecar/listDatas',
        method: 'post',
        data: params
    })
}

// 订单数据-获取订单统计数据
const getOrderStatistics = (params) => {
    return request({
        url: '/bireport/order/getOrderStatistics',
        method: 'get',
        params
    })
}

const queryBarChat = (params) => {
    return request({
        url: '/salesLive/queryBarChat',
        method: 'post',
        data:params
    })
}


export {
    testdriveList,
    reservecarList,
    getOrderStatistics,
	queryBarChat
}