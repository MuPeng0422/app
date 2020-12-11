<template>
	<view class="content">
		<view class="title">
			{{ title }}
		</view>
		
		<u-parse :html="content"></u-parse>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '',
				content: ''
			}
		},
		onLoad(data) {
			const item = JSON.parse(decodeURIComponent(data.data));
			this.itemData = item
			this.title = this.itemData.courseName
			this.content = this.itemData.courseContent
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		padding: 20rpx;
		
		.title{
			font-size: 48rpx;
			line-height: 100rpx;
			font-weight: bold;
			text-align: center;
		}
	}
</style>