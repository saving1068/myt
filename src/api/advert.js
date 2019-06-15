import request from '@/utils/request'
// 广告管理


// 广告管理列表
const getAdList = (params) => {
    return request({
        url: '/adinfo/getAdInfos',
        method: 'get',
        params
    })
}

// 编辑广告
const editAdInfo = (params) => {
    return request({
        url: '/adinfo/editAdInfo',
        method: 'post',
        data: params
    })
}


export {
    getAdList,
    editAdInfo
}