<template>
  <view class="feedback">
    <view class="feedback__quest-type">
      <view class="quest-type-title">请选择问题类型</view>
      <view class="quest-type-list">
        <view
          :class="{
            'quest-type-list__item': true,
            active: questTypeItem.checked
          }"
          v-for="(questTypeItem, index) in questTypeItems"
          :key="questTypeItem.content"
          @click="checkQuest(index, questTypeItem.checked)"
        >{{ questTypeItem.content }}</view>
      </view>
    </view>
    <textarea class="feedback__quest-content" placeholder="请描述一下您的问题" />
    <view class="feedback__upload">
      <view class="upload-title">上传图片 ({{ imageItems.length }}/4)</view>
      <view class="upload-images">
        <view class="upload-images-list">
          <view class="upload-images-list__btn iconfont icon-jiahao1" @click="uploadImg" />
          <template v-if="imageItems.length > 0">
            <view
              class="upload-images-list__item"
              v-for="(imageItem, index) in imageItems"
              :key="imageItem"
            >
              <image :src="imageItem" />
              <view class="clear-image-btn iconfont icon-guanbi" @click="clearImage(index)" />
            </view>
          </template>
        </view>
      </view>
    </view>
    <button class="feedback__submit" type="warn">提交</button>
  </view>
</template>

<script>
export default {
  name: 'FeedBack',
  data () {
    return {
      questTypeItems: [
        { content: '功能问题', checked: true },
        { content: '性能问题', checked: false },
        { content: '体验问题', checked: false },
        { content: '其他', checked: false }
      ],
      imageItems: []
    }
  },
  methods: {
    checkQuest (index, checked) {
      this.questTypeItems[index].checked = !checked
    },
    uploadImg () {
      uni.chooseImage({
        count: 4,
        success: chooseImageRes => {
          if (this.imageItems.length >= 4) {
            uni.showToast({ title: '最多上传四张图片', icon: 'none' })
            return
          }
          const tempFilePaths = chooseImageRes.tempFilePaths
          tempFilePaths.forEach(tempFilePath => {
            if (this.imageItems.length < 4) {
              this.imageItems.push(tempFilePath)
            }
          })
        }
      })
    },
    clearImage (index) {
      this.imageItems.splice(index, 1)
    }
  }
}
</script>

<style>
page {
  background-color: #f9f9f9;
}
</style>

<style lang="scss" scoped>
.feedback {
  padding: 20rpx;
  padding: 20rpx 20rpx calc(20rpx + constant(safe-area-inset-bottom));
  padding: 20rpx 20rpx calc(20rpx + env(safe-area-inset-bottom));
  &__quest-type,
  &__quest-content,
  &__upload {
    background-color: #fff;
  }
  &__quest-type {
    padding: 25rpx 35rpx;
    margin-bottom: 20rpx;
    .quest-type-title {
      margin-bottom: 20rpx;
      font-size: 32rpx;
      color: #434343;
    }
    .quest-type-list {
      display: flex;
      flex-wrap: wrap;
      &__item {
        width: 180rpx;
        height: 70rpx;
        margin-right: 45rpx;
        margin-bottom: 25rpx;
        text-align: center;
        line-height: 70rpx;
        font-size: 28rpx;
        border: 1rpx solid transparent;
        border-radius: 35rpx;
        color: #545353;
        background-color: #ededed;
        &.active {
          border: 1rpx solid #ea4350;
          color: #ea4350;
          background-color: #ffe6e6;
        }
        &:nth-child(3n) {
          margin-right: 0;
        }
      }
    }
  }
  &__quest-content {
    height: 391rpx;
    width: 645rpx;
    padding: 30rpx 35rpx;
    margin-bottom: 20rpx;
    font-size: 32rpx;
  }
  &__upload {
    padding: 30rpx 18rpx;
    margin-bottom: 35rpx;
    font-size: 26rpx;
    color: #434343;
    .upload-title {
      margin-bottom: 30rpx;
    }
    .upload-images-list {
      display: flex;
      &__btn, &__item {
        width: 130rpx;
        height: 130rpx;
        margin-right: 8rpx;
      }
      &__btn {
        font-size: 75rpx;
        line-height: 130rpx;
        text-align: center;
        color: #a6a6a6;
        background-color: #d8d8d8;
      }
      &__item {
        position: relative;
        image {
          width: 100%;
          height: 100%;
        }
        .clear-image-btn {
          position: absolute;
          right: -16rpx;
          top: -16rpx;
          width: 45rpx;
          height: 45rpx;
          line-height: 45rpx;
          border-radius: 50%;
          font-size: 26rpx;
          font-weight: 600;
          text-align: center;
          color: #f9d247;
          background-color: #e0343fe7;
          z-index: 10;
        }
      }
    }
  }
  &__submit {
    height: 100rpx;
    line-height: 100rpx;
    border-radius: 50rpx;
    font-size: 35rpx;
    background-color: #ea4350;
    &::after {
      content: none;
    }
  }
}
</style>
