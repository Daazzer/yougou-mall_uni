<template>
  <view class="goods-options-bar">
    <view class="goods-options-bar__opt">
      <button
        class="goods-options-opt-item"
        open-type="contact"
        plain
      >
        <text class="iconfont icon-kefu icon" />
        <text class="goods-options-opt-item__text">联系客服</text>
      </button>
      <navigator
        class="goods-options-opt-item"
        open-type="switchTab"
        url="/pages/cart/index"
      >
        <text class="iconfont icon-gouwuche icon" />
        <text class="goods-options-opt-item__text">购物车</text>
        <text class="badge" v-if="goodsNum > 0">{{ goodsNum > 99 ? '99+' : goodsNum }}</text>
      </navigator>
    </view>
    <view class="goods-options-bar__btn">
      <view class="btn btn--warning" @click="$emit('add-to-cart')">
        加入购物车
      </view>
      <view class="btn btn--danger">
        <navigator
          open-type="switchTab"
          url="/pages/cart/index"
          @click="$emit('add-to-cart')"
        >立即购买</navigator>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'GoodsOptionsBar',
  props: {
    goodsNum: {
      type: Number,
      default: 0
    },
    goods_id: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-options-bar {
  display: flex;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 94rpx;
  padding: 15rpx 30rpx 6rpx 62rpx;
  box-sizing: border-box;
  background-color: #fff;
  &__opt {
    display: flex;
  }
  .goods-options-opt-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    border: none;
    line-height: normal;
    border-radius: 0;
    overflow: visible;
    text {
      color: #434343;
    }
    & + .goods-options-opt-item {
      margin-left: 50rpx;
    }
    .badge {
      position: absolute;
      display: block;
      left: 38rpx;
      top: -15rpx;
      height: 30rpx;
      padding: 0 10rpx;
      border-radius: 15rpx;
      font-size: 20rpx;
      line-height: 30rpx;
      text-align: center;
      color: #fff;
      background-color: #ff2d2d;
    }
    .icon {
      font-size: 34rpx;
      line-height: 34rpx;
      margin-bottom: 10rpx;
    }
    &__text {
      font-size: 20rpx;
    }
  }
  &__btn {
    display: flex;
    .btn {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 196rpx;
      height: 60rpx;
      border-radius: 30rpx;
      font-size: 26rpx;
      font-weight: normal;
      color: #fff;
      & + .btn {
        margin-left: 22rpx;
      }
    }
  }
}
.btn {
  &--warning {
    background-color: #fcaa23;
  }
  &--danger {
    background-color: #ea4350;
  }
}
</style>
