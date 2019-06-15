import request from '@/utils/request'

const getPushMainCar = (params) => {
    return request({
        url: '/car/getPushMainCar',
        method: 'get',
		params
    })
}
const addPushMainCar = (params) => {
    return request({
        url: '/car/addPushMainCar',
        method: 'post',
		data:params
    })
}
const editPushMainStatus = (params) => {
    return request({
        url: '/car/editPushMainStatus',
        method: 'post',
		data:params
    })
}
const editPushMainParam = (params) => {
    return request({
        url: '/car/editPushMainParam',
        method: 'post',
		data:params
    })
}
const getArticleInfo = (params) => {
    return request({
        url: '/car/getArticleInfo',
        method: 'get',
		params
    })
}
const addArticle = (params) => {
    return request({
        url: '/car/addArticle',
        method: 'post',
		data:params
    })
}
const editArticle  = (params) => {
    return request({
        url: '/car/editArticle',
        method: 'post',
		data:params
    })
}
const addVideo  = (params) => {
    return request({
        url: '/car/addVideo',
        method: 'post',
		data:params
    })
}
const editVideo = (params) => {
    return request({
        url: '/car/editVideo',
        method: 'post',
		data:params
    })
}
const getPushMainCarLogs = (params) => {
    return request({
        url: '/car/getPushMainCarLogs',
        method: 'get',
		params
    })
}
const editBrandArticleStatus = (params) => {
    return request({
        url: '/car/editBrandArticleStatus',
        method: 'post',
		data:params
    })
}
const deleteBrandArticle = (params) => {
    return request({
        url: '/car/deleteBrandArticle',
        method: 'post',
		data:params
    })
}
const editPushMainLogStatus  = (params) => {
    return request({
        url: '/car/editPushMainLogStatus',
        method: 'post',
		data:params
    })
}
const getCorporationBrands = (params) => {
    return request({
        url: '/car/getCorporationBrands',
        method: 'get',
		params
    })
}

export {
	getPushMainCar,
	editPushMainLogStatus,
	deleteBrandArticle,
	editBrandArticleStatus,
	getPushMainCarLogs,
	editVideo,
	addVideo,
	editArticle,
	addArticle,
	getArticleInfo,
	editPushMainParam,
	editPushMainStatus,
	addPushMainCar,
	getCorporationBrands
}