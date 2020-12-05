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
      :goods_number="goods_number"
      :goods_id="goods_id"
      @add-to-cart="addToCart"
    />
  </view>
</template>

<script>
import GoodsOptionsBar from '@/components/goods_detail/GoodsOptionsBar.vue'
import { getYougou, setYougou } from '@/utils/storage'

export default {
  name: 'GoodsDetail',
  components: {
    GoodsOptionsBar
  },
  data () {
    return {
      goods_id: 0,
      goods_number: 0,
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
    },
    shareMsg () {
      return {
        title: this.goodsDetail.goods_name,
        imageUrl: this.goodsDetail.goods_big_logo
      }
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
      let title = '收藏成功'
      let icon = 'success'
      let favoriteGoodsItems = this.$yougou.getData('favoriteGoodsItems')

      favoriteGoodsItems = favoriteGoodsItems ? favoriteGoodsItems : []

      const delIndex = favoriteGoodsItems.findIndex(favoriteGoodsItem => favoriteGoodsItem.goods_id === this.goods_id)

      if (delIndex > -1) {
        title = '取消收藏'
        icon = 'none'
        favoriteGoodsItems.splice(delIndex, 1)
      } else {
        favoriteGoodsItems.push({ ...this.goodsDetail })
      }

      this.$yougou.setData('favoriteGoodsItems', favoriteGoodsItems)
      this.isFavoriteGoods = icon === 'success'
      uni.showToast({ title, icon })
    },
    addToCart () {
      let cart = this.$yougou.getData('cart')

      cart = cart ? cart : []

      let goodsItemIndex = cart.findIndex(goodsItem => goodsItem.goods_id === this.goods_id)

      if (goodsItemIndex > -1) {
        this.goods_number = ++cart[goodsItemIndex].goods_number
      } else {
        this.goods_number = 0
        const goodsItem = {
          checked: true,
          goods_id: this.goods_id,
          goods_name: this.goodsDetail.goods_name,
          goods_price: this.goodsDetail.goods_price,
          goodsImage: this.goodsDetail.goods_small_logo,
          goods_number: ++this.goods_number
        }
        cart.push(goodsItem)
      }

      this.$yougou.setData('cart', cart)
      uni.showToast({ title: '已加入购物车' })
    }
  },
  onLoad ({ goods_id }) {
    uni.showShareMenu({ withShareTicket: true })
    this.goods_id = Number(goods_id)
    this.renderGoodsDetail(Number(goods_id))
  },
  onShow () {
    let favoriteGoodsItems = this.$yougou.getData('favoriteGoodsItems')
    let cart = this.$yougou.getData('cart')

    favoriteGoodsItems = favoriteGoodsItems ? favoriteGoodsItems : []
    cart = cart ? cart : []

    const favoriteItemIndex = favoriteGoodsItems.findIndex(favoriteGoodsItem => favoriteGoodsItem.goods_id === this.goods_id)
    const goodsItem = cart.find(goodsItem => goodsItem.goods_id === this.goods_id)

    if (goodsItem) {
      this.goods_number = goodsItem.goods_number
    }

    this.isFavoriteGoods = favoriteItemIndex > -1
  },
  onPullDownRefresh () {
    Promise
      .all([this.renderGoodsDetail(this.goods_id)])
      .then(() => uni.stopPullDownRefresh())
  },
  onShareAppMessage () {
    return this.shareMsg
  },
  onAddToFavorites () {
    return this.shareMsg
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
