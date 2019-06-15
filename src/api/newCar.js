import request from '@/utils/request'

const addCorporationBrand = (params) => {
    return request({
        url: '/car/addCorporationBrand',
        method: 'post',
		data:params
    })
}
const editCorporationBrand  = (params) => {
    return request({
        url: '/car/editCorporationBrand',
        method: 'post',
		data:params
    })
}
const getCorporationBrandDto  = (params) => {
    return request({
        url: '/car/getCorporationBrandDto',
        method: 'get',
		params
    })
}
const editSaleStatus  = (params) => {
    return request({
        url: '/car/editSaleStatus',
        method: 'post',
		data:params
    })
}
const getCorporationBrandConfigs = (params) => {
    return request({
        url: '/car/getCorporationBrandConfigs',
        method: 'get',
		params
    })
}
const editCorporationBrandConfig  = (params) => {
    return request({
        url: '/car/editCorporationBrandConfig',
        method: 'post',
		data:params
    })
}
const editCarTypeTestDrive = (params) => {
    return request({//设置车型试驾
        url: '/car/editCarTypeTestDrive',
        method: 'post',
        data: params
    })
}



export {
	addCorporationBrand,
	editCorporationBrand,
	getCorporationBrandDto,
	editSaleStatus,
	getCorporationBrandConfigs,
	editCorporationBrandConfig,
	editCarTypeTestDrive,
}