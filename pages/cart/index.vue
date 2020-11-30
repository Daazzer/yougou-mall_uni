<template>
  <view class="cart">
    <view class="cart-list">
      <GoodsItem
        goodsName="商品界面涉及到比较多操作，如果用组件，会出现比较多交互，不方便商品界面涉及到比较多操作，如果用组件，会出现比较多交互，不方便"
        :goodsPrice="3999"
        :goodsNum="12"
        @select-goods="handleSelectGoods"
        @add="handleAdd"
        @reduce="handleReduce"
      />
      <GoodsItem
        goodsName="商品界面涉及到比较多操作，如果用组件，会出现比较多交互，不方便"
        :goodsSelected="true"
        :goodsPrice="3999"
        :goodsNum="1"
      />
    </view>
  </view>
</template>

<script>
import GoodsItem from '@/components/GoodsItem.vue'

export default {
  name: 'Cart',
  components: {
    GoodsItem
  },
  methods: {
    handleSelectGoods () {
      console.log('select')
    },
    handleAdd () {
      console.log('add')
    },
    handleReduce () {
      console.log('reduce')
    }
  },
  onShow () {
    const page = this.$mp.page
    if (typeof page.getTabBar === 'function' && page.getTabBar()) {
      page.getTabBar().setData({ currentIndex: 2 })
    }
  }
}
</script>

<style lang="scss" scoped>
.cart {
  padding: 27rpx 0 200rpx;
}
.cart-list {
  padding: 0 26rpx;
}
</style>
