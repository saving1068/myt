import request from '@/utils/request'

// 获取客户列表
const getCustomerList = (params) => {
    return request({
        url: '/customer/getCustomers',
        method: 'post',
        data: params
    })
}

const transferPushHandCustomer  = (params) => { //客户转移
    return request({
        url: '/customer/transferPushHandCustomer',
        method: 'post',
        data: params
    })
}

const queryCustomerCount   = (params) => { //查询推手及下面的所有推手的客户量
    return request({
        url: '/customer/queryCustomerCount',
        method: 'post',
        data: params
    })
}

// 获取客户档案二维码
const getPreviewCode = (params) => {
    return request({
        url: '/customer/getPreviewCode',
        method: 'post',
        data: params
    })
}


export {
    getCustomerList,
    getPreviewCode,
	transferPushHandCustomer,
	queryCustomerCount
}