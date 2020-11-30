<template>
  <view :class="{ 'search-bar': true, fixed: isFixed }">
    <navigator class="search-bar__btn" url="/pages/search/index">搜索</navigator>
  </view>
</template>

<script>
  export default {
    props: {
      isFixed: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style lang="scss" scoped>
.search-bar {
  height: 100rpx;
  padding: 10rpx 25rpx;
  box-sizing: border-box;
  background-color: #ea4350;
  &.fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }
  &__btn {
    display: block;
    height: 100%;
    width: 100%;
    border-radius: 5rpx;
    font-size: 32rpx;
    line-height: 80rpx;
    text-align: center;
    color: #767676;
    background-color: #fff;
  }
}
</style>
