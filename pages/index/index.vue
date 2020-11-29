<template>
	<view :class="{ index: true, 'pt-100': isSearchBarFixed }">
    <SearchBar :isFixed="isSearchBarFixed" id="searchBar" />
    <swiper
      class="carousel"
      circular
      indicator-dots
      autoplay
      indicator-active-color="#ea4350"
    >
      <template v-if="carouselItems">
        <swiper-item 
          class="carousel__item"
          v-for="carouselItem in carouselItems"
          :key="carouselItem.goods_id"
        >
          <navigator :url="'/pages/goods_detail/index?goods_id=' + carouselItem.goods_id">
            <image class="swiper-image" :src="carouselItem.image_src" />
          </navigator>
        </swiper-item>
      </template>
    </swiper>
    <view class="cate-nav-list">
      <template v-if="cateItems">
        <view 
          class="cate-nav-list__item" 
          v-for="cateItem in cateItems"
          :key="cateItem.image_src"
        >
          <navigator
            :url="cateItem.navigatorUrl"
            :open-type="cateItem.name === '分类' ? 'switchTab' : 'navigate'"
          >
            <image :src="cateItem.image_src" />
          </navigator>
        </view>
      </template>
    </view>
    <view class="recommend-list">
      <template v-if="recommendItems && recommendItems.length > 0">
        <view
          class="recommend-list__item"
          v-for="recommendItem in recommendItems"
          :key="recommendItem.floor_title.image_src"
        >
          <view class="recommend-title">
            <image :src="recommendItem.floor_title.image_src" />
          </view>
          <view class="recommend-pics">
            <view class="recommend-pics__main">
              <navigator :url="recommendItem.product_list[0].navigator_url">
                <image :src="recommendItem.product_list[0].image_src" />
              </navigator>
            </view>
            <view class="recommend-pics-list">
              <block 
                v-for="(recommendProduct, index) in recommendItem.product_list"
                :key="recommendProduct.image_src"
              >
                <view class="recommend-pics-list__item" v-if="index > 0">
                  <navigator :url="recommendProduct.navigator_url">
                    <image :src="recommendProduct.image_src" />
                  </navigator>
                </view>
              </block>
            </view>
          </view>
        </view>
      </template>
    </view>
	</view>
</template>

<script>
import SearchBar from '@/components/SearchBar.vue'
import { getRect } from '@/utils'
export default {
  name: 'index',
  components: {
    SearchBar
  },
  data () {
    return {
      isSearchBarFixed: false,
      carouselItems: [],
      cateItems: [],
      recommendItems: []
    }
  },
  methods: {
    async renderCarousel () {
      const [err, res] = await this.$api.getSwiperdata()

      if (err) {
        this.$showErrorTips(err, '获取轮播数据失败')
        return
      }

      let carouselItems = []

      if (res.data.message) {
        carouselItems = res.data.message
      }

      this.carouselItems = carouselItems
    },
    async renderCateItems () {
      const [err, res] = await this.$api.getCateItems()
  
      if (err) {
        this.$showErrorTips(err, '获取分类导航数据失败')
        return
      }
  
      let cateItems = []
  
      if (res.data.message) {
        cateItems = res.data.message.map(v => {
          // 添加导航路径
          if (v.name === '分类') {
            v.navigatorUrl = '/pages/category/index'
          } else {
            v.navigatorUrl = '/pages/goods_list/index?query=' + v.name
          }
          return v
        })
      }
 
      this.cateItems = cateItems
    },
    async renderRecommendItems () {
      const [err, res] = await this.$api.getRecommeds()
  
      if (err) {
        this.$showErrorTips(err, '获取推荐商品数据失败')
        return
      }
  
      let recommendItems = []
  
      if (res.data.message) {
        recommendItems = res.data.message
      }
  
      this.recommendItems = recommendItems
    }
  },
  onLoad() {
    this.renderCarousel()
    this.renderCateItems()
    this.renderRecommendItems()
  },
  onShow () {
    const page = this.$mp.page
    if (typeof page.getTabBar === 'function' && page.getTabBar()) {  
      page.getTabBar().setData({ currentIndex: 0 })  
    }
  },
  async onPageScroll ({ scrollTop }) {
    const { height: searchBarHeight } = await getRect('#searchBar')

    const isSearchBarFixed = this.isSearchBarFixed

    if (scrollTop >= searchBarHeight && !isSearchBarFixed) {
      this.isSearchBarFixed = true
    } else if (scrollTop <= 0 && isSearchBarFixed) {
      this.isSearchBarFixed = false
    }
  },
  onPullDownRefresh () {
    const renderAll = [
      this.renderCarousel(),
      this.renderCateItems(),
      this.renderRecommendItems()
    ]
    Promise.all(renderAll).then(() => uni.stopPullDownRefresh())
  }
}
</script>

<style lang="scss" scoped>
.index {
  padding-bottom: 113rpx;
}
.carousel {
  height: 340rpx;
  &__item image,
  &__item navigator {
    width: 100%;
    height: 100%;
  }
}
.cate-nav-list {
  display: flex;
  justify-content: space-around;
  padding-top: 12rpx;
  margin-bottom: 43rpx;
  &__item {
    width: 128rpx;
    height: 140rpx;
    & image,
    & navigator {
      width: 100%;
      height: 100%;
    }
  }
}
.recommend-list {
  image, navigator {
    width: 100%;
    height: 100%;
  }
  &__item {
    margin-bottom: 40rpx;
    .recommend-title {
      height: 60rpx;
      margin-bottom: 10rpx;
    }
    .recommend-pics {
      display: flex;
      padding: 0 12rpx;
      height: 386rpx;
      &__main {
        width: 232rpx;
        margin-right: 15rpx;
      }
      &-list {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        width: 480rpx;
        &__item {
          width: 233rpx;
          height: 188rpx;
          margin-bottom: 10rpx;
        }
      }
    }
  }
}
</style>
