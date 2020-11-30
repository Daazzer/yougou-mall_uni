<template>
  <view :class="{ 'goods-list-container': true, 'pt-100': isSearchBarFixed }">
    <SearchBar id="searchBar" :isFixed="isSearchBarFixed" />
    <view class="sort">
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
        :goodsImage="goodsItem.goods_small_logo"
        :goodsName="goodsItem.goods_name"
        :goodsPrice="goodsItem.goods_price"
      />
    </view>
    <view class="goods-list--none" v-else>暂无商品</view>
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
      params: {},
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
      const [err, res] = await this.$api.getGoodsList(params)
  
      if (err) {
        this.$showErrorTips(err, '获取商品列表数据失败')
        return
      }
  
      let goodsItems = []
  
      if (res.data.message) {
        goodsItems = res.data.message.goods
      }

      this.goodsItems = goodsItems
    },
    handleSort (index) {
      this.sortSelected = index
    },
  },
  onLoad (params) {
    this.params = params
    this.renderGoodsItems(params)
  },
  onShow () {
    const tabBar = this.$refs.tabBar
    tabBar.setData({ currentIndex: 1 })
  },
  onPullDownRefresh () {
    Promise.all([
      this.renderGoodsItems(this.params)
    ]).then(() => uni.stopPullDownRefresh())
  },
  async onPageScroll ({ scrollTop }) {
    const { height: searchBarHeight } = await getRect('#searchBar')
    const isSearchBarFixed = this.isSearchBarFixed

    if (scrollTop >= searchBarHeight && !isSearchBarFixed) {
      this.isSearchBarFixed = true
    } else if (scrollTop <= 0 && isSearchBarFixed) {
      this.isSearchBarFixed = false
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-list-container {
  padding-bottom: 113rpx;
}
.sort {
  display: flex;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 48rpx;
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
}
.goods-list {
  padding: 0 26rpx;
  &--none {
    margin-top: 100rpx;
    text-align: center;
    font-size: 38rpx;
    color: #676767;
  }
}
</style>
