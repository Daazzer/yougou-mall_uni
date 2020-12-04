<template>
  <view class="order">
    <view class="order-nav-bar">
      <view
        v-for="(orderNavItem, index) in orderNavItems"
        :class="{
          'order-nav-bar__item': true,
          active: index === activeNavItem
        }"
        :key="orderNavItem.title"
        @click="switchNav(index)"
      >{{ orderNavItem.title }}</view>
    </view>
    <view class="order-list" v-if="orderItems.length > 0">
      <view
        class="order-list__item"
        v-for="orderItem in orderItems"
        :key="orderItem.order_number"
      >
        <view class="order-item-field order-num">
          <view class="order-label">订单编号</view>
          <view class="order-content">{{ orderItem.order_number }}</view>
        </view>
        <view class="order-item-field order-price">
          <view class="order-label">订单金额</view>
          <view class="order-content">&yen;{{ orderItem.order_price }}</view>
        </view>
        <view class="order-item-field order-date">
          <view class="order-label">订单日期</view>
          <view class="order-content">{{ orderItem.create_time | dateFormat }}</view>
        </view>
      </view>
    </view>
    <view class="order-list--none" v-else>
      暂无数据
    </view>
  </view>
</template>

<script>
import { dateFormat, checkLogin } from '@/utils'

export default {
  name: 'Order',
  data () {
    return {
      activeNavItem: 0,
      orderNavItems: [
        { title: '全部' },
        { title: '待付款' },
        { title: '待发货' }
      ],
      orderItems: []
    }
  },
  methods: {
    switchNav (index) {
      this.activeNavItem = index
      this.renderOrderItems(this.activeNavItem + 1)
    },
    async renderOrderItems (type) {
      const [err, res] = await this.$api.checkOrderHistory({ type })

      if (err) {
        this.$showErrorTips(err, '获取订单数据失败')
        return
      }

      this.orderItems = res.data.message.orders
    }
  },
  filters: {
    dateFormat
  },
  onLoad ({ type }) {
    this.activeNavItem = type ? type - 1 : 0

    this.renderOrderItems(this.activeNavItem + 1)
  },
  onShow () {
    if (!checkLogin()) {
      uni.redirectTo({ url: '/pages/login/index' })
    }
  }
}
</script>

<style>
page {
  background-color: #f9f9f9;
}
</style>

<style lang="scss" scoped>
.order {
  padding: 95rpx 0 30rpx;
  &-nav-bar {
    position: fixed;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 88rpx;
    left: 0;
    top: 0;
    right: 0;
    background-color: #fff;
    color: #676767;
    &__item {
      width: 184rpx;
      line-height: 88rpx;
      text-align: center;
      font-size: 30rpx;
      &.active {
        font-weight: bold;
        border-bottom: 3px solid #ea4350;
        color: #3d3d3d;
      }
    }
  }
  &-list {
    &__item {
      padding: 39rpx 30rpx 38rpx 32rpx;
      margin-bottom: 13rpx;
      font-size: 30rpx;
      background-color: #fff;
      .order-item-field {
        display: flex;
        justify-content: space-between;
        & + .order-item-field {
          margin-top: 26rpx;
        }
      }
      .order-label {
        color: #696969;
      }
      .order-content {
        color: #434343;
      }
      .order-price {
        .order-content {
          color: #ea4350;
        }
      }
    }
    &--none {
      padding-top: 300rpx;
      text-align: center;
      font-size: 38rpx;
      color: #676767;
    }
  }
}
</style>
