<template>
  <view class="user">
    <view class="user__info">
      <view
        class="user-bg"
        v-if="user.token"
        :style="{
          'background-image': `${user.token ? `url(${user.avatarUrl})` : 'none'};`
        }"
      />
      <view v-if="user.token" class="user-info">
        <image :src="user.avatarUrl" />
        <text>{{ user.nickName }}</text>
      </view>
      <navigator v-else class="login-btn" url="/pages/login/index">去登陆</navigator>
    </view>
    <view class="user__main">
      <view class="order-option">
        <view
          v-for="(orderOptionItem, index) in orderOptionItems"
          :key="orderOptionItem.icon"
          :class="{ 'order-option__item': true, 'active': index === activeOrderOptionItem }"
          @click="handleOption(orderOptionItem.text)"
        >
          <text :class="'iconfont icon-' + orderOptionItem.icon" />
          <text class="order-option-text">{{ orderOptionItem.text }}</text>
        </view>
      </view>
      <view class="user-option">
        <button
          class="user-option__item"
          plain
          v-for="userOptionItem in getUserOptionItems"
          :key="userOptionItem.text"
          :open-type="userOptionItem.openType"
          @click="handleOption(userOptionItem.text)"
        >
          <view class="user-option-content">
            <text :class="'iconfont icon-' + userOptionItem.icon" />
            <text>{{ userOptionItem.text }}</text>
          </view>
          <view class="user-option-subtext" v-if="userOptionItem.subText">{{ userOptionItem.subText }}</view>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { checkLogin } from '@/utils'

export default {
  name: 'User',
  data () {
    return {
      activeOrderOptionItem: 0,
      orderOptionItems: [
        { text: '待付款', icon: 'icon-test' },
        { text: '待收货', icon: 'daishouhuo' },
        { text: '退货/退款', icon: 'tuihuo' },
        { text: '全部订单', icon: 'quanbudingdan01' },
        { text: '我的收藏', icon: 'shoucang' }
      ],
      user: {}
    }
  },
  computed: {
    getUserOptionItems () {
      const userOptionItems = [
        { text: '联系客服', subText: '400-618-4000', icon: 'kefu', openType: 'contact' },
        { text: '意见反馈', icon: 'fankuitianbao' },
        { text: '当前版本', subText: 'v4.1.1', icon: 'icon-' },
        { text: '注销', icon: 'zhuxiao' }
      ]

      if (!this.user.token) {
        return userOptionItems.filter((v, i) => i < 3)
      }

      return userOptionItems
    }
  },
  methods: {
    handleOption (key) {
      switch (key) {
        case '注销':
          this.logout()
          break
        case '意见反馈':
          uni.navigateTo({ url: '/pages/feedback/index' })
          break
        case '全部订单':
        case '待付款':
        case '我的收藏':
          this.orderOption(key)
          break
      }
    },
    logout () {
      uni.showModal({
        title: '提示',
        content: '真的要退出吗？',
        success: res => {
          if (res.confirm) {
            this.user = {}
            this.setYouGouUser()
            uni.showToast({ title: '退出成功' })
          }
        }
      })
    },
    orderOption (key) {
      if (!checkLogin()) {
        uni.navigateTo({ url: '/pages/login/index' })
        return
      }

      let url = '/pages/order/index'

      if (key === '待付款') {
        url = '/pages/order/index?type=2'
      }

      if (key === '我的收藏') {
        url = '/pages/collect/index'
      }

      uni.navigateTo({ url })
    },
    setYouGouUser () {
      this.$yougou.setData('user', { ...this.user })
    }
  },
  onShow () {
    const page = this.$mp.page
    if (typeof page.getTabBar === 'function' && page.getTabBar()) {
      page.getTabBar().setData({ currentIndex: 3 })
    }

    const user = this.$yougou.getData('user')

    this.user = user ? user : {}
  }
}
</script>

<style>
page {
  background-color: #fafafa;
}
</style>

<style lang="scss" scoped>
.user {
  &__info {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 350rpx;
    margin-bottom: 20rpx;
    .user-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background: no-repeat center / cover;
      z-index: -1;
      filter: blur(2px);
    }
    .user-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 32rpx;
      color: #fff;
      image {
        width: 172rpx;
        height: 172rpx;
        margin-bottom: 16rpx;
        border-radius: 50%;
      }
    }
    .login-btn {
      padding: 19rpx 122rpx;
      border-radius: 8rpx;
      font-size: 36rpx;
      color: #fff;
      background-color: #07c160;
    }
  }
  &__main {
    padding: 0 12rpx;
    .order-option,
    .user-option {
      background-color: #fff;
    }
    .order-option {
      padding: 30rpx 0 14rpx;
      margin-bottom: 20rpx;
      &, &__item {
        display: flex;
        justify-content: space-around;
      }
      &__item {
        flex-direction: column;
        align-items: center;
        font-size: 26rpx;
        color: #474747;
        &.active {
          color: #ea4350;
        }
        .iconfont {
          margin-bottom: 16rpx;
          font-size: 60rpx;
        }
      }
    }
    .user-option {
      padding: 0 34rpx 0 28rpx;
      min-height: 520rpx;
      &__item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30rpx 10rpx;
        font-size: 26rpx;
        border: 0;
        border-bottom: 1px solid #c8c8c8;
        border-radius: 0;
        color: #434343;
        &::after {
          content: none;
        }
        .iconfont {
          margin-right: 28rpx;
          font-size: 45rpx;
        }
      }
      &-content {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
