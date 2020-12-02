<template>
  <view class="pay">
    <view class="delivery-address">
      <button class="delivery-address__btn" size="mini" plain>选择地址</button>
    </view>
    <view class="goods-list">
      <view class="goods-list__title">已选商品</view>
      <GoodsItem
        goodsName="项目 'yougou-mall_uni' 编译成功。前端运行日志，请另行在小程序开发工具的控制台查看。"
        :goodsPrice="3000"
        :goodsCount="1"
      />
      <GoodsItem
        goodsName="项目 'yougou-mall_uni' 编译成功。前端运行日志，请另行在小程序开发工具的控制台查看。"
        :goodsPrice="3000"
        :goodsCount="1"
      />
    </view>
    <GoodsCalcBar>
      <template>去支付</template>
    </GoodsCalcBar>
  </view>
</template>

<script>
import GoodsItem from '@/components/GoodsItem.vue'
import GoodsCalcBar from '@/components/GoodsCalcBar.vue'

export default {
  name: 'Pay',
  components: {
    GoodsItem,
    GoodsCalcBar
  }
}
</script>

<style>
page {
  background-color: #f9f9f9;
}
</style>

<style lang="scss" scoped>
.pay {
  padding: 20rpx 20rpx 0;
}
.delivery-address, .goods-list {
  background-color: #fff;
}
.delivery-address {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 187rpx;
  margin-bottom: 35rpx;
  &__btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 303rpx;
    height: 89rpx;
    $color: #ea4350;
    border: 2rpx solid $color;
    border-radius: 44rpx;
    color: $color;
    font-size: 32rpx;
    font-weight: 600;
  }
}
.goods-list {
  padding-right: 13rpx;
  &__title {
    padding: 17rpx 0 17rpx 26rpx;
    font-size: 26rpx;
    font-weight: 600;
    color: #434343;
  }
}
</style>
