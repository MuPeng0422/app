<template>
	<view class="content">
		<view class="study-list">
			<view class="study-list-item" v-for="(item, index) in courseList" :key="index">
				<view class="dataListItem u-flex u-row-between" v-if="item.coursePic !== ''">
					<view class="item-img">
						<u-image width="200rpx" height="150rpx" border-radius="5" :lazy-load="true" :src="item.coursePic"></u-image>
					</view>
					<view class="item-info">
						<view class="item-info-title">
							{{item.courseName}}
						</view>
						<view class="item-info-bottom">
							{{item.courseScore}}积分
						</view>
					</view>
					<view class="btn">
						<u-button type="primary" size="mini" @click="startStudy(item)">立即学习</u-button>
					</view>
				</view>
				<view class="dataListItem" v-else>
					<view class="item-text">
						<view class="item-text-top">
							{{item.courseName}}
						</view>
						<view class="item-text-bottom">
							<view class="number">
								{{item.courseScore}}积分
							</view>
							<view class="btn">
								<u-button type="primary" size="mini" @click="startStudy(item)">立即学习</u-button>
							</view>
						</view>
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
				courseList: []
			}
		},
		onLoad() {
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					this.res = res.data
					this.getStudyList()
				}
			})
		},
		methods: {
			getStudyList() {
				this.$http.post('/course/findTodayCourse', {
					'pageNum': 1,
					'pageSize': 10
				}, {
					header: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
						'Authentication': this.res.token,
					}
				}).then((res) => {
					if (res.data.data.records !== undefined) {
						for (var i = 0; i < res.data.data.records.length; i++) {
							if (res.data.data.records[i].courseScore === undefined) {
								res.data.data.records[i].courseScore = 0
							}
							this.courseList.push(res.data.data.records[i])
						}
					}
				}).catch((err) => {
					if (err.data.code === 401) {
						uni.reLaunch({
							url: '/pages/login/login'
						})
					}
				})
			},
			startStudy(item) {
				uni.navigateTo({
				    url: '/pages/enterprise/studyArticle/studyArticle?data=' + encodeURIComponent(JSON.stringify(item))
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		padding: 20rpx;
		
		.study-list{
			.study-list-item{
				margin-bottom: 20rpx;
				
				.dataListItem{
					height: 200rpx;
					display: flex;
					justify-content: space-between;
					background-color: #FFFFFF;
					padding: 10rpx;
					
					.item-img{
						width: 200rpx;
					}
					
					.item-info{
						flex: 1;
						padding-left: 10rpx;
					}
					
					.btn{
						width: 150rpx;
						text-align: right;
					}
				}
			}
		}
	}
</style>
