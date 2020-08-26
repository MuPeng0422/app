<template>
	<view class="content">
		<view class="count-down" v-show="timeShow">
			<u-count-down ref="uCountDown" :show-days="false" :timestamp="timestamp" @end="countDownEnd"></u-count-down>
		</view>
		
		<view class="title">
			{{ title }}
		</view>
		
		<u-parse :html="content"></u-parse>
		<view class="goback" v-show="btnShow">
			<u-button type="success" :disabled="disabled" size="medium" :custom-style="customStyle" @click="goBack">完成学习</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				btnShow: true,
				timeShow: true,
				itemData: {},
				customStyle: {
					margin: 'auto'
				},
				disabled: true,
				title: '',
				content: '',
				second: 60,
				timestamp: 0
			}
		},
		onLoad(data) {
			const item = JSON.parse(decodeURIComponent(data.data));
			this.itemData = item
			this.title = this.itemData.courseName
			this.content = this.itemData.courseContent
			this.timestamp = 10
			
			const row = {
				'courseId': String(this.itemData.id),
				'userId': String(this.itemData.userId),
				'score': this.itemData.courseScore
			}
			
			this.$http.post('/course/studyTodayCourse', row, {
				header: {
					'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
					'Authentication': this.itemData.token
				}
			}).then((res) => {
				if (res.data.data === 1) {
					this.btnShow = false
					this.timeShow = false
				}
			})
		},
		methods: {
			goBack() {
				const data = {
					'courseId': String(this.itemData.id),
					'userId': String(this.itemData.userId),
					'score': this.itemData.courseScore
				}
				
				this.$http.post('/course/studyTodayCourse', data, {
					header: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
						'Authentication': this.itemData.token
					}
				}).then((res) => {
					uni.navigateBack()
				})
			},
			countDownEnd() {
				this.disabled = false
			}
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
		
		.count-down{
			text-align: right;
		}
		
		.goback{
			width: 100%;
			padding: 100rpx 0;
			text-align: center;
		}
	}
</style>