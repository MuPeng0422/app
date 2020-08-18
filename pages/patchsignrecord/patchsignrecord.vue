<template>
	<view class="content">
		<view class="lists-item" v-for="(item, index) in lists" :key="index" @click="getItem(item)">
			<view class="item time">
				{{ item.time }}
			</view>
			<view class="item reason">
				{{ item.reason }}
			</view>
			<view class="item stutas">
				{{ item.stutas }}
			</view>
		</view>
		
		<u-popup v-model="show" width="80%" height="80%" mode="center" :safe-area-inset-bottom="true" border-radius="14" :closeable="true">
			<view class="popup-container">
				<view class="col">
					<view class="label">
						补卡时间：
					</view>
					<view class="input">
						{{ time }}
					</view>
				</view>
				<view class="col">
					<view class="label">
						补卡理由：
					</view>
					<view class="input">
						<u-input v-model="reason" type="textarea" height="100" :auto-height="true" :border="true"/>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				lists: [
					{
						time: '2020年7月12日',
						reason: '迟到补卡',
						stutas: '已通过'
					},
					{
						time: '2020年7月13日',
						reason: '缺勤补卡',
						stutas: '未通过'
					}
				],
				time: '',
				reason: ''
			}
		},
		methods: {
			getItem(obj) {
				console.log(obj)
				this.show = true
				this.time = obj.time
				this.reason = obj.reason
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		height: 100%;
		background-color: #FFFFFF;
		
		.lists-item{
			padding: 50rpx 0;
			display: flex;
			align-items: center;
			justify-content: space-around;
			border-bottom: 1rpx solid #c8c7cc;
			
			.item{
				padding-left: 50rpx;
			}
			
			.time{
				width: 40%;
			}
			
			.reason{
				width: 30%;
			}
			
			.stutas{
				width: 30%;
			}
		}
		
		.popup-container{
			padding: 20rpx;
			
			.col{
				.label{
					margin: 20rpx 0;
					font-weight: bold;
				}
			}
		}
	}
</style>
