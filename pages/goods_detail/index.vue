<template>
  <view class="goods-detail">
    <swiper
      class="goods-pics"
      indicator-dots
      indicator-active-color="#ea4350"
    >
      <template v-if="goodsDetail.pics">
        <swiper-item
          class="goods-pics__item"
          v-for="goodsPic in goodsDetail.pics"
          :key="goodsPic.pics_id"
        >
          <image :src="goodsPic.pics_big || '/static/images/empty.png'" />
        </swiper-item>
      </template>
    </swiper>
    <view class="goods-info">
      <view class="goods-info__head">
        <view class="goods-price">&yen;{{ goodsDetail.goods_price || 0 }}</view>
        <view class="goods-opt">
          <text class="iconfont icon-iconfontfenxiang" />
          <text class="iconfont icon-shoucang" />
        </view>
      </view>
      <view class="goods-info__content">{{ goodsDetail.goods_name }}</view>
    </view>
    <view class="goods-intro" v-if="goodsDetail.goods_introduce">
      <view class="goods-intro__title">图文详情</view>
      <rich-text
        class="goods-intro__content"
        :nodes="goodsDetail.goods_introduce"
      />
    </view>
    <view class="goods-intro--none" v-else>暂无图文详情</view>
    <view class="goods-options-bar">
      <view class="goods-options-bar__opt">
        <view class="goods-options-opt-item">
          <text class="iconfont icon-kefu icon" />
          <text class="goods-options-opt-item__text">联系客服</text>
        </view>
        <view class="goods-options-opt-item">
          <text class="iconfont icon-gouwuche icon" />
          <text class="goods-options-opt-item__text">购物车</text>
        </view>
      </view>
      <view class="goods-options-bar__btn">
        <view class="btn btn--warning">加入购物车</view>
        <view class="btn btn--danger">立即购买</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'GoodsDetail',
  data () {
    return {
      goods_id: '',
      goodsDetail: {}
    }
  },
  methods: {
    async renderGoodsDetail (goods_id) {
      const [err, res] = await this.$api.getGoodsDetail({ goods_id })

      if (err) {
        this.$showErrorTips(err, '获取商品详情信息失败')
        return
      }

      let goodsDetail = {}

      if (res.data.message) {
        goodsDetail = res.data.message
      }

      this.goodsDetail = goodsDetail
    }
  },
  onLoad ({ goods_id }) {
    this.goods_id = goods_id
    this.renderGoodsDetail(goods_id)
  },
  onPullDownRefresh () {
    Promise
      .all([this.renderGoodsDetail(this.goods_id)])
      .then(() => uni.stopPullDownRefresh())
  }
}
</script>

<style>
page {
  background-color: #f9f9f9;
}
</style>

<style lang="scss" scoped>
.goods-detail {
  padding-bottom: 94rpx;
}
.goods-pics {
  background-color: #fff;
  $height: 497rpx;
  height: $height;
  &__item {
    display: flex;
    justify-content: center;
    align-items: center;
    image {
      width: $height;
      height: 100%;
    }
  }
}
.goods-info {
  padding: 20rpx 35rpx 48rpx;
  margin-bottom: 19rpx;
  background-color: #fff;
  &__head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20rpx;
    .goods-price {
      color: #ea4350;
      font-size: 36rpx;
    }
    .goods-opt {
      text {
        font-size: 40rpx;
        color: #707070;
      }
      text + text {
        margin-left: 45rpx;
      }
    }
  }
  &__content {
    font-size: 30rpx;
    color: #434343;
  }
}
.goods-intro {
  background-color: #fff;
  padding: 20rpx 16rpx 0;
  &--none {
    text-align: center;
    padding-top: 80rpx;
    font-size: 38rpx;
    color: #707070;
  }
  &__title {
    margin-bottom: 20rpx;
    text-align: center;
    font-size: 28rpx;
    color: #434343;
  }
}
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
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #434343;
    & + .goods-options-opt-item {
      margin-left: 50rpx;
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
