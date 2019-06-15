import request from '@/utils/request'

// 获取车系列表信息
const getSaleBrands = (params) => {
    return request({
        url: '/car/getSaleBrands',
        method: 'get',
        params
    })
}

// 删除车系
const delBrand = (params) => {
    return request({
        url: '/car/deleteBrand',
        method: 'post',
        data: params
    })
}

// 车系上架下架
const editBrandStatus = (params) => {
    return request({
        url: '/car/editCorporationBrandStatus',
        method: 'post',
        data: params
    })
}

// 置顶车系
const topBrand = (params) => {
    return request({
        url: '/car/topBrand',
        method: 'post',
        data: params
    })
}

// 选择集团车系
const getCorporationBrands = (params) => {
    return request({
        url: '/car/getCorporationBrands',
        method: 'get',
        params
    })
}

// 添加车系
const addBrand = (params) => {
    return request({
        url: '/car/addBrand',
        method: 'post',
        data: params
    })
}


// 选择集团车型
const getCorporationCarTypes = (params) => {
    return request({
        url: '/car/getCorporationCarTypes',
        method: 'get',
        params
    })
}

// 添加车型
const addCarType = (params) => {
    return request({
        url: '/car/addCarType',
        method: 'post',
        data: params
    })
}

// 新车预览小程序二维码
const getPreviewCode = (params) => {
    return request({
        url: '/car/getPreviewCode',
        method: 'get',
        params
    })
}

// 试驾推广语设置 
const editTestDriveDesc = (params) => {
    return request({
        url: '/car/editTestDriveDesc',
        method: 'post',
        data: params
    })
}

// 预订推广语设置 
const editReserveCarDesc = (params) => {
    return request({
        url: '/car/editReserveCarDesc',
        method: 'post',
        data: params
    })
}

// 分享推广语设置 
const editShareDesc = (params) => {
    return request({
        url: '/car/editShareDesc',
        method: 'post',
        data: params
    })
}

// 修改商家车系销售方式
const editSaleMode = (params) => {
    return request({
        url: '/car/editSaleMode',
        method: 'post',
        data: params
    })
}
const editCarTypeTestDrive = (params) => {
    return request({//设置车型试驾
        url: '/car/editCarTypeTestDrive',
        method: 'post',
        data: params
    })
}
const editCarConfigType  = (params) => {
    return request({//设置模板模式
        url: '/car/editCarConfigType',
        method: 'post',
        data: params
    })
}
export {
    getSaleBrands,
    delBrand,
    editBrandStatus,
    topBrand,
    getCorporationBrands,
    addBrand,
    getCorporationCarTypes,
    addCarType,
    getPreviewCode,
    editReserveCarDesc,
    editTestDriveDesc,
    editShareDesc,
    editSaleMode,
	editCarTypeTestDrive,
	editCarConfigType
}