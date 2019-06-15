
// 本地代理跨域

// 云机器
// const IP_PATH = 'http://192.168.3.144:8082'
// 测试机
// const IP_PATH = 'http://192.168.3.128:8080'
// 涛机器
// const IP_PATH = 'http://192.168.3.13:8089'

// 俊宏
const IP_PATH = 'http://192.168.3.102:8082'

// const IP_PATH = 'http://jl.geekd.cn/backend'

// const o = {
//     target: IP_PATH,
//     changeOrigin: true,
//     secure: false,
// }

// const API = ['login', 'home', 'sellerinfo', 'sellerstore', 'manage', 'upload', 'sellerstaff', 'pushhand', 'car', 'welfare', 'adinfo', 'customer', 'bireport', 'base']

// const CONFIG = {}
// API.forEach(apiName => {
//     const key = `/${apiName}/**`
//     CONFIG[key] = o
// })

module.exports = {
    '/api': {
        target: IP_PATH,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
            '^/api': ''
        }
    }
}