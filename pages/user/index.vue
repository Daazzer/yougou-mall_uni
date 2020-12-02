<template>
  <view class="user">
    <view class="user__info">
      <view class="login-btn">去登陆</view>
    </view>
    <view class="user__main">
      <view class="order-option">
        <view
          v-for="(optionItem, index) in optionItems"
          :key="optionItem.icon"
          :class="{ 'order-option__item': true, 'active': index === activeOptionItem }"
        >
          <text :class="'iconfont icon-' + optionItem.icon" />
          <text class="order-option-text">{{ optionItem.text }}</text>
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
      activeOptionItem: 0,
      optionItems: [
        { text: '待付款', icon: 'icon-test' },
        { text: '待收货', icon: 'daishouhuo' },
        { text: '退货/退款', icon: 'tuihuo' },
        { text: '全部订单', icon: 'quanbudingdan01' }
      ]
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
    .order-option {
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
  }
}
</style>
