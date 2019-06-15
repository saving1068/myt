import request from '@/utils/request'
const getCorporationCarTypes = (params) =>{
		return request({
			url: '/car/getCorporationCarTypes',
			method: 'get',
			params
		})
	}
const addCorporationCarType = (params) =>{
		return request({
			url: '/car/addCorporationCarType',
			method: 'post',
			data:params
		})
	}
const editCorporationCarType = (params) =>{
		return request({
			url: '/car/editCorporationCarType',
			method: 'post',
			data:params
		})
	}
const editCarTypeSalePrice  = (params) =>{
		return request({
			url: '/car/editCarTypeSalePrice',
			method: 'post',
			data:params
		})
	}
const editCarTypeSaleStatu	= (params) =>{
		return request({
			url: '/car/editCarTypeSaleStatu',
			method: 'post',
			data:params
		})
	}
const editCarTypeStatus = (params) =>{
		return request({
			url: '/car/editCarTypeStatus',
			method: 'post',
			data:params
		})
	}
const deleteCarType	= (params) =>{
		return request({
			url: '/car/deleteCarType',
			method: 'post',
			data:params
		})
	}
const getCorporationCarTypeConfigs = (params) =>{
		return request({
			url: '/car/getCorporationCarTypeConfigs',
			method: 'get',
			params
		})
	}
const editCarTypeConfig = (params) =>{
		return request({
			url: '/car/editCarTypeConfig',
			method: 'post',
			data:params
		})
	}

const queryCarTypeImage = (params) =>{
		return request({
			url: '/car/queryCarTypeImage',
			method: 'post',
			data:params
		})
	}
	
const editCarTypeImage 	= (params) =>{
		return request({
			url: '/car/editCarTypeImage',
			method: 'post',
			data:params
		})
	}
export {
	getCorporationCarTypes,
	addCorporationCarType,
	editCorporationCarType,
	editCarTypeSalePrice,
	editCarTypeSaleStatu,
	editCarTypeStatus,
	deleteCarType,
	getCorporationCarTypeConfigs,
	editCarTypeConfig,
	queryCarTypeImage,
	editCarTypeImage
}