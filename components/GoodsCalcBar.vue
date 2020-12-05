<template>
  <view class="goods-calc-bar" :style="{ bottom }">
    <view class="goods-calc-bar__opt-group">
      <view
        class="checked-all-btn"
        v-if="checkedAllBtn"
        @click="$emit('checked-all')"
      >
        <icon
          :type="isCheckedAll ? 'success': 'circle'"
          :color="isCheckedAll ? '#e03440' : ''"
          size="35rpx"
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
  height: 83rpx;
  padding: 15rpx 22rpx;
  border-top: 1px solid #fafafa;
  background-color: #fff;
  &__opt-group {
    display: flex;
    align-items: center;
    .checked-all-btn {
      display: flex;
      align-items: flex-end;
      margin-right: 36rpx;
      &__label {
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
      &.disabled {
        background-color: #b6b6b6;
      }
    }
  }
}
</style>
