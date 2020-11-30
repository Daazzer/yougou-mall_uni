<template>
  <view class="goods-item">
    <view class="goods-item__select-bar" v-if="isShowSelectBtn">
      <icon
        size="35rpx"
        :type="goodsSelected ? 'success' : 'circle'"
        :color="goodsSelected ? '#e03440': '#8a8a8a'"
        @click="$emit('select-goods')"
      />
    </view>
    <image class="goods-item__image" :src="goodsImage || '/static/images/empty.png'" lazy-load />
    <view class="goods-item__info">
      <view class="goods-name">{{ goodsName }}</view>
      <view class="goods-body">
        <view class="goods-price" v-if="goodsPrice || goodsPrice === 0">¥ {{ goodsPrice || 0 }}</view>
        <view class="goods-option" v-if="goodsNum !== '' && goodsNum">
          <text class="goods-btn iconfont icon-jianhao" @click="$emit('reduce')" />
          <view class="goods-num">{{ goodsNum }}</view>
          <text class="goods-btn iconfont icon-jiahao" @click="$emit('add')" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'GoodsItem',
  props: {
    goodsSelected: {
      type: [Boolean, undefined],
      default: undefined
    },
    goodsImage: {
      type: String,
      required: true
    },
    goodsName: {
      type: String,
      required: true
    },
    goodsPrice: {
      type: Number
    },
    goodsNum: {
      type: Number
    }
  },
  computed: {
    isShowSelectBtn () {
      return typeof this.goodsSelected === 'boolean'
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-item {
  display: flex;
  padding: 10rpx 0 10rpx 15rpx;
  &__select-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 35rpx;
  }
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
    .goods-name {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      line-clamp: 3;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .goods-body {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .goods-option {
        @extend .goods-body;
        align-items: center;
        color: #8a8a8a;
        .goods-num {
          margin: 0 22rpx;
          font-size: 30rpx;
        }
        .goods-btn {
          font-size: 32rpx;
        }
      }
    }
  }
}
</style>
