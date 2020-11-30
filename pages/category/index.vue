<template>
  <view class="category">
    <SearchBar isFixed />
    <scroll-view class="category-nav-list" scroll-y>
      <template v-if="categoryNavItems">
        <view
          :class="{
            'category-nav-list__item': true,
            active: categoryNavSelected === index
          }"
          v-for="(categoryNavItem, index) in categoryNavItems"
          :key="categoryNavItem.cat_id"
          @click="handleTapCategoryNav(index)"
        >
          {{ categoryNavItem.cat_name }}
        </view>
      </template>
    </scroll-view>
    <view class="category-list">
      <template v-if="categoryNavItems">
        <view
          class="category-list__item"
          v-for="categoryItem in categoryNavItems[categoryNavSelected].children"
          :key="categoryItem.cat_id"
        >
          <view class="category-title">/ {{ categoryItem.cat_name }} /</view>
          <view class="goods-list">
            <view
              class="goods-list__item"
              v-for="goodsItem in categoryItem.children"
              :key="goodsItem.cat_id"
            >
              <image :src="goodsItem.cat_icon" />
              <text>{{ goodsItem.cat_name }}</text>
            </view>
          </view>
        </view>
      </template>
    </view>
  </view>
</template>

<script>
import SearchBar from '@/components/SearchBar.vue'

export default {
  name: 'Category',
  components: {
    SearchBar
  },
  data () {
    return {
      categoryNavSelected: 0,
      categoryNavItems: []
    }
  },
  methods: {
    async renderCategoryNavItems () {
      const [err, res] = await this.$api.getCategories()
 
      if (err) {
        this.$showErrorTips(err, '获取分类信息失败')
        return
      }
 
      let categoryNavItems = []
 
      if (res.data.message) {
        categoryNavItems = res.data.message
      }
 
      this.categoryNavItems = categoryNavItems
    },
    handleTapCategoryNav (index) {
      this.categoryNavSelected = index
    }
  },
  onLoad ({ cate_nav_index }) {
    if (cate_nav_index) {
      this.categoryNavSelected = cate_nav_index
    }
    this.renderCategoryNavItems()
  },
  onShow () {
    const page = this.$mp.page
    if (typeof page.getTabBar === 'function' && page.getTabBar()) {  
      page.getTabBar().setData({ currentIndex: 1 })  
    }
  },
  onPullDownRefresh () {
    Promise.all([this.renderCategoryNavItems()]).then(() => uni.stopPullDownRefresh())
  }
}
</script>

<style lang="scss" scoped>
.category {
  padding-bottom: 113rpx;
}
.category-nav-list {
  position: fixed;
  left: 0;
  top: 100rpx;
  width: 182rpx;
  height: calc(100vh - 213rpx);
  background-color: #f3f3f3;
  z-index: 5;
  &__item {
    position: relative;
    padding: 20rpx 0;
    text-align: center;
    font-size: 28rpx;
    font-weight: 500;
    color: #585858;
    &.active {
      color: #ea4350;
      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 16rpx;
        display: block;
        width: 4rpx;
        height: 43rpx;
        background-color: #ea4350;
      }
    }
  }
}
.category-list {
  padding-top: 100rpx;
  padding-left: 182rpx;
}
.category-title {
  padding-top: 18rpx;
  margin-bottom: 30rpx;
  text-align: center;
  font-size: 26rpx;
  color: #575757;
}
.goods-list {
  display: flex;
  flex-wrap: wrap;
  padding: 0 48rpx;
  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 0 30rpx 56rpx;
    font-size: 21rpx;
    color: #2e2e2e;
    &:nth-child(3n + 1) {
      margin-left: 0;
    }
    image {
      $size: 120rpx;
      width: $size;
      height: $size;
      margin-bottom: 10rpx;
    }
  }
}
</style>
