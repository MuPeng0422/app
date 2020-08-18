<template>
	<view class="content">
		<view class="item" style="align-items: center;">
			<view class="label">
				补卡时间：
			</view>
			<view class="input">
				<u-input v-model="time" type="text" :border="true" @click="selectTime"/>
			</view>
		</view>
		<view class="item">
			<view class="label">
				补卡理由：
			</view>
			<view class="input">
				<u-input v-model="reason" type="textarea" height="100" :auto-height="true" :border="true"/>
			</view>
		</view>
		
		<view class="submitBtn">
			<u-button type="primary" @click="handliClickSubmit">提交申请</u-button>
		</view>
		<u-picker mode="time" v-model="show" :params="params" @confirm="getTime"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false
				},
				time: '',
				reason: ''
			}
		},
		methods: {
			selectTime() {
				this.show = true
			},
			getTime(obj) {
				this.time = obj.year + '-' + obj.month + '-' + obj.day + ' ' + obj.hour + ':' + obj.minute + ':' + obj.second
			},
			handliClickSubmit() {
				console.log(this.time)
				console.log(this.reason)
				uni.showToast({
					title: '申请成功',
					icon: 'success',
					duration: 1000
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		margin-top: 10rpx;
		height: 100%;
		padding: 20rpx;
		background-color: #fff;
		
		.item{
			display: flex;
			margin-bottom: 20rpx;
			
			.label{
				width: 150rpx;
			}
			
			.input{
				flex: 1;
			}
		}
		
		.submitBtn{
			width: 300rpx;
			margin: 200rpx auto 0;
		}
		
	}
</style>
