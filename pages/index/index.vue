<template>
	<view class="index">
    <SearchBar />
    <swiper
      class="carousel"
      circular
      indicator-dots
      autoplay
      indicator-active-color="#ea4350"
    >
      <block v-if="carouselItems">
        <swiper-item 
          class="carousel__item"
          v-for="carouselItem in carouselItems"
          :key="carouselItem.goods_id"
        >
          <navigator :url="'/pages/goods_detail/goods_detail?goods_id=' + carouselItem.goods_id">
            <image class="swiper-image" :src="carouselItem.image_src" />
          </navigator>
        </swiper-item>
      </block>
    </swiper>
	</view>
</template>

<script>
import SearchBar from '@/components/SearchBar.vue'
export default {
  components: {
    SearchBar
  },
  data () {
    return {
      carouselItems: []
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
  },
  onLoad() {
    this.renderCarousel()
  },
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
</style>
