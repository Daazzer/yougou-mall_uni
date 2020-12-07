<template>
  <view class="cart">
    <view class="cart-list" v-if="goodsItems.length > 0">
      <GoodsItem
        v-for="(goodsItem, index) in goodsItems"
        :key="goodsItem.goods_id"
        :url="'/pages/goods_detail/index?goods_id=' + goodsItem.goods_id"
        :goodsChecked="goodsItem.checked"
        :goodsImage="goodsItem.goodsImage"
        :goodsName="goodsItem.goods_name"
        :goodsPrice="goodsItem.goods_price"
        :goodsNum="goodsItem.goods_number"
        @checked-goods="handleCheckedGoods(index)"
        @add-goods-num="handleAddGoodsNum(index)"
        @reduce-goods-num="handleReduceGoodsNum(index)"
      />
    </view>
    <view class="cart-list--none" v-else>购物车空空如也...</view>
    <GoodsCalcBar
      checkedAllBtn
      :paddingBottom="'126rpx'"
      :showDeleteBtn="showDeleteBtn"
      :isCheckedAll="isCheckedAll"
      :totalPrice="totalPrice"
      :checkedNum="checkedGoodsNum"
      :disabledSettleBtn="checkedGoodsNum <= 0"
      @checked-all="checkedAll"
      @delete="deleteGoodsItems"
      @settle="goToPay"
    >
      <template>去结算</template>
    </GoodsCalcBar>
  </view>
</template>

<script>
import GoodsItem from '@/components/GoodsItem.vue'
import GoodsCalcBar from '@/components/GoodsCalcBar.vue'

export default {
  name: 'Cart',
  components: {
    GoodsItem,
    GoodsCalcBar
  },
  data () {
    return {
      goodsItems: []
    }
  },
  computed: {
    isCheckedAll () {
      const unCheckedIndex = this.goodsItems.findIndex(goodsItem => goodsItem.checked === false)
      return unCheckedIndex === -1 && this.goodsItems.length > 0
    },
    totalPrice () {
      return this.goodsItems.reduce((totalPrice, goodsItem) => {
        if (goodsItem.checked) {
          totalPrice += goodsItem.goods_price * goodsItem.goods_number
        }
        return totalPrice
      }, 0)
    },
    goodsTotalNum () {
      return this.goodsItems.reduce((totalNum, goodsItem) => {
        if (goodsItem.checked) {
          totalNum += goodsItem.goods_number
        }
        return totalNum
      }, 0)
    },
    checkedGoodsNum () {
      return this.goodsItems.reduce((checkedNum, goodsItem) => {
        if (goodsItem.checked) {
          checkedNum++
        }
        return checkedNum
      }, 0)
    },
    showDeleteBtn () {
      return this.goodsItems.length > 0
    }
  },
  methods: {
    handleCheckedGoods (index) {
      const checked = this.goodsItems[index].checked
      this.goodsItems[index].checked = !checked
      this.setCart()
    },
    handleAddGoodsNum (index) {
      this.goodsItems[index].goods_number++
      this.setCart()
    },
    handleReduceGoodsNum (index) {
      if (this.goodsItems[index].goods_number > 1) {
        this.goodsItems[index].goods_number--
        this.setCart()
      }
    },
    checkedAll () {
      if (this.goodsItems.length <= 0) {
        return
      }
      const checked = this.isCheckedAll
      this.goodsItems.forEach(goodsItem => {
        if (goodsItem.checked === checked) {
          goodsItem.checked = !checked
        }
      })
      this.setCart()
    },
    setCart () {
      this.$yougou.setData('cart', [...this.goodsItems])
    },
    deleteGoodsItems () {
      if (this.checkedGoodsNum <= 0) {
        uni.showToast({ title: '请选择要删除的商品', icon: 'none' })
        return
      }
      uni.showModal({
        title: '提示',
        content: '是否删除选中的商品',
        success: res => {
          if (res.confirm) {
            const reserveGoodsItems = this.goodsItems.filter(goodsItem => !goodsItem.checked)
            this.goodsItems = reserveGoodsItems
            this.setCart()
          }
        }
      })
    },
    goToPay () {
      uni.navigateTo({ url: '/pages/pay/index' })
    }
  },
  onShow () {
    const page = this.$mp.page
    if (typeof page.getTabBar === 'function' && page.getTabBar()) {
      page.getTabBar().setData({ currentIndex: 2 })
    }

    const cart = this.$yougou.getData('cart')

    this.goodsItems = cart ? cart : []
  }
}
</script>

<style lang="scss" scoped>
.cart {
  padding: 20rpx 0 230rpx;
  padding: 20rpx 0 calc(230rpx + constant(safe-area-inset-bottom));
  padding: 20rpx 0 calc(230rpx + env(safe-area-inset-bottom));
  &-list {
    padding: 0 26rpx;
    &--none {
      text-align: center;
      padding-top: 300rpx;
      font-size: 38rpx;
      color: #8a8a8a;
    }
  }
}
</style>
