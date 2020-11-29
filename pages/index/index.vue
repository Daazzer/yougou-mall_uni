<template>
	<view class="index">
    <SearchBar />
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
      title: 'Hello'
    }
  },
  onLoad() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>
