export const getRect = selector => {
  const p = new Promise(rv => {
    uni.createSelectorQuery().select(selector).boundingClientRect(rect => {
      rv(rect)
    }).exec()
  })

  return p
}

/**
 * 集中显示响应错误
 * @param {string} msg 自定义的提示信息
 * @param {Error} err 错误对象
 */
export const showErrorTips = (err, msg) => {
  if (err.msg) {
    msg = msg + '，' + err.msg
  }
  uni.showToast({ title: msg, icon: 'none' })
}

/**
 * 检测登录状态
 */
export const checkLogin = () => {
  const yougou = uni.getStorageSync('yougou')

  if (!yougou) {
    return false
  } else if (!yougou.user) {
    return false
  } else if (!yougou.user.token) {
    return false
  } else {
    return true
  }
}

// 日期格式化
export const dateFormat = timeStamp => {
  const date = new Date(timeStamp)
  const YYYY = date.getFullYear()
  const MM = date.getMonth() + 1
  const DD = date.getDate()
  const hh = date.getHours()
  const mm = date.getMinutes()
  const ss = date.getSeconds()

  const doubleDigit = digit => digit >= 10 ? digit : '0' + digit

  return [YYYY, MM, DD].join('/') + ' ' + [hh, doubleDigit(mm), doubleDigit(ss)].join(':')
}

// iPhone 设备检测
// export const checkIPhoneFullScreenIndicator = () => {
//   const sysInfo = uni.getSystemInfoSync()
//   const iPhoneFullScreenIndicatorDevices = [
//     'iPhone X',
//     'iPhone XR',
//     'iPhone XS Max',
//     'iPhone 11<iPhone12,1>'
//   ]
//   return iPhoneFullScreenIndicatorDevices.some(iPhoneFullScreenIndicatorDevice => iPhoneFullScreenIndicatorDevice === sysInfo.model)
// }
