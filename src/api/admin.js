
import request from '@/utils/request'

const loginInfo = (params) => {
    return request({
        url: '/login/info',
        method: 'get',
        params
    });
}


const sign = (params) => {
    return request({
        url: '/login/sign',
        method: 'post',
        data: params
    });
}

const loginMobile = (params) => {
    return request({
        url: '/login/loginMobile',
        method: 'post',
        data: params
    });
}
const sendMobileCode  = (params) => {
    return request({
        url: '/login/sendMobileCode',
        method: 'post',
        data: params
    });
}	
const sendEmailCode  = (params) => {
    return request({
        url: '/login/sendEmailCode',
        method: 'post',
        data: params
    });
}	
const forgotPassword   = (params) => {
    return request({
        url: '/login/forgotPassword',
        method: 'post',
        data: params
    });
}	

const updatePwd   = (params) => {
    return request({
        url: '/login/updatePwd',
        method: 'post',
        data: params
    });
}	

export {
    loginInfo,
    sign,
	loginMobile,
	sendMobileCode,
	forgotPassword,
	sendEmailCode,
	updatePwd
}