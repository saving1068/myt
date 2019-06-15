import request from '@/utils/request'

const queryCountNums = (params) => {
    return request({
        url: '/salesLive/queryCountNums',
        method: 'post',
        data:params
    });
}	
export {queryCountNums}