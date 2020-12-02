<template>
  <view class="pay">
    <view class="delivery-address" @click="selectAddress">
      <view class="delivery-address__content" v-if="hasReceiverInfo">
        <view class="delivery-receiver-address">{{ receiverInfo.address }}</view>
        <view class="delivery-receiver-info">
          <view class="delivery-receiver-info__receiver-name">{{ receiverInfo.name }}</view>
          <view class="delivery-receiver-info__receiver-phone">{{ receiverInfo.phone }}</view>
        </view>
      </view>
      <view
        class="delivery-address__btn"
        v-else
      >选择地址</view>
    </view>
    <view class="checked-goods-list">
      <view class="checked-goods-list__title">已选商品</view>
      <GoodsItem
        v-for="checkedGoodsItem in checkedGoodsItems"
        :key="checkedGoodsItem.goods_id"
        :url="'/pages/goods_detail/index?goods_id=' + checkedGoodsItem.goods_id"
        :goodsImage="checkedGoodsItem.goodsImage"
        :goodsName="checkedGoodsItem.goods_name"
        :goodsPrice="checkedGoodsItem.goods_price"
        :goodsCount="checkedGoodsItem.goodsNum"
      />
    </view>
    <GoodsCalcBar
      :totalPrice="totalPrice"
      :checkedNum="checkedGoodsNum"
      :disabledSettleBtn="!(hasReceiverInfo && checkedGoodsNum > 0)"
    >
      <template>去支付</template>
    </GoodsCalcBar>
  </view>
</template>

<script>
import GoodsItem from '@/components/GoodsItem.vue'
import GoodsCalcBar from '@/components/GoodsCalcBar.vue'

export default {
  name: 'Pay',
  components: {
    GoodsItem,
    GoodsCalcBar
  },
  data () {
    return {
      checkedGoodsItems: [],
      receiverInfo: {}
    }
  },
  methods: {
    selectAddress () {
      uni.chooseAddress({
        success: res => {
          const {
            provinceName,
            cityName,
            countyName,
            detailInfo,
            userName,
            telNumber
          } = res

          const phoneReg = /(?:^(?:1\d{2})(\d{4})|^(?:0\d{2}-\d)(\d{4}))\d*/

          // r1 匹配到的手机号码，r2 匹配到的座机号码
          let [phone, r1, r2] = phoneReg.exec(telNumber)
          let r = r1 ? r1 : r2

          phone = phone.replace(r, '****')

          this.receiverInfo = {
            address: provinceName + cityName + countyName + detailInfo,
            name: userName,
            phone
          }

          let yougou = uni.getStorageSync('yougou')

          if (!yougou) {
            yougou = {}
          }

          yougou.receiverInfo = this.receiverInfo
          uni.setStorageSync('yougou', yougou)
        }
      })
    }
  },
  computed: {
    totalPrice () {
      return this.checkedGoodsItems.reduce((totalPrice, checkedGoodsItem) => {
        return totalPrice += checkedGoodsItem.goods_price * checkedGoodsItem.goodsNum
      }, 0)
    },
    checkedGoodsNum () {
      return this.checkedGoodsItems.length
    },
    hasReceiverInfo () {
      const keys = ['address', 'name', 'phone']

      return keys.every(key => this.receiverInfo[key] !== '' && this.receiverInfo[key])
    }
  },
  onShow () {
    const yougou = uni.getStorageSync('yougou')

    if (!yougou) {
      this.checkedGoodsItems = []
      this.receiverInfo = {}
      return
    }

    const goodsItems = yougou.cart
    const receiverInfo = yougou.receiverInfo

    this.checkedGoodsItems = goodsItems ? goodsItems.filter(goodsItem => goodsItem.checked) : []
    this.receiverInfo = receiverInfo ? receiverInfo : {}
  }
}
</script>

<style>
page {
  background-color: #f9f9f9;
}
</style>

<style lang="scss" scoped>
.pay {
  padding: 20rpx 20rpx 90rpx;
}
.delivery-address, .checked-goods-list {
  background-color: #fff;
}
.delivery-address {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 187rpx;
  margin-bottom: 35rpx;
  &__btn {
    $color: #ea4350;
    padding: 23rpx 88rpx;
    font-size: 30rpx;
    font-weight: 600;
    border: 2rpx solid $color;
    border-radius: 45rpx;
    color: $color;
  }
  &__content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: 16rpx 17rpx 34rpx 30rpx;
    flex: 1;
    color: #434343;
    .delivery-receiver {
      &-address {
        display: -webkit-box;
        margin-bottom: 18rpx;
        font-size: 30rpx;
        font-weight: 600;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      &-info {
        display: flex;
        font-size: 26rpx;
        &__receiver-name {
          margin-right: 40rpx;
        }
      }
    }
  }
}
.checked-goods-list {
  padding-right: 13rpx;
  &__title {
    padding: 17rpx 0 17rpx 26rpx;
    font-size: 26rpx;
    font-weight: 600;
    color: #434343;
  }
}
</style>
