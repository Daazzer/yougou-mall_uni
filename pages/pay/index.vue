<template>
  <view class="pay">
    <view class="delivery-address">
      <button class="delivery-address__btn" size="mini" plain>选择地址</button>
    </view>
    <view class="checked-goods-list">
      <view class="checked-goods-list__title">已选商品</view>
      <GoodsItem
        v-for="checkedGoodsItem in checkedGoodsItems"
        :key="checkedGoodsItem.goods_id"
        :url="'/pages/goods_detail/index?goods_id=' + checkedGoodsItem.goods_id"
        :goodsImage="checkedGoodsItem.goodsImage"
        :goodsName="checkedGoodsItem.goods_name"
        :goodsPrice="checkedGoodsItem.goods_price"
        :goodsCount="checkedGoodsItem.goodsNum"
      />
    </view>
    <GoodsCalcBar :totalPrice="totalPrice" :checkedNum="checkedGoodsNum">
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
  },
  data () {
    return {
      checkedGoodsItems: []
    }
  },
  computed: {
    totalPrice () {
      return this.checkedGoodsItems.reduce((totalPrice, checkedGoodsItem) => {
        return totalPrice += checkedGoodsItem.goods_price * checkedGoodsItem.goodsNum
      }, 0)
    },
    checkedGoodsNum () {
      return this.checkedGoodsItems.length
    },
  },
  onShow () {
    const yougou = uni.getStorageSync('yougou')

    if (!yougou) {
      return
    }

    const goodsItems = yougou.cart

    this.checkedGoodsItems = goodsItems ? goodsItems.filter(goodsItem => goodsItem.checked) : []
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
  padding: 20rpx 20rpx 90rpx;
}
.delivery-address, .checked-goods-list {
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
.checked-goods-list {
  padding-right: 13rpx;
  &__title {
    padding: 17rpx 0 17rpx 26rpx;
    font-size: 26rpx;
    font-weight: 600;
    color: #434343;
  }
}
</style>
