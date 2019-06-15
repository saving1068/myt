import request from '@/utils/request'

const getSellerInfo = (params) => {
    return request({
        url: '/sellerinfo/getSellerInfo',
        method: 'get',
		params
    });
}	

const editSellerinfo = (params) => {
    return request({
        url: '/sellerinfo/editSellerinfo',
        method: 'post',
		data:params
    });
}	

export {getSellerInfo,editSellerinfo}