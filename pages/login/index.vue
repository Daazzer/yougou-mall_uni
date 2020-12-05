<template>
  <view class="login">
    <view class="login__welcome" v-if="user.token">
      <text class="user-greeting">你好</text>
      <image class="user-avatar" :src="user.avatarUrl" />
      <text class="user-name">{{ user.nickName }}</text>
      <text class="user-login-success-msg" v-if="firstLogin">登录成功，页面自动跳转...</text>
    </view>
    <button
      class="login__btn"
      type="primary"
      open-type="getUserInfo"
      v-else
      :loading="logging"
      :disabled="logging"
      @getuserinfo="login"
    >授权微信登录</button>
  </view>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      user: {},
      firstLogin: false,
      logging: false
    }
  },
  methods: {
    async login (user) {
      this.logging = true
      const [userInfoErr, userInfo] = await this.getUserInfo(user.detail)

      if (userInfoErr) {
        this.logging = false
        uni.showToast({ title: '授权失败', icon: 'none' })
        return
      }

      const [err, res] = await this.$api.getToken(userInfo)

      if (err) {
        this.logging = false
        this.$showErrorTips(err, '登录失败')
        return
      }

      uni.showToast({ title: res.data.meta.msg })

      const token = res.data.message.token

      this.user = {
        ...user.detail.userInfo,
        token
      }

      this.logging = false
      this.firstLogin = true

      this.saveUserInfo()

      setTimeout(() => uni.navigateBack(), 3000)
    },
    getUserInfo ({ encryptedData, rawData, iv, signature }) {
      const p = new Promise((rv, rj) => {
        uni.showLoading({ title: '加载用户信息...' })
        uni.login({
          success ({ code }) {
            const userInfo = {
              encryptedData,
              rawData,
              iv,
              signature,
              code
            }

            rv([null, userInfo])
          },
          fail (err) {
            rj([err])
          },
          complete () {
            uni.hideLoading()
          }
        })
      })
      return p
    },
    saveUserInfo () {
      this.$yougou.setData('user', { ...this.user })
    }
  },
  onShow () {
    const user = this.$yougou.getData('user')

    this.user = user ? user : {}
  }
}
</script>

<style>
page {
  background-color: #f9f9f9;
}
</style>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  &__btn {
    padding: 20rpx 122rpx;
    border: 0;
    border-radius: 8rpx;
    font-size: 36rpx;
    background-color: #07c160;
    &::after {
      content: none;
    }
  }
  &__welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    word-break: break-all;
    font-size: 36rpx;
    .user-greeting {
      margin-bottom: 20rpx;
    }
    .user-avatar {
      width: 120rpx;
      height: 120rpx;
      margin-bottom: 10rpx;
      border-radius: 50%;
    }
    .user-name {
      margin-bottom: 30rpx;
      font-size: 32rpx;
    }
  }
}
</style>
