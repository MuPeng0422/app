<template>
	<view class="container">
		<view class="head" :style="{background: 'url('+ imageURL +')', backgroundSize: backgroundSize}">
			<view class="avatar u-flex">
				<view class="avatar-img">
					<u-avatar class="img" :src="userInfo.src"></u-avatar>
				</view>
				<view class="avatar-text">
					<view class="company">
						{{ userInfo.unitName }}
					</view>
					<view class="name">
						<text>{{userInfo.username}}</text>
						<u-icon :name="name" size="40" color="#19be6b"></u-icon>
					</view>
				</view>
				<view class="avatar-integral">
					{{ integral }}积分
				</view>
			</view>
			<view class="head-btns">
				<view class="bottons">
					<u-row gutter="16" justify="space-between">
						<u-col span="3">
							<u-button type="primary" @click="handleClickBtn('goToWork')">上班打卡</u-button>
						</u-col>
						<u-col span="3">
							<u-button type="primary" @click="handleClickBtn('goOutWork')">下班打卡</u-button>
						</u-col>
						<u-col span="3">
							<u-button type="primary" @click="handleClickBtn('signRecord')">考勤记录</u-button>
						</u-col>
						<u-col span="3">
							<u-button type="primary" @click="handleClickBtn('leave')">请假审批</u-button>
						</u-col>
					</u-row>
				</view>
			</view>
		</view>
		
		<view class="main">
			<view class="swiper-tab">
				<view>
					<u-tabs-swiper ref="uTabs" :list="list" :bold="false" :bar-width="width" :current="current" @change="tabsChange" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
				</view>
				<swiper class="swiper" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
					<swiper-item class="swiper-item">
						<scroll-view scroll-y class="swiper-item-scroll" @scrolltolower="reachBottom">
							<view class="isLogin" v-if="isSignIn">
								<view v-for="(item,index) in courseList" class="dataList" :key="index">
									<view class="dataListItem u-flex u-row-between" v-if="item.coursePic !== ''">
										<view class="item-img">
											<u-image width="100%" height="100%" :src="item.coursePic" :lazy-load="true">
												<u-loading slot="loading"></u-loading>
											</u-image>
										</view>
										<view class="item-info">
											<view class="item-info-title">
												{{item.courseName}}
											</view>
											<view class="item-info-bottom">
												<view class="number">
													{{item.courseScore}}积分
												</view>
												<view class="btn">
													<u-button type="primary" size="mini" @click="startStudy(item)">立即学习</u-button>
												</view>
											</view>
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
													<u-button type="primary" size="mini" @click="startStudy">立即学习</u-button>
												</view>
											</view>
										</view>
									</view>
								</view>
								<u-empty text="数据为空" mode="data" v-if="courseList.length === 0"></u-empty>
								<u-loadmore :status="loadStatus[0]" bgColor="#f2f2f2" v-if="courseList.length >= 3"></u-loadmore>
							</view>
							<view class="noLogin" v-else>
								<view class="patchsign">
									<text>需要打卡后才可以学习哦~</text>
								</view>
								<view class="scheduling">
									<view class="scheduling-title">
										我的排班
									</view>
									<view class="scheduling-list">
										<view class="scheduling-list-item" v-for="(item, index) in schedulingList" :key="index">
											<view class="scheduling-list-item-avatar">
												<u-avatar :src="userInfo.src"></u-avatar>
											</view>
											<view class="scheduling-list-item-info">
												<view class="list-item-info-top">
													<text>{{ userInfo.username }}</text>
													<text>{{ item.schedulingName }}</text>
												</view>
												<view class="list-item-info-bottom">
													<view class="ClockIn">
														上班时间：{{ item.starClockIn }}
													</view>
													<view class="ClockIn">
														下班时间：{{ item.stopClockIn }}
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</swiper-item>
					
					<swiper-item class="swiper-item">
						<scroll-view scroll-y class="swiper-item-scroll" @scrolltolower="reachBottom">
							<view class="isLogin">
								<view v-for="(item,index) in dataList[1]" class="dataList" :key="index">
									<view class="dataListItem u-flex u-row-between">
										<view class="item-img">
											<u-image width="100%" height="100%" :src="item.src" :lazy-load="true">
												<u-loading slot="loading"></u-loading>
											</u-image>
										</view>
										<view class="item-info">
											<view class="item-info-title">
												{{item.courseName}}
											</view>
											<view class="item-info-bottom">
												<view class="number">
													{{item.number}}积分
												</view>
												<view class="btn">
													<u-button type="primary" size="mini" @click="startExam">立即答题</u-button>
												</view>
											</view>
										</view>
									</view>
								</view>
								<u-loadmore :status="loadStatus[0]" bgColor="#f2f2f2"></u-loadmore>
							</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<u-toast :type="warning" :position="top" :icon="true" ref="uToast"></u-toast>
		<u-popup v-model="modelshow" width="80%" height="80%" mode="center" :safe-area-inset-bottom="true" border-radius="14">
			<view class="popup">
				<view class="title">
					{{xbtitle}}
				</view>
				<view class="taskList">
					<view class="item">
						<view class="serial">
							<view class="number">
								1
							</view>
						</view>
						<view class="text-info">
							<view class="text">
								学习时长<span>{{timelong}}</span>分钟。
							</view>
							<view class="link-box">
								<u-icon name="close-circle-fill" size="40" color="#FF9502"></u-icon>
								<view class="link">
									立即前往
								</view>
							</view>
						</view>
					</view>
					<view class="item">
						<view class="serial">
							<view class="number">
								2
							</view>
						</view>
						<view class="text-info">
							<view class="text">
								参加考试<span>{{timelong}}</span>场。
							</view>
							<view class="link-box">
								<u-icon name="close-circle-fill" size="40" color="#FF9502"></u-icon>
								<view class="link">
									立即前往
								</view>
							</view>
						</view>
					</view>
					<view class="item">
						<view class="serial">
							<view class="number">
								3
							</view>
						</view>
						<view class="text-info">
							<view class="text">
								答题数<span>{{timelong}}</span>道。
							</view>
							<view class="link-box">
								<u-icon name="close-circle-fill" size="40" color="#27B148"></u-icon>
							</view>
						</view>
					</view>
					<view class="item">
						<view class="serial">
							<view class="number">
								4
							</view>
						</view>
						<view class="text-info">
							<view class="text">
								消防控制室设施、设备进行清洁维护保养。
							</view>
							<view class="link-box">
								<u-icon name="close-circle-fill" size="40" color="#27B148"></u-icon>
							</view>
						</view>
					</view>
					<view class="item">
						<view class="serial">
							<view class="number">
								5
							</view>
						</view>
						<view class="text-info">
							<view class="text">
								消防控制室环境卫生进行清洁。
							</view>
							<view class="link-box">
								<u-icon name="close-circle-fill" size="40" color="#27B148"></u-icon>
							</view>
						</view>
					</view>
				</view>
				<view class="submitBtn">
					<u-button type="primary" @click="next">确认</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'; 
	export default {
		data() {
			return {
				res: null,
				isSignIn: false,
				text: '无头像',
				imageURL: 'https://cdn.uviewui.com/uview/example/fade.jpg',
				backgroundSize: '100% 100%',
				name: 'checkmark-circle',
				userInfo: {},
				integral: 0,
				current: 0,
				swiperCurrent: 0,
				width: '200',
				list: [
					{
						name: '学习'
					},
					{
						name: '答题'
					}
				],
				courseList: [],
				dataList: [[], []],
				data: [],
				loadStatus: ['loadmore', 'loading', 'nomore'],
				pageNo: 1,
				pageSize: 10,
				modelshow: false,
				xbtitle: '您今日还有未完成任务，完成后才能打卡哦~',
				timelong: '9/15',
				schedulingList: []
			}
		},
		onReady() {
			this.getUserInfo()
			this.getIntegral()
			this.getStudyData()
			this.getScheduling()
		},
		methods: {
			...mapMutations(['login']),
			setData(res) {
				this.res = res
			},
			setSignStatus(status) {
				console.log(status)
				this.isSignIn = status
			},
			getIntegral() {
				this.$http.get('/findUserIntegral', {
					params: {
						'userId': this.res.data.user.userId,
					},
					header: {
						'Authentication': this.res.data.token,
					}
				}).then((res) => {
					this.integral = res.data.data
				})
			},
			getUserInfo() {
				this.userInfo = this.res.data.user
				this.userInfo.src = '/static/default_avatar.jpg'
			},
			getScheduling() {
				this.$http.post('/scheduling/findUserScheduling', {
					'userId': this.res.data.user.userId
				}, {
					header: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
						'Authentication': this.res.data.token
					}
				}).then((res) => {
					if(res.data.code === 200) {
						for (var i = 0; i < res.data.data.length; i++) {
							res.data.data[i].starClockIn = res.data.data[i].starClockIn.substring(0, 5)
							res.data.data[i].stopClockIn = res.data.data[i].stopClockIn.substring(0, 5)
						}
						this.schedulingList = res.data.data
					}
				})
			},
			startStudy(val) {
				val.userId = this.res.data.user.userId
				val.token = this.res.data.token
				uni.navigateTo({
				    url: '/pages/study/study?data=' + encodeURIComponent(JSON.stringify(val))
				})
			},
			next() {
				this.modelshow = false
				uni.navigateTo({
				    url: '/pages/gooutwork/gooutwork'
				})
			},
			startExam() {
				uni.navigateTo({
				    url: '/pages/answer/answer'
				})
			},
			// 获取学习课程列表
			getStudyData() {
				this.$http.post('/course/findTodayCourse', {
					'pageNum': this.pageNo,
					'pageSize': this.pageSize
				}, {
					header: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
						'Authentication': this.res.data.token,
					}
				}).then((res) => {
					this.courseList = res.data.data.records
					this.loadStatus.splice(this.current, 1, "loadmore")
				})
			},
			// tab栏切换
			// tabs通知swiper切换
			tabsChange(index) {
				if(this.isSignIn) {
					this.swiperCurrent = index;
				} else {
					this.show()
				}
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			reachBottom() {
				this.loadStatus.splice(this.current,1,"loading")
				setTimeout(() => {
					if (this.current === 0) {
						this.pageNo++
						this.getStudyData()
					}
				}, 1200)
			},
			handleClickBtn(type) {
				if (type === 'goToWork') {
					uni.navigateTo({
					    url: '/pages/gotowork/gotowork'
					})
					return
				}
				
				if (this.isSignIn) {
					if (type === 'goOutWork') {
						this.modelshow = true
					} else if(type === 'signRecord') {
						uni.navigateTo({
						    url: '/pages/signrecord/signrecord'
						})
					} else if(type === 'leave') {
						uni.navigateTo({
						    url: '/pages/leave/leave'
						})
					}
				} else {
					this.show()
				}
			},
			show() {
				this.$refs.uToast.show({
					title: '请您先打卡！'
				});
			},
			hide() {
				this.$refs.uToast.hide();
			},
			goToWork() {
				uni.navigateTo({
				    url: '/pages/gotowork/gotowork'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.container{
		padding-top: 10rpx;
		height: 100%;
		
		.head{
			height: 300rpx;
			background-color: #FFFFFF;
			
			.avatar {
				height: 150rpx;
				padding: 20rpx 10rpx;
				justify-content: space-between;
				
				.avatar-img{
					width: 100rpx;
					display: flex;
					text-align: center;
					
					.img{
						margin: 0 auto;
						display: flex;
						align-items: center;
					}
				}
				
				.avatar-text{
					flex: 1;
					padding-left: 10rpx;
					
					.name{
						text{
							padding-right: 10rpx;
						}
					}
				}
				
				.avatar-integral{
					padding-right: 10rpx;
					font-weight: bolder;
					color: #fa3534;
				}
			}
			
			.head-btns{
				height: 150rpx;
				display: flex;
				align-items: center;
			}
		}
		
		.main{
			height: calc(100% - 300rpx);
			.bottons{
				padding: 10rpx 0;
			}
			
			.swiper-tab{
				height: 100%;
				
				.swiper{
					height: calc(100% - 80rpx);
					
					.swiper-item{
						height: 100%;
						
						.swiper-item-scroll{
							width: 100%;
							height: 100%;
						}
						
						.noLogin{
							height: 100%;
							
							.patchsign{
								padding-top: 100rpx;
								text-align: center;
								
								text{
									font-size: 36rpx;
									font-weight: bolder;
									line-height: 100rpx;
								}
								
								.btn{
									width: 50%;
									margin: 0 auto;
								}
							}
							
							.scheduling{
								padding: 50rpx 20rpx;
								
								.scheduling-title{
									font-size: 36rpx;
									font-weight: bolder;
									padding-bottom: 20rpx;
								}
								
								.scheduling-list{
									.scheduling-list-item{
										height: 150rpx;
										display: flex;
										align-items: center;
										background-color: #64EAA0;
										margin-bottom: 20rpx;
										
										.scheduling-list-item-avatar{
											width: 150rpx;
											height: 150rpx;
											display: flex;
											align-items: center;
											justify-content: center;
										}
										
										.scheduling-list-item-info{
											width: calc(100% - 130rpx);
											height: 100%;
											padding: 10rpx;
											
											.list-item-info-top{
												height: 50%;
												display: flex;
												align-items: center;
												
												text{
													padding-right: 20rpx;
												}
											}
											
											.list-item-info-bottom{
												display: flex;
												align-items: center;
												height: 50%;
												
												.ClockIn{
													padding-right: 20rpx;
												}
											}
										}
									}
								}
							}
						}
						
						.isLogin{
							height: 100%;
							
							.dataList{
								height: 300rpx;
								margin: 10rpx;
								
								.dataListItem{
									height: 100%;
									padding: 20rpx;
									border: 1rpx solid #333;
									
									.item-img{
										width: 40%;
										height: 100%;
									}
									
									.item-info{
										width: 60%;
										height: 100%;
										padding: 0 10rpx;
										display: flex;
										flex-direction: column;
										justify-content: space-between;
										
										.item-info-title{
											word-break: break-word; //换行模式
											overflow: hidden;
											text-overflow: ellipsis; //修剪文字
											display: -webkit-box;
											-webkit-line-clamp: 3; //此处为上限行数
											-webkit-box-orient: vertical;
										}
										
										.item-info-bottom{
											display: flex;
											justify-content: space-between;
											align-items: flex-end;
											
											.number{
												color: #fa3534
											}
										}
									}
									
									.item-text{
										height: 100%;
										display: flex;
										flex-direction: column;
										justify-content: space-between;
										
										.item-text-top{
											word-break: break-word; //换行模式
											overflow: hidden;
											text-overflow: ellipsis; //修剪文字
											display: -webkit-box;
											-webkit-line-clamp: 3; //此处为上限行数
											-webkit-box-orient: vertical;
										}
										
										.item-text-bottom{
											display: flex;
											justify-content: space-between;
											align-items: flex-end;
											
											.number{
												color: #fa3534
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		
		.popup{
			padding: 50rpx 30rpx;
			
			.title{
				font-size: 30rpx;
				font-weight: bolder;
			}
			
			.taskList{
				padding: 50rpx 0;
				
				.item{
					width: 100%;
					display: flex;
					align-items: flex-start;
					margin-bottom: 20rpx;
					
					.serial{
						width: 40rpx;
						height: 40rpx;
						line-height: 40rpx;
						border-radius: 50%;
						text-align: center;
						color: #FFFFFF;
						background-color: #5677FC;
					}
					
					.text-info{
						flex: 1;
						display: flex;
						
						.text{
							padding: 0rpx 20rpx;
							
							span{
								color: #FF9502;
							}
						}
						
						.link-box{
							display: flex;
							align-items: baseline;
							
							.link{
								color: #5677FC;
							}
						}
					}
				}
			}
		}
	}
</style>
