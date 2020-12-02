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
        :goodsNum="goodsItem.goodsNum"
        @checked-goods="handleCheckedGoods(index)"
        @add-goods-num="handleAddGoodsNum(index)"
        @reduce-goods-num="handleReduceGoodsNum(index)"
      />
    </view>
    <view class="cart-list--none" v-else>购物车空空如也...</view>
    <GoodsCalcBar
      bottom="113rpx"
      checkedAllBtn
      :deleteBtn="deleteBtn"
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
  methods: {
    handleCheckedGoods (index) {
      const checked = this.goodsItems[index].checked
      this.goodsItems[index].checked = !checked
      this.setCart()
    },
    handleAddGoodsNum (index) {
      this.goodsItems[index].goodsNum++
      this.setCart()
    },
    handleReduceGoodsNum (index) {
      if (this.goodsItems[index].goodsNum > 1) {
        this.goodsItems[index].goodsNum--
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
      let yougou = uni.getStorageSync('yougou')

      if (!yougou) {
        yougou = {}
      }

      yougou.cart = this.goodsItems

      uni.setStorageSync('yougou', yougou)
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
  computed: {
    isCheckedAll () {
      if (this.goodsItems.length <= 0) {
        return false
      }
      return this.goodsItems.every(goodsItem => goodsItem.checked)
    },
    totalPrice () {
      return this.goodsItems.reduce((totalPrice, goodsItem) => {
        if (goodsItem.checked) {
          totalPrice += goodsItem.goods_price * goodsItem.goodsNum
        }
        return totalPrice
      }, 0)
    },
    goodsTotalNum () {
      return this.goodsItems.reduce((totalNum, goodsItem) => {
        if (goodsItem.checked) {
          totalNum += goodsItem.goodsNum
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
    deleteBtn () {
      return this.goodsItems.length > 0
    }
  },
  onShow () {
    const page = this.$mp.page
    if (typeof page.getTabBar === 'function' && page.getTabBar()) {
      page.getTabBar().setData({ currentIndex: 2 })
    }

    const yougou = uni.getStorageSync('yougou')

    if (!yougou) {
      this.goodsItems = []
      return
    }

    const goodsItems = yougou.cart

    this.goodsItems = goodsItems ? goodsItems : []
  }
}
</script>

<style lang="scss" scoped>
.cart {
  padding: 27rpx 0 200rpx;
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
