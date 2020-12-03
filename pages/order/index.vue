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
      >{{ orderNavItem.title }}</view>
    </view>
    <view class="order-list">
      <view
        class="order-list__item"
        v-for="orderItem in orderItems"
        :key="orderItem.orderNum"
      >
        <view class="order-item-field order-num">
          <view class="order-label">订单编号</view>
          <view class="order-content">{{ orderItem.orderNum }}</view>
        </view>
        <view class="order-item-field order-price">
          <view class="order-label">订单金额</view>
          <view class="order-content">&yen;{{ orderItem.orderPrice }}</view>
        </view>
        <view class="order-item-field order-date">
          <view class="order-label">订单日期</view>
          <view class="order-content">{{ orderItem.orderDate }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
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
      orderItems: [
        {
          orderNum: 'HMD151515151561113131313131',
          orderPrice: 3999,
          orderDate: '2020/1/8 18:32:22'
        },
        {
          orderNum: 'HMD45645645646456456456456456',
          orderPrice: 3999,
          orderDate: '2020/1/8 18:32:22'
        },
        {
          orderNum: 'HMD8797897984897897897987',
          orderPrice: 3999,
          orderDate: '2020/1/8 18:32:22'
        }
      ]
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
  padding-top: 93rpx;
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
  }
}
</style>
