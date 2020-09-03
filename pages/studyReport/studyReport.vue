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
			<view class="study-list">
				<view class="text">
					<view class="name">
						每日登录
					</view>
					<view class="num">
						已获得 {{ studyData.loginSocer }} 积分
					</view>
				</view>
				<view class="progress">
					<view class="line-progress">
						<u-line-progress active-color="#1890FF" :percent="100" height="20"></u-line-progress>
					</view>
					<view class="stutas">
						<u-icon name="checkmark-circle-fill" color="#009688" size="40"></u-icon>
					</view>
				</view>
			</view>
			<view class="study-list">
				<view class="text">
					<view class="name">
						完成工作交接
					</view>
					<view class="num">
						已获得 {{ studyData.handoverSocer }} 积分
					</view>
				</view>
				<view class="progress" v-if="studyData.handoverSocer > 0">
					<view class="line-progress">
						<u-line-progress active-color="#1890FF" :percent="100" height="20"></u-line-progress>
					</view>
					<view class="stutas">
						<u-icon name="checkmark-circle-fill" color="#009688" size="40"></u-icon>
					</view>
				</view>
				<view class="progress" v-else>
					<view class="line-progress">
						<u-line-progress active-color="#1890FF" :percent="0" height="20"></u-line-progress>
					</view>
					<view class="stutas">
						0%
					</view>
				</view>
			</view>
			<view class="study-list">
				<view class="text">
					<view class="name">
						每日答题{{ studyData.thatDayQuestion }}道
					</view>
					<view class="num">
						已获得 {{ studyData.dayQuestionSocer }} 积分
					</view>
				</view>
				<view class="progress" v-if="studyData.dayQuestionSocer > 0">
					<view class="line-progress">
						<u-line-progress active-color="#1890FF" :percent="100" height="20"></u-line-progress>
					</view>
					<view class="stutas">
						<u-icon name="checkmark-circle-fill" color="#009688" size="40"></u-icon>
					</view>
				</view>
				<view class="progress" v-else>
					<view class="line-progress">
						<u-line-progress active-color="#1890FF" :percent="0" height="20"></u-line-progress>
					</view>
					<view class="stutas">
						0%
					</view>
				</view>
			</view>
			<view class="study-list">
				<view class="text">
					<view class="name">
						每周答题{{ studyData.thatWeekQuestion }}道
					</view>
					<view class="num">
						已获得 {{ studyData.weekQuestionSocer }} 积分
					</view>
				</view>
				<view class="progress" v-if="studyData.weekQuestionSocer > 0">
					<view class="line-progress">
						<u-line-progress active-color="#1890FF" :percent="100" height="20"></u-line-progress>
					</view>
					<view class="stutas">
						<u-icon name="checkmark-circle-fill" color="#009688" size="40"></u-icon>
					</view>
				</view>
				<view class="progress" v-else>
					<view class="line-progress">
						<u-line-progress active-color="#1890FF" :percent="0" height="20"></u-line-progress>
					</view>
					<view class="stutas">
						0%
					</view>
				</view>
			</view>
			<view class="study-list">
				<view class="text">
					<view class="name">
						每日学习10分钟
					</view>
					<view class="num">
						已获得 {{ studyData.courseSocer }} 积分
					</view>
				</view>
				<view class="progress" v-if="studyData.courseSocer > 0">
					<view class="line-progress">
						<u-line-progress active-color="#1890FF" :percent="100" height="20"></u-line-progress>
					</view>
					<view class="stutas">
						<u-icon name="checkmark-circle-fill" color="#009688" size="40"></u-icon>
					</view>
				</view>
				<view class="progress" v-else>
					<view class="line-progress">
						<u-line-progress active-color="#1890FF" :percent="0" height="20"></u-line-progress>
					</view>
					<view class="stutas">
						0%
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
				res: {},
				totalScore: null,
				studyData: {}
			}
		},
		onLoad() {
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					console.log(res)
					this.res = res.data
					this.getReport()
				}
			})
			console.log('onload')
			
		},
		methods: {
			getReport() {
				this.$http.get('/report', {
					params: {
						'userId': this.res.userInfo.userId
					},
					header: {
						'Authentication': this.res.token
					}
				}).then((res) => {
					console.log(res)
					this.studyData = res.data.data
					this.totalScore = this.studyData.loginSocer + this.studyData.courseSocer + this.studyData.weekQuestionSocer + this.studyData.dayQuestionSocer + this.studyData.handoverSocer
				})
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
				margin-bottom: 50rpx;
				
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
						width: calc(100% - 100rpx);
					}
					
					.stutas{
						width: 100rpx;
						text-align: right;
					}
				}
			}
		}
	}
</style>
