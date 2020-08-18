<template>
	<view class="content">
		<view class="content-main">
			<view class="study-total">
				<view class="name">
					已获得积分
				</view>
				<view class="num">
					{{ totalScore }}
				</view>
			</view>
			<view class="study-list" v-for="(item, index) in studyList" :key="index">
				<view class="text">
					<view class="name">
						{{ item.name }}
					</view>
					<view class="num">
						已获得 {{ item.num }} 积分
					</view>
				</view>
				<view class="progress">
					<view class="line-progress">
						<u-line-progress active-color="#1890FF" :percent="item.percent" height="20"></u-line-progress>
					</view>
					<view class="stutas" v-if="item.stutas === true">
						<u-icon name="checkmark-circle-fill" color="#009688" size="40"></u-icon>
					</view>
					<view class="stutas" v-else>
						{{ item.progress }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				totalScore: 10,
				studyList: [
					{
						name: '每日登录',
						num: 10,
						percent: '70',
						stutas: true,
						progress: '1/3'
					},
					{
						name: '完成工作交接',
						num: 10,
						percent: '70',
						stutas: false,
						progress: '1/3'
					}
				]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		height: 100%;
		padding-top: 10rpx;
		
		.content-main{
			height: 100%;
			padding: 50rpx 30rpx;
			background-color: #FFFFFF;
			
			.study-total{
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 50rpx;
				
				.num,
				.name{
					font-weight: bold;
					color: #FF514F;
				}
			}
			
			.study-list{
				margin-bottom: 30rpx;
				
				.text{
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 10rpx;
				}
				
				.progress{
					display: flex;
					align-items: center;
					justify-content: space-between;
					
					.line-progress{
						width: calc(100% - 50rpx);
					}
					
					.stutas{
						width: 50rpx;
						text-align: right;
					}
				}
			}
		}
	}
</style>
