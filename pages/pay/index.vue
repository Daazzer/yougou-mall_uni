<template>
  <view class="pay">
    <view class="delivery-address" @click="chooseAddress">
      <view class="delivery-address__content" v-if="hasConsignee">
        <view class="delivery-receiver-address">{{ consignee.address }}</view>
        <view class="delivery-receiver-info">
          <view class="delivery-receiver-info__receiver-name">{{ consignee.name }}</view>
          <view class="delivery-receiver-info__receiver-phone">{{ consignee.phone | maskPhoneNum }}</view>
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
        :goodsCount="checkedGoodsItem.goods_number"
      />
    </view>
    <GoodsCalcBar
      :totalPrice="totalPrice"
      :checkedNum="checkedGoodsNum"
      :disabledSettleBtn="!(hasConsignee && checkedGoodsNum > 0) || isPaying"
      @settle="pay"
    >
      <template>去支付</template>
    </GoodsCalcBar>
  </view>
</template>

<script>
import GoodsItem from '@/components/GoodsItem.vue'
import GoodsCalcBar from '@/components/GoodsCalcBar.vue'
import { checkLogin } from '@/utils'

export default {
  name: 'Pay',
  components: {
    GoodsItem,
    GoodsCalcBar
  },
  data () {
    return {
      checkedGoodsItems: [],
      consignee: {},
      isPaying: false
    }
  },
  computed: {
    totalPrice () {
      return this.checkedGoodsItems.reduce((totalPrice, checkedGoodsItem) => {
        return totalPrice += checkedGoodsItem.goods_price * checkedGoodsItem.goods_number
      }, 0)
    },
    checkedGoodsNum () {
      return this.checkedGoodsItems.length
    },
    hasConsignee () {
      const keys = ['address', 'name', 'phone']

      return keys.every(key => this.consignee[key] !== '' && this.consignee[key])
    }
  },
  filters: {
    maskPhoneNum (phoneNum) {
      const phoneReg = /(?:^(?:1\d{2})(\d{4})|^(?:0\d{2}-\d)(\d{4}))\d*/

      // r1 匹配到的手机号码片段，r2 匹配到的座机号码片段
      const [phone, r1, r2] = phoneReg.exec(phoneNum)
      const r = r1 ? r1 : r2

      return phone.replace(r, '****')
    }
  },
  methods: {
    chooseAddress () {
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

          this.consignee = {
            address: provinceName + cityName + countyName + detailInfo,
            name: userName,
            phone: telNumber
          }

          this.$yougou.setData('consignee', { ...this.consignee })
        }
      })
    },
    async pay () {
      if (!checkLogin()) {
        uni.showModal({
          title: '提示',
          content: '需要登录后才能支付，是否登录？',
          success (res) {
            if (res.confirm) {
              uni.navigateTo({ url: '/pages/login/index' })
            }
          }
        })
        return
      }

      this.isPaying = true

      const [orderErr, order_number] = await this.getOrderNumber()

      if (orderErr) {
        this.isPaying = false
        this.$showErrorTips(orderErr, '创建订单失败')
        return
      }

      const [payParamsErr, payParams] = await this.getPayParams(order_number)

      if (payParamsErr) {
        this.isPaying = false
        this.$showErrorTips(payParamsErr, '获取支付参数失败')
        return
      }

      uni.requestPayment({
        ...payParams,
        complete: async () => {
          const [err, res] = await this.$api.checkOrder({ order_number })

          if (err) {
            err.msg ? this.$showErrorTips({}, err.msg) : this.$showErrorTips(err, '支付失败')
            err.msg ? setTimeout(() => {
              uni.navigateTo({ url: '/pages/order/index?type=2' })
              this.isPaying = false
            }, 1600) : this.isPaying = false
          } else {
            uni.showToast({ title: res.data.message })
            setTimeout(() => {
              uni.redirectTo({ url: '/pages/order/index?type=3' })
              this.isPaying = false
              this.clearCheckedGoods()
            }, 1600)
          }
        }
      })
    },
    async getOrderNumber () {
      const data = {
        order_price: this.totalPrice,
        consignee_addr: this.consignee.address,
        goods: this.checkedGoodsItems.map(v => ({
          goods_id: v.goods_id,
          goods_number: v.goods_number,
          goods_price: v.goods_price
        }))
      }

      const [err, res] = await this.$api.createOrder(data)

      if (err) {
        return [err]
      }

      return [null, res.data.message.order_number]
    },
    async getPayParams (order_number) {
      const [err, res] = await this.$api.getPayParams({ order_number })

      if (err) {
        return [err]
      }

      return [null, res.data.message.pay]
    },
    clearCheckedGoods () {
      let cart = this.$yougou.getData('cart')

      const unCheckedGoodsItems = cart.filter(goodsItem => !goodsItem.checked)

      cart = unCheckedGoodsItems

      this.$yougou.setData('cart', cart)
    }
  },
  async onShow () {
    const cart = this.$yougou.getData('cart')
    const consignee = this.$yougou.getData('consignee')

    this.consignee = consignee ? consignee : {}
    this.checkedGoodsItems = cart ? cart.filter(goodsItem => goodsItem.checked) : []
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
