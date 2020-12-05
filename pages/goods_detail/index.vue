<template>
  <view class="goods-detail">
    <swiper
      class="goods-pics"
      indicator-active-color="#ea4350"
      :indicator-dots="hasPics"
    >
      <template v-if="hasPics">
        <swiper-item
          class="goods-pics__item"
          v-for="(goodsPic, index) in goodsDetail.pics"
          :key="goodsPic.pics_id"
          @click="previewGoodsImages(goodsDetail.pics.map(v => v.pics_big), goodsDetail.pics[index].pics_big)"
        >
          <image :src="goodsPic.pics_mid" />
        </swiper-item>
      </template>
      <template v-else>
        <swiper-item class="goods-pics__item">
          <image src="/static/images/empty.png" />
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
    <GoodsOptionsBar
      :goodsNum="goodsNum"
      :goods_id="goods_id"
      @add-to-cart="addToCart"
    />
  </view>
</template>

<script>
import GoodsOptionsBar from '@/components/goods_detail/GoodsOptionsBar.vue'

export default {
  name: 'GoodsDetail',
  components: {
    GoodsOptionsBar
  },
  data () {
    return {
      goods_id: 0,
      goodsNum: 0,
      goodsDetail: {
        pics: []
      },
      isFavoriteGoods: false
    }
  },
  computed: {
    favoriteClass () {
      return this.isFavoriteGoods ? 'shoucang1' : 'shoucang'
    },
    hasPics () {
      return this.goodsDetail.pics.length > 0
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

      uni.setStorageSync('yougou', yougou)
      this.isFavoriteGoods = icon === 'success'
      uni.showToast({ title, icon })
    },
    addToCart () {
      let yougou = uni.getStorageSync('yougou')

      if (!yougou) {
        yougou = {}
      }

      let cart = yougou.cart

      if (!cart) {
        cart = []
      }

      let goodsItem = cart.find(goodsItem => goodsItem.goods_id === this.goods_id)
      this.goodsNum++

      if (!goodsItem) {
        const {
          goods_id,
          goods_name,
          goods_price,
          goods_small_logo
        } = this.goodsDetail

        goodsItem = {
          checked: true,
          goods_id,
          goods_name,
          goods_price,
          goodsImage: goods_small_logo,
          goodsNum: this.goodsNum
        }
        cart.push(goodsItem)
      } else {
        goodsItem.goodsNum = this.goodsNum
        for (let i = 0; i < cart.length; i++) {
          if (cart[i].goods_id === goodsItem.goods_id) {
            cart[i] = goodsItem
            break
          }
        }
      }

      yougou.cart = cart

      uni.setStorageSync('yougou', yougou)  // 如果异步修改会导致跨页面的时候数据不能实时更新
      uni.showToast({ title: '已加入购物车' })
    }
  },
  onLoad ({ goods_id }) {
    uni.showShareMenu({ withShareTicket: true })
    this.goods_id = Number(goods_id)
    this.renderGoodsDetail(Number(goods_id))
  },
  onShow () {
    const yougou = uni.getStorageSync('yougou')

    if (!yougou) {
      return
    }

    const favoriteGoods = new Set(yougou.favoriteGoods)

    if (yougou.cart) {
      const goodsItem = yougou.cart.find(goodsItem => goodsItem.goods_id === this.goods_id)
      this.goodsNum = goodsItem ? goodsItem.goodsNum : 0
    }

    this.isFavoriteGoods = favoriteGoods.has(this.goods_id)
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
</style>
