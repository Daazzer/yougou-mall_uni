<template>
  <view class="user">
    <view class="user__info">
      <button
        class="login-btn"
        size="mini"
        open-type="getUserInfo"
        @getuserinfo="login"
      >去登陆</button>
    </view>
    <view class="user__main">
      <view class="order-option">
        <view
          v-for="(orderOptionItem, index) in orderOptionItems"
          :key="orderOptionItem.icon"
          :class="{ 'order-option__item': true, 'active': index === activeOrderOptionItem }"
        >
          <text :class="'iconfont icon-' + orderOptionItem.icon" />
          <text class="order-option-text">{{ orderOptionItem.text }}</text>
        </view>
      </view>
      <view class="user-option">
        <view
          class="user-option__item"
          v-for="userOptionItem in userOptionItems"
          :key="userOptionItem.text"
        >
          <view class="user-option-content">
            <text :class="'iconfont icon-' + userOptionItem.icon" />
            <text>{{ userOptionItem.text }}</text>
          </view>
          <view class="user-option-subtext" v-if="userOptionItem.subText">{{ userOptionItem.subText }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'User',
  data () {
    return {
      activeOrderOptionItem: 0,
      orderOptionItems: [
        { text: '待付款', icon: 'icon-test' },
        { text: '待收货', icon: 'daishouhuo' },
        { text: '退货/退款', icon: 'tuihuo' },
        { text: '全部订单', icon: 'quanbudingdan01' }
      ],
      userOptionItems: [
        { text: '联系客服', subText: '400-618-4000', icon: 'kefu' },
        { text: '意见反馈', icon: 'fankuitianbao' },
        { text: '当前版本', subText: 'v4.1.1', icon: 'icon-' }
      ]
    }
  },
  methods: {
    login (userInfo) {
      uni.login({
        success (code) {
          console.log(code)
          console.log(userInfo)
        }
      })
    }
  },
  onShow () {
    const page = this.$mp.page
    if (typeof page.getTabBar === 'function' && page.getTabBar()) {
      page.getTabBar().setData({ currentIndex: 3 })
    }
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
    display: flex;
    justify-content: center;
    align-items: center;
    height: 350rpx;
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
        border-bottom: 1px solid #c8c8c8;
        color: #434343;
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
