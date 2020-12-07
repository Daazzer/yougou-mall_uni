<template>
  <view
    class="goods-calc-bar"
    :style="{
      bottom,
      bottom: `calc(${bottom} + constant(safe-area-inset-bottom))`,
      bottom: `calc(${bottom} + env(safe-area-inset-bottom))`
    }"
  >
    <view class="goods-calc-bar__opt-group">
      <view
        class="checked-all-btn"
        v-if="checkedAllBtn"
        @click="$emit('checked-all')"
      >
        <icon
          :type="isCheckedAll ? 'success': 'circle'"
          :color="isCheckedAll ? '#e03440' : ''"
          size="40rpx"
        />
        <label class="checked-all-btn__label">全选</label>
      </view>
      <view class="total">
        <text class="total__text">合计：</text>
        <text class="total__price">&yen;{{ totalPrice }}</text>
      </view>
    </view>
    <view class="goods-calc-bar__btn-group">
      <button
        class="del-btn"
        v-if="showDeleteBtn"
        @click="$emit('delete')"
      >删除({{ checkedNum }})</button>
      <button
        :class="{
          'settle-btn': true,
          disabled: disabledSettleBtn
        }"
        @click="handleSettle"
      >
        <slot></slot>({{ checkedNum }})
      </button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'GoodsCalcBar',
  props: {
    bottom: {
      type: [String, Number],
      default: 0
    },
    checkedAllBtn: {
      type: Boolean,
      default: false
    },
    showDeleteBtn: {
      type: Boolean,
      default: false
    },
    isCheckedAll: {
      type: Boolean,
      default: true
    },
    totalPrice: {
      type: Number,
      default: 0
    },
    checkedNum: {
      type: Number,
      default: 0
    },
    disabledSettleBtn: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleSettle () {
      if (!this.disabledSettleBtn) {
        this.$emit('settle')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-calc-bar {
  position: fixed;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100rpx;
  padding: 15rpx 22rpx;
  border-top: 1px solid #fafafa;
  background-color: #fff;
  z-index: 100;
  &__opt-group {
    display: flex;
    align-items: center;
    .checked-all-btn {
      display: flex;
      margin-right: 36rpx;
      &__label {
        margin-left: 24rpx;
        margin-bottom: 3rpx;
        font-size: 28rpx;
        color: #8a8a8a;
      }
    }
    .total {
      $fontSize: 30rpx;
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
      height: 65rpx;
      padding: 0;
      margin: 0;
      border-radius: 32.5rpx;
      font-size: 24rpx;
      color: #fff;
      &::after {
        content: none;
      }
    }
    .del-btn {
      @extend %btn;
      width: 130rpx;
      background-color: #fcaa23;
    }
    .settle-btn {
      @extend %btn;
      margin-left: 30rpx;
      width: 165rpx;
      background-color: #ea4350;
      &.disabled {
        background-color: #b6b6b6;
      }
    }
  }
}
</style>
