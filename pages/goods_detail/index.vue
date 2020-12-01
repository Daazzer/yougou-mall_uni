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
          v-for="(goodsPic, index) in goodsDetail.pics"
          :key="goodsPic.pics_id"
          @click="previewGoodsImages(goodsDetail.pics.map(v => v.pics_big), goodsDetail.pics[index].pics_big)"
        >
          <image :src="goodsPic.pics_mid || '/static/images/empty.png'" />
        </swiper-item>
      </template>
    </swiper>
    <view class="goods-info">
      <view class="goods-info__head">
        <view class="goods-price">&yen;{{ goodsDetail.goods_price || 0 }}</view>
        <view class="goods-opt">
          <button
            class="iconfont icon-iconfontfenxiang"
            plain
            size="mini"
            open-type="share"
          />
          <button
            :class="['iconfont', 'icon-' + favoriteClass]"
            plain
            size="mini"
            @click="favoriteGoods"
          />
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
        </navigator>
      </view>
      <view class="goods-options-bar__btn">
        <view class="btn btn--warning">
          <text class="badge">99+</text>
          加入购物车
        </view>
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
      goods_id: 0,
      goodsDetail: {
        pics: []
      },
      isFavoriteGoods: false
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
    },
    previewGoodsImages (urls, current) {
      uni.previewImage({ urls, current })
    },
    favoriteGoods () {
      const goods_id = this.goods_id
      let title = '收藏成功'
      let icon = 'success'
      let yougou = uni.getStorageSync('yougou')

      if (!yougou) {
        yougou = {}
      }

      const favoriteGoods = new Set(yougou.favoriteGoods)

      if (!favoriteGoods.has(goods_id)) {
        favoriteGoods.add(goods_id)
      } else {
        title = '取消收藏'
        icon = 'none'
        favoriteGoods.delete(goods_id)
      }
      yougou.favoriteGoods = [...favoriteGoods]
      uni.setStorage({
        key: 'yougou',
        data: yougou,
        success: () => {
          this.isFavoriteGoods = icon === 'success' ? true : false
          uni.showToast({ title, icon })
        }
      })
    }
  },
  computed: {
    favoriteClass () {
      return this.isFavoriteGoods ? 'shoucang1' : 'shoucang'
    }
  },
  onLoad ({ goods_id }) {
    uni.showShareMenu({ withShareTicket: true })
    this.goods_id = Number(goods_id)
    this.renderGoodsDetail(Number(goods_id))
  },
  onShow () {
    let yougou = uni.getStorageSync('yougou')

    if (!yougou) {
      yougou = {}
    }

    const favoriteGoods = new Set(yougou.favoriteGoods)

    this.isFavoriteGoods = favoriteGoods.has(this.goods_id) ? true : false
  },
  onPullDownRefresh () {
    Promise
      .all([this.renderGoodsDetail(this.goods_id)])
      .then(() => uni.stopPullDownRefresh())
  },
  onShareAppMessage () {
    return {
      title: this.goodsDetail.goods_name,
      imageUrl: this.goodsDetail.goods_big_logo
    }
  },
  onAddToFavorites () {
    return {
      title: this.goodsDetail.goods_name,
      imageUrl: this.goodsDetail.goods_big_logo
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
      margin-top: 16rpx;
      font-size: 36rpx;
      color: #ea4350;
    }
    .goods-opt {
      button {
        display: inline;
        padding: 0;
        font-size: 40rpx;
        color: #707070;
        border: none;
        line-height: none;
      }
      button + button {
        margin-left: 45rpx;
      }
      .icon-shoucang1 {
        color: #fcaa23;
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
    padding: 0;
    border: none;
    line-height: normal;
    border-radius: 0;
    text {
      color: #434343;
    }
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
      .badge {
        position: absolute;
        display: block;
        right: -20rpx;
        top: -10rpx;
        width: 40rpx;
        height: 30rpx;
        padding: 0 10rpx;
        border-radius: 15rpx;
        font-size: 20rpx;
        line-height: 30rpx;
        text-align: center;
        background-color: #ff2d2d;
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
