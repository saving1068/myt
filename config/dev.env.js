'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

const BASE_API = '"http://192.168.3.119:5555/api"'
// const BASE_API = '"http://testjkd.4slol.com/backend"'
// const BASE_API = '"/backend"'

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  IMG_PATH: '"http://testimg.4slol.com"',
  BASE_API: BASE_API
})
