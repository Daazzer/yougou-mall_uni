<template>
  <view class="goods-item">
    <view class="goods-item__check-bar" v-if="isShowSelectBtn" @click="$emit('checked-goods')">
      <icon
        size="40rpx"
        :type="goodsChecked ? 'success' : 'circle'"
        :color="goodsChecked ? '#e03440': '#8a8a8a'"
      />
    </view>
    <view class="goods-item-link">
      <navigator :url="url">
        <image class="goods-item__image" :src="goodsImage || '/static/images/empty.png'" lazy-load />
      </navigator>
      <view class="goods-item__info" @click="linkToUrl">
        <view class="goods-name">{{ goodsName }}</view>
        <view class="goods-body">
          <view class="goods-price" v-if="goodsPrice || goodsPrice === 0">¥ {{ goodsPrice || 0 }}</view>
          <view class="goods-count" v-if="goodsCount || goodsCount === 0">
            &times;{{ goodsCount }}
          </view>
        </view>
      </view>
    </view>
    <view class="goods-item__option" v-if="goodsNum !== '' && goodsNum">
      <text class="goods-btn iconfont icon-jianhao" @click="$emit('reduce-goods-num')" />
      <view class="goods-num">{{ goodsNum }}</view>
      <text class="goods-btn iconfont icon-jiahao" @click="$emit('add-goods-num')" />
    </view>
  </view>
</template>

<script>
export default {
  name: 'GoodsItem',
  props: {
    url: {
      type: String,
      required: true
    },
    goodsChecked: {
      type: [Boolean, null],
      default: null
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
      type: [Number, null],
      default: null
    },
    goodsNum: {
      type: Number
    },
    goodsCount: {
      type: [Number, null],
      default: null
    }
  },
  computed: {
    isShowSelectBtn () {
      return typeof this.goodsChecked === 'boolean'
    }
  },
  methods: {
    linkToUrl () {
      if (this.goodsChecked === null) {
        uni.navigateTo({ url: this.url })
      } else {
        this.$emit('checked-goods')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-item {
  display: flex;
  position: relative;
  padding: 10rpx 0 10rpx 15rpx;
  &-link {
    display: flex;
    align-items: center;
  }
  &__check-bar {
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
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    padding: 26rpx 0;
    margin-left: 30rpx;
    font-size: 30rpx;
    color: #434343;
    .goods-price {
      color: #ea4350;
    }
    .goods-name {
      display: -webkit-box;
      margin-bottom: 25rpx;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      line-clamp: 3;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .goods-body {
      .goods-count {
        margin-right: 13rpx;
        font-size: 28rpx;
      }
    }
  }
  &__info .goods-body,
  &__option {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  &__option {
    position: absolute;
    align-items: center;
    right: 13rpx;
    bottom: 28rpx;
    color: #8a8a8a;
    z-index: 10;
    .goods-num {
      margin: 0 22rpx;
      font-size: 32rpx;
    }
    .goods-btn {
      font-size: 40rpx;
    }
  }
}
</style>
