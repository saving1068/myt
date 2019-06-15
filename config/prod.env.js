'use strict'

const img_path = process.env.modes == 'test' ? "http://testimg.4slol.com" : "https://df.mayi-tao.com"

module.exports = {
  NODE_ENV: '"production"',
  IMG_PATH: '"'+img_path+'"',
  BASE_API: '"/backend"',
}
