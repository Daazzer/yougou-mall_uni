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
export const dateFormat = (timeStamp) => {
  const date = new Date(timeStamp)
  const YYYY = date.getFullYear()
  const MM = date.getMonth() + 1
  const DD = date.getDate()
  const hh = date.getHours()
  const mm = date.getMinutes()
  const ss = date.getSeconds()

  return [YYYY, MM, DD].join('/') + ' ' + [hh, mm, ss].join(':')
}
