<template>
  <view class="search">
    <view class="search-bar">
      <view class="search-bar__input-group">
        <text class="iconfont icon-sousuo" />
        <input type="text" v-model="searchText" placeholder="输入商品名" />
      </view>
      <button
        class="search-bar__btn"
        :loading="isSearching"
        @click="searchGoods"
      >{{ isSearching ? '' : '搜索' }}</button>
    </view>
    <view class="search-result-list" v-if="searchResultItems.length > 0">
      <GoodsItem
        v-for="searchResultItem in searchResultItems"
        :key="searchResultItem.goods_id"
        :url="'/pages/goods_detail/index?goods_id=' + searchResultItem.goods_id"
        :goodsImage="searchResultItem.goods_image"
        :goodsName="searchResultItem.goods_name"
      />
    </view>
    <view class="search-result-list--none" v-else>{{ resultNoneText }}</view>
  </view>
</template>

<script>
import GoodsItem from '@/components/GoodsItem.vue'
export default {
  name: 'Search',
  components: {
    GoodsItem
  },
  data () {
    return {
      isSearched: false,
      isSearching: false,
      searchText: '',
      searchResultItems: []
    }
  },
  methods: {
    async renderSearchResultItems () {
      const query = this.searchText

      const [err, res] = await this.$api.getGoodsSearch({ query })

      this.isSearching = false

      if (!this.isSearched) {
        this.isSearched = true
      }

      if (err) {
        this.$showErrorTips(err, '搜索失败')
        return
      }

      let searchResultItems = []

      if (res.data.message) {
        searchResultItems = res.data.message
      }

      this.searchResultItems = searchResultItems
    },
    searchGoods () {
      if (this.isSearching) {
        return
      }

      this.isSearching = true

      this.renderSearchResultItems()
    }
  },
  computed: {
    resultNoneText () {
      if (this.isSearched && this.searchResultItems.length === 0) {
        return '暂无搜索结果'
      } else {
        return '搜索你想买的商品'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  padding-top: 90rpx;
}
.search-bar {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  display: flex;
  height: 90rpx;
  padding: 15rpx 18rpx;
  background-color: #fff;
  z-index: 100;
  &__input-group {
    position: relative;
    margin-right: 15rpx;
    flex: 1;
    .iconfont {
      position: absolute;
      top: 50%;
      left: 15rpx;
      transform: translateY(-50%);
      font-size: 29rpx;
    }
    input {
      height: 100%;
      padding-left: 57rpx;
      font-size: 25rpx;
      border-radius: 27rpx;
      background-color: #e7e7e7;
    }
  }
  &__btn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    width: 110rpx;
    height: 61rpx;
    border-radius: 8rpx;
    font-size: 25rpx;
    color: #fff;
    background-color: #ea4350;
  }
}
.search-result-list {
  padding: 0 25rpx;
  &--none {
    padding-top: 150rpx;
    text-align: center;
    font-size: 38rpx;
    color: #434343;
  }
}
</style>
