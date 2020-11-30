<template>
  <view class="goods-item">
    <image class="goods-item__image" :src="goodsImage" />
    <view class="goods-item__info">
      <view class="goods-name">{{ goodsName }}</view>
      <view class="goods-price" v-if="goodsPrice">¥ {{ goodsPrice || 0 }}</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'GoodsItem',
  props: {
    goodsImage: {
      type: String,
      required: true
    },
    goodsName: {
      type: String,
      required: true
    },
    goodsPrice: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-item {
  display: flex;
  padding: 10rpx 0 10rpx 15rpx;
  &__image {
    $size: 190rpx;
    width: $size;
    height: $size;
    flex-shrink: 0;
  }
  &__info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 26rpx 0;
    margin-left: 30rpx;
    font-size: 24rpx;
    color: #434343;
    .goods-price {
      color: #ea4350;
    }
  }
}
</style>
