<template>
  <view class="goods-item">
    <image class="goods-item__image" :src="goodsImage" />
    <view class="goods-item__name">{{ goodsName }}</view>
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
  &__name {
    margin-left: 30rpx;
    font-size: 24rpx;
    color: #434343;
  }
}
</style>
