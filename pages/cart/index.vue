<template>
  <view class="cart">
    <view class="cart-list" v-if="goodsItems.length > 0">
      <GoodsItem
        v-for="(goodsItem, index) in goodsItems"
        :key="goodsItem.goods_id"
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
    <view class="total-bar">
      <view class="total-bar__opt-group">
        <view class="select-all-btn" @click="checkedAll">
          <icon
            :type="isCheckedAll ? 'success': 'circle'"
            :color="isCheckedAll ? '#e03440' : ''"
            size="35rpx"
          />
          <label>全选</label>
        </view>
        <view class="total">
          <text class="total__text">合计：</text>
          <text class="total__price">&yen;{{ order_price }}</text>
        </view>
      </view>
      <view class="total-bar__btn-group">
        <button
          class="del-btn"
          v-if="goodsItems.length > 0"
          @click="deleteGoodsItems"
        >删除({{ checkedGoodsNum }})</button>
        <button class="settle-btn">去结算({{ checkedGoodsNum }})</button>
      </view>
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
    }
  },
  computed: {
    isCheckedAll () {
      if (this.goodsItems.length <= 0) {
        return false
      }
      return this.goodsItems.every(goodsItem => goodsItem.checked)
    },
    order_price () {
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
    }
  },
  onShow () {
    const page = this.$mp.page
    if (typeof page.getTabBar === 'function' && page.getTabBar()) {
      page.getTabBar().setData({ currentIndex: 2 })
    }

    const yougou = uni.getStorageSync('yougou')

    if (!yougou) {
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
    align-items: center;
    .select-all-btn {
      display: flex;
      align-items: flex-end;
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
        margin-right: 10rpx;
        color: #292929;
      }
      &__price {
        color: #ea4350;
        font-size: $fontSize + 2rpx;
      }
    }
  }
  &__btn-group {
    display: flex;
    align-items: center;
    %btn {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 52rpx;
      padding: 0;
      margin: 0;
      border-radius: 26rpx;
      font-size: 21rpx;
      color: #fff;
    }
    .del-btn {
      @extend %btn;
      width: 120rpx;
      background-color: #fcaa23;
    }
    .settle-btn {
      @extend %btn;
      margin-left: 30rpx;
      width: 150rpx;
      background-color: #ea4350;
    }
  }
}
</style>
