<template>
	<view class="content">
		<u-parse :html="content"></u-parse>
		<view class="goback">
			<u-button type="primary" size="medium" :custom-style="customStyle" @click="goBack">完成学习</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				customStyle: {
					margin: 'auto'
				},
				content: `
					<p>露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明露从今夜白，月是故乡明</p>
					<img src="https://cdn.uviewui.com/uview/swiper/2.jpg" />
				`
			}
		},
		methods: {
			goBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		padding: 100rpx 20rpx 0;
		
		.goback{
			width: 100%;
			padding: 100rpx 0;
			text-align: center;
		}
	}
</style>