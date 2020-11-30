<template>
  <view class="cart">
    <view class="cart-list">
      <GoodsItem
        goodsName="商品界面涉及到比较多操作，如果用组件，会出现比较多交互，不方便商品界面涉及到比较多操作，如果用组件，会出现比较多交互，不方便"
        :goodsPrice="3999"
        :goodsNum="12"
        :goodsSelected="false"
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
    <view class="total-bar">
      <view class="total-bar__opt-group">
        <view class="select-all-btn">
          <icon type="success" color="#e03440" size="35rpx" />
          <label>全选</label>
        </view>
        <view class="total">
          <text class="total__text">合计:</text>
          <text class="total__price">&yen;3999</text>
        </view>
      </view>
      <button class="total-bar__settle-btn">去结算(12)</button>
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
  &-list {
    padding: 0 26rpx;
  }
}
.total-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 113rpx;
  display: flex;
  justify-content: space-between;
  padding: 15rpx 22rpx;
  border-top: 1px solid #fafafa;
  &__opt-group {
    display: flex;
    align-items: flex-end;
    .select-all-btn {
      @extend .total-bar__opt-group;
      margin-right: 36rpx;
      label {
        margin-left: 24rpx;
        margin-bottom: 3rpx;
        font-size: 21rpx;
        color: #8a8a8a;
      }
    }
    .total {
      $fontSize: 26rpx;
      font-size: $fontSize;
      font-weight: 600;
      &__text {
        margin-right: 20rpx;
        color: #292929;
      }
      &__price {
        color: #ea4350;
        font-size: $fontSize + 2rpx;
      }
    }
  }
  &__settle-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin: 0;
    width: 150rpx;
    height: 52rpx;
    border-radius: 26rpx;
    font-size: 21rpx;
    color: #fff;
    background-color: #ea4350;
  }
}
</style>
