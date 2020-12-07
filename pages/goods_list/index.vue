<template>
  <view
    :class="{
      'goods-list-container': true,
      'pt-100_88': isSearchBarFixed
    }"
  >
    <SearchBar id="searchBar" :isFixed="isSearchBarFixed" />
    <view id="sort" :class="{ sort: true, fixed: isSearchBarFixed }">
      <view
        :class="{
          sort__item: true,
          active: sortSelected === index
        }"
        v-for="(sortItem, index) in sortItems"
        :key="sortItem.title"
        @click="handleSort(index)"
      >{{ sortItem.title }}</view>
    </view>
    <view class="goods-list" v-if="goodsItems.length > 0">
      <GoodsItem
        v-for="goodsItem in goodsItems"
        :key="goodsItem.goods_id"
        :url="'/pages/goods_detail/index?goods_id=' + goodsItem.goods_id"
        :goodsImage="goodsItem.goods_small_logo"
        :goodsName="goodsItem.goods_name"
        :goodsPrice="goodsItem.goods_price"
      />
    </view>
    <view class="goods-list--none" v-else>暂无商品</view>
    <view
      class="goods-list--last-page"
      v-if="goodsItems.length > 0 && isLastPage"
    >到底啦...</view>
    <tab-bar ref="tabBar" />
  </view>
</template>

<script>
import SearchBar from '@/components/SearchBar.vue'
import GoodsItem from '@/components/GoodsItem.vue'
import { getRect } from '@/utils'

export default {
  name: 'GoodsList',
  components: {
    SearchBar,
    GoodsItem
  },
  data () {
    return {
      isSearchBarFixed: false,
      isLoadingGoodsItems: false,
      isLastPage: false,
      searchBarHeight: 0,
      params: {
        pagenum: 1,
        pagesize: 15
      },
      sortSelected: 0,
      sortItems: [
        { title: '综合' },
        { title: '销量' },
        { title: '价格' }
      ],
      goodsItems: []
    }
  },
  methods: {
    async renderGoodsItems (params) {
      this.isLoadingGoodsItems = true
      const [err, res] = await this.$api.getGoodsList(params)

      if (err) {
        this.$showErrorTips(err, '获取商品列表数据失败')
        this.isLoadingGoodsItems = false
        return
      }

      let goodsItems = []

      if (res.data.message) {
        goodsItems = res.data.message.goods
      }

      if (goodsItems.length < this.params.pagesize) {
        this.isLastPage = true
      }

      if (this.params.pagenum === 1) {
        this.goodsItems = goodsItems
      } else {
        this.goodsItems.push(...goodsItems)
      }

      this.isLoadingGoodsItems = false
    },
    handleSort (index) {
      this.sortSelected = index
    },
  },
  onLoad (params) {
    this.params = {
      ...this.params,
      ...params
    }
    this.renderGoodsItems(this.params)
  },
  async onShow () {
    const { height: searchBarHeight } = await getRect('#searchBar')
    this.searchBarHeight = searchBarHeight
    const tabBar = this.$refs.tabBar
    tabBar.setData({ currentIndex: 1 })
  },
  onPullDownRefresh () {
    this.isLastPage = false
    this.params.pagenum = 1
    Promise.all([
      this.renderGoodsItems(this.params)
    ]).then(() => uni.stopPullDownRefresh())
  },
  async onPageScroll ({ scrollTop }) {
    const searchBarHeight = this.searchBarHeight
    const isSearchBarFixed = this.isSearchBarFixed

    if (scrollTop >= searchBarHeight && !isSearchBarFixed) {
      this.isSearchBarFixed = true
    } else if (scrollTop <= 0 && isSearchBarFixed) {
      this.isSearchBarFixed = false
    }
  },
  onReachBottom () {
    if (!this.isLastPage && !this.isLoadingGoodsItems) {
      this.params.pagenum++
      this.renderGoodsItems(this.params)
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-list-container {
  padding-bottom: 120rpx;
  padding-bottom: calc(120rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
  &.pt-100_88 {
    padding-top: 188rpx;
  }
}
.sort {
  display: flex;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 48rpx;
  background-color: #fff;
  top: 0;
  &__item {
    width: 184rpx;
    text-align: center;
    line-height: 88rpx;
    font-size: 30rpx;
    color: #676767;
    &.active {
      border-bottom: 3px solid #ea4350;
      font-weight: bold;
      color: #3d3d3d;
    }
  }
  &.fixed {
    position: fixed;
    top: 100rpx;
    left: 0;
    right: 0;
    transition: top .3s .5s;
    z-index: 10;
  }
}
.goods-list {
  padding: 0 26rpx;
  &--none {
    margin-top: 100rpx;
    text-align: center;
    font-size: 38rpx;
    color: #676767;
  }
  &--last-page {
    @extend .goods-list--none;
    margin-top: 40rpx;
    padding-bottom: 30rpx;
  }
}
</style>
