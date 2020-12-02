<script>
export default {
  onLaunch: function() {},
  onShow: function() {},
  onHide: function() {}
}
</script>

<style lang="scss">
@import "@/static/fonts/iconfont.css";

.pt-100 {
  padding-top: 100rpx;
}

view,
button,
scroll-view,
navigator,
input,
swiper,
image {
  box-sizing: border-box;
}
button {
  &, &[size="mini"] {
    line-height: normal;
  }
}
</style>
