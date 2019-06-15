import request from '@/utils/request'
// 商户


// 获取商户信息
const getSellerInfo = (params) => {
    return request({
        url: '/sellerinfo/getSellerInfo',
        method: 'get',
        params
    })
}


// 添加商户信息
const addSellerinfo = (params) => {
    return request({
        url: '/sellerinfo/addSellerinfo',
        method: 'post',
        data: params
    })
}

// 门店二维码
const storeCodeList = (params) => {
    return request({
        url: '/sellerinfo/getSellerStoreCodeDTOs',
        method: 'get',
        params
    })
}


export {
    getSellerInfo,
    addSellerinfo,
    storeCodeList
}