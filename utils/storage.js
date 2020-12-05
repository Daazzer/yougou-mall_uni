class Yougou {
  constructor () {
    this.getData()
  }

  getData (key) {
    const yougou = uni.getStorageSync('yougou')

    if (!yougou) {
      // 将对象设置为空
      for (const key in this) {
        delete this[key]
      }
    } else {
      for (const key in yougou) {
        this[key] = yougou[key]
      }
    }

    return this[key]
  }

  setData (key, data) {
    this[key] = data
    uni.setStorageSync('yougou', this)
  }
}

export default new Yougou
