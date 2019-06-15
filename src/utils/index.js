
// 图片完整路径
const setImgPath = (str) => {
    if (str) {
        return process.env.IMG_PATH + str.split(',')[0]
    }
    return process.env.IMG_PATH
}

// 手机号校验
const validMobile = (val) => {
    return /^(13|14|15|16|17|18|19)\d{9}$/.test(val)
}
const validChinese =(val) => {
	 return /^[^\u4e00-\u9fa5]{0,}$/.test(val)
}

//超过1W保留小数点

const keepPoints = (val) => {
	
	if(val >= 10000){
		// console.log((((val-val%1000)/10000+'万')))
		return(((val-val%1000)/10000+'万'))
	}else{ 
		// console.log(val)
		return val
	}
	
}

const validEmail = (val) => {
	return /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(val)
}

// 固定电话校验
const validTel = (val) => {
    return /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(val)
}

const validPhone  = (val) => {
	var isPhone = /^(13|14|15|16|17|18|19)\d{9}$/; //手机号码
	var isMob =  /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,6})?$/; // 座机格式
	
	console.log(isPhone.test(val) || isMob.test(val),val)
	if(isPhone.test(val) || isMob.test(val)){
		return true
	}else{
		return false
	}
    

}
// 价格、金额
const checkPrice = (price) => {
	 return /(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/.test(price)&& price > 0
    // return /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/ && price >= 0
}

const checkPriceTwo = (price) => {
	 return /(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/.test(price)
    // return /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/ && price >= 0
}

// URL参数
const queryParams = (str) => {
    const path = str || location.href
    const data = {}
    path.replace(/([^?=#&]*)=([^?&#]*)/g, (str, key, val) => {
        return data[key] = val
    })

    return data
}

// 是否支持CSS3属性
const supportCss3 = (attr, value) => {
    var element = document.createElement('div');
    if (attr in element.style) {
        element.style[attr] = value;
        return element.style[attr] === value;
    } else {
        return false;
    }
}

export {
    setImgPath,
    validMobile,
    validTel,
	validEmail,
    checkPrice,
    queryParams,
    supportCss3,
	validChinese,
	keepPoints,
	checkPriceTwo,
	validPhone
}