<template>
  <view class="cart">
    <view class="cart-list" v-if="goodsItems.length > 0">
      <GoodsItem
        v-for="(goodsItem, index) in goodsItems"
        :key="goodsItem.goods_id"
        :goodsChecked="goodsItem.checked"
        :goodsImage="goodsItem.goodsImage"
        :goodsName="goodsItem.goodsName"
        :goodsPrice="goodsItem.goods_price"
        :goodsNum="goodsItem.goods_number"
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
      goodsItems: [
        {
          goodsImage: '/static/images/cart.png',
          goodsName: '电视',
          goods_id: 129,
          goods_number: 12,
          goods_price: 3999,
          checked: true
        },
        {
          goodsImage: '/static/images/cart.png',
          goodsName: '冰箱',
          goods_id: 127,
          goods_number: 1,
          goods_price: 8999,
          checked: true
        }
      ]
    }
  },
  methods: {
    handleCheckedGoods (index) {
      const checked = this.goodsItems[index].checked
      this.goodsItems[index].checked = !checked
    },
    handleAddGoodsNum (index) {
      this.goodsItems[index].goods_number++
    },
    handleReduceGoodsNum (index) {
      if (this.goodsItems[index].goods_number > 1) {
        this.goodsItems[index].goods_number--
      }
    },
    checkedAll () {
      if (this.goodsItems.length <= 0) {
        return
      }
      if (this.isCheckedAll) {
        this.goodsItems.forEach(goodsItem => {
          if (goodsItem.checked) {
            goodsItem.checked = false
          }
        })
      } else {
        this.goodsItems.forEach(goodsItem => {
          if (!goodsItem.checked) {
            goodsItem.checked = true
          }
        })
      }
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
