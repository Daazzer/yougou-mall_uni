<template>
  <view class="collect">
    <view class="collect-list" v-if="collectItems.length > 0">
      <GoodsItem
        v-for="collectItem in collectItems"
        :key="collectItem.goods_id"
        :url="'/pages/goods_detail/index?goods_id=' + collectItem.goods_id"
        :goodsImage="collectItem.goods_small_logo"
        :goodsName="collectItem.goods_name"
        :goodsPrice="collectItem.goods_price"
      />
    </view>
    <view class="collect-list--none" v-else>
      暂无收藏商品...
    </view>
  </view>
</template>

<script>
import GoodsItem from '@/components/GoodsItem.vue'
import { checkLogin } from '../../utils'

export default {
  name: 'Collect',
  components: {
    GoodsItem
  },
  data () {
    return {
      collectItems: []
    }
  },
  onShow () {
    if (!checkLogin()) {
      uni.showToast({ title: '请登录', icon: 'none' })
      setTimeout(() => uni.redirectTo({ url: '/pages/login/index' }), 1500)
      return
    }

    const favoriteGoodsItems = this.$yougou.getData('favoriteGoodsItems')

    this.collectItems = favoriteGoodsItems ? favoriteGoodsItems : []
  }
}
</script>

<style lang="scss" scoped>
.collect {
  padding-bottom: 30rpx;
  &-list {
    padding: 20rpx 20rpx 0 0;
    &--none {
      margin-top: 300rpx;
      text-align: center;
      font-size: 40rpx;
      color: #676767;
    }
  }
}
</style>
