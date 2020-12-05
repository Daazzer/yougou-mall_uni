<template>
  <view class="order">
    <view class="order-nav-bar">
      <view
        v-for="orderNavItem in orderNavItems"
        :class="{
          'order-nav-bar__item': true,
          active: type === orderNavItem.type
        }"
        :key="orderNavItem.type"
        @click="switchNav(orderNavItem.type)"
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
    <view
      class="order-list--last-page"
      v-if="orderItems.length > 0 && isLastPage"
    >到底啦...</view>
  </view>
</template>

<script>
import { dateFormat, checkLogin } from '@/utils'

export default {
  name: 'Order',
  data () {
    return {
      type: 1,
      pageIndex: 1,
      pageSize: 15,
      isLoadingOrderItems: false,
      isLastPage: false,
      orderNavItems: [
        { title: '全部', type: 1 },
        { title: '待付款', type: 2 },
        { title: '待发货', type: 3 }
      ],
      orderItems: []
    }
  },
  filters: {
    dateFormat
  },
  methods: {
    switchNav (type) {
      this.type = type
      this.pageIndex = 1
      this.isLastPage = false
      this.renderOrderItems(this.type)
    },
    async renderOrderItems (type) {
      this.isLoadingOrderItems = true
      const [err, res] = await this.$api.checkOrderHistory({
        type,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      })

      if (err) {
        this.$showErrorTips(err, '获取订单数据失败')
        this.isLoadingOrderItems = false
        return
      }

      let orderItems = []

      if (res.data.message) {
        orderItems = res.data.message.orders
      }

      if (orderItems.length < this.pageSize) {
        this.isLastPage = true
      }

      if (this.pageIndex === 1) {
        this.orderItems = orderItems
      } else {
        this.orderItems.push(...orderItems)
      }

      this.isLoadingOrderItems = false
    }
  },
  onLoad ({ type }) {
    this.type = type ? Number(type) : 1

    this.renderOrderItems(this.type)
  },
  onShow () {
    if (!checkLogin()) {
      uni.redirectTo({ url: '/pages/login/index' })
    }
  },
  onReachBottom () {
    if (!this.isLastPage && !this.isLoadingOrderItems) {
      this.pageIndex++
      this.renderOrderItems(this.type)
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
      margin-top: 300rpx;
      text-align: center;
      font-size: 38rpx;
      color: #676767;
    }
    &--last-page {
      @extend .order-list--none;
      margin-top: 40rpx;
      padding-bottom: 30rpx;
    }
  }
}
</style>
