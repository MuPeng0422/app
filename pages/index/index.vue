<template>
	<view class="content">
		<view class="u-page">
			<view class="pageOne" v-if="tabbarCurrent === 0">
				<view class="container">
					
					<!-- 首页头部信息 -->
					<view class="header-main" :style="'padding-top: '+ top +'px;background: url('+ backgroundImage +'); background-size: 100%;'">
						<view class="header-title" :style="'height:' + height + 'px;'">
							高新区消控室人员管理系统
						</view>
						<view class="header-container">
							<view class="header-info">
								<view class="header-avatar" @click="getUserView">
									<u-image width="100rpx" height="100rpx" :border-radius="10" :src="userInfo.userpicPath">
										<u-loading slot="loading"></u-loading>
									</u-image>
								</view>
								<view class="header-name">
									<view class="name">
										<text>{{ userInfo.realName }}</text>
										<text>{{ userInfo.unitName }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					
					<!-- 占位 -->
					<view class="complate"></view>
					
					<!-- 消息列表 -->
					<view class="newsList" v-if="newsList.length > 0">
						<view class="listItem" v-for="(item, index) in newsList" :key="index">
							<view class="time">{{ item.creatTime }}</view>
							<view class="list-item-content-nopic" v-if="item.coursePic === ''" :style="'background: #000000;'">
								<view class="title">
									{{ item.courseName }}
								</view>
								<view class="content">
									{{ item.courseContent }}
								</view>
							</view>
							<view class="list-item-content-ispic" v-else :style="'background: url('+ item.coursePic +'); background-size: 100%;'">
								<view class="title">
									{{ item.courseName }}
								</view>
							</view>
						</view>
					</view>
					
					<!-- 无消息 -->
					<view class="noNewsList" v-else>
						<u-empty text="暂无新闻公告" mode="list"></u-empty>
					</view>
				</view>
			</view>
			<view class="pageTwo" v-else-if="tabbarCurrent === 1">
				
				<view class="container">
					
					<!-- 首页头部信息 -->
					<view class="header-main" :style="'padding-top: '+ top +'px;background: url('+ backgroundImage +'); background-size: 100%;'">
						<view class="header-title" :style="'height:' + height + 'px;'">
							高新区消控室人员管理系统
						</view>
						<view class="header-container">
							<view class="header-info">
								<view class="header-avatar" @click="getUserView">
									<u-image width="100rpx" height="100rpx" :border-radius="10" :src="userInfo.userpicPath">
										<u-loading slot="loading"></u-loading>
									</u-image>
								</view>
								<view class="header-name">
									<view class="name">
										<text>{{ userInfo.realName }}</text>
										<text>{{ integral }} 积分</text>
									</view>
									<view class="integral">
										<text class="unitName">{{ userInfo.unitName }}</text>
										<u-icon name="checkmark-circle" size="40" :color="color"></u-icon>
									</view>
								</view>
							</view>
						</view>
					</view>
					
					<!-- 占位 -->
					<view class="complate"></view>
					
					<!-- 导航按钮 -->
					<view class="head-btns">
						<view class="bottons">
							<u-row justify="space-between">
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
					
					<view class="main">
						<view class="swiper-tab">
							<view>
								<u-tabs-swiper ref="uTabs" :list="list" :bold="false" :bar-width="width" :current="current" @change="tabsChange" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
							</view>
							<swiper class="swiper" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
								<swiper-item class="swiper-item">
									<scroll-view scroll-y class="swiper-item-scroll">
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
										</view>
										<view class="noLogin" v-else>
											<view class="patchsign">
												<text>需要打卡后才可以学习哦~</text>
											</view>
											<view class="scheduling">
												<view class="scheduling-title">
													我的排班
												</view>
												<view class="scheduling-list" v-if="schedulingList.length > 0">
													<view class="scheduling-list-item" v-for="(item, index) in schedulingList" :key="index">
														<view class="scheduling-list-item-avatar">
															<u-avatar :src="userInfo.userpicPath"></u-avatar>
														</view>
														<view class="scheduling-list-item-info">
															<view class="list-item-info-top">
																<text>{{ userInfo.realName }}</text>
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
												<view class="scheduling-empty" v-else>
													<u-empty text="暂无排班" mode="list"></u-empty>
												</view>
											</view>
										</view>
									</scroll-view>
								</swiper-item>
								
								<swiper-item class="swiper-item">
									<scroll-view scroll-y class="swiper-item-scroll" @scrolltolower="reachBottom">
										<view class="isLogin">
											<view class="dataList everyday">
												<view class="item-info">
													<view class="item-info-title">
														每日答题
													</view>
													<view class="btn">
														<u-button type="primary" @click="startExam(0)">立即答题</u-button>
													</view>
												</view>
											</view>
										</view>
									</scroll-view>
								</swiper-item>
							</swiper>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-tabbar
		    :beforeSwitch="beforeSwitch"
		    v-model="tabbarCurrent"
		    :bg-color="bgColor"
		    :border-top="borderTop"
		    :list="tabbarList"
			:inactive-color="inactiveColor"
			:activeColor="activeColor"
		></u-tabbar>
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
	import { mapMutations } from 'vuex'; 
	
	export default {
		data() {
			return {
				res: {},
				top: '',
				height: '',
				isSignIn: true,
				tabbarCurrent: 0,
				bgColor: '#000000',
				borderTop: true,
				backgroundImage: 'https://xksv.atx.net.cn/xcx_static/img/bg.jpg',
				tabbarList: [{
						iconPath: "volume-up",
						selectedIconPath: "volume-up-fill",
						text: '新闻公告'
					},
					{
						iconPath: "account",
						selectedIconPath: "account-fill",
						text: '我的应用'
					}
				],
				inactiveColor: '#C09964',
				activeColor: '#5098FF',
				text: '无头像',
				name: 'checkmark-circle',
				color: '',
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
				data: [],
				pageNo: 1,
				pageSize: 10,
				modelshow: false,
				xbtitle: '您今日还有未完成任务，完成后才能打卡哦~',
				timelong: '9/15',
				schedulingList: [],
				newsList: []
			}
		},
		onLoad() {
			const navbar = uni.getSystemInfoSync()
			this.top = navbar.statusBarHeight
			if(navbar.platform == 'android') {
				this.height = 48
			}else {
				this.height = 44
			}
			
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					this.res = res.data
					this.getUserInfo()
					this.getStudyData()
					this.getScheduling()
					this.getIntegral()
					this.getTodayNews()
				}
			})
		},
		onShow() {
			if (uni.hideHomeButton) {
			   uni.hideHomeButton()
			}
			
			setTimeout(() => {
				this.getIntegral()
			}, 500)
		},
		methods: {
			...mapMutations(['logout']),
			getIntegral() {
				this.$http.get('/findUserIntegral', {
					params: {
						'userId': this.res.userInfo.userId,
					},
					header: {
						'Authentication': this.res.token,
					}
				}).then((res) => {
					this.integral = res.data.data
				})
			},
			getUserInfo() {
				this.userInfo = this.res.userInfo
				if (this.userInfo.userpicPath === undefined) {
					this.userInfo.userpicPath = 'https://xksv.atx.net.cn/xcx_static/img/default_avatar.jpg'
				}
				
				if (this.userInfo.realName === undefined) {
					this.userInfo.realName = this.userInfo.mobile
				}
				
				if(this.userInfo.findCourse === 0) {
					this.isSignIn = false
				} else {
					this.isSignIn = true
				}
				
				if(this.res.userInfo.wallpaperPath !== undefined) {
					this.backgroundImage = this.res.userInfo.wallpaperPath
				}
				
				if (this.userInfo.certificateState === 0) {
					this.color = '#19be6b'
				} else if (this.userInfo.certificateState === 1) {
					this.color = '#ff9900'
				} else if (this.userInfo.certificateState === 2) {
					this.color = '#909399'
				}
			},
			getScheduling() {
				this.$http.post('/scheduling/findUserScheduling', {
					'userId': this.res.userInfo.userId
				}, {
					header: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
						'Authentication': this.res.token
					}
				}).then((res) => {
					if(res.data.code === 200) {
						if (res.data.data !== undefined) {
							for (var i = 0; i < res.data.data.length; i++) {
								res.data.data[i].starClockIn = res.data.data[i].starClockIn.substring(0, 5)
								res.data.data[i].stopClockIn = res.data.data[i].stopClockIn.substring(0, 5)
							}
							this.schedulingList = res.data.data
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
			getTodayNews() {
				this.$http.post('course/findTodayNews', {
					'pageNum': 1,
					'pageSize': 10
				}, {
					header: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
						'Authentication': this.res.token
					}
				}).then((res) => {
					if (res.data.code === 200) {
						this.newsList = res.data.data.records
					}
				}).catch((err) => {
					if (err.data.code === 401) {
						uni.reLaunch({
							url: '/pages/login/login'
						})
					}
				})
			},
			startStudy(val) {
				val.userId = this.res.userInfo.userId
				val.token = this.res.token
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
			getUserView() {
				uni.navigateTo({
				    url: '/pages/mypage/mypage'
				})
			},
			startExam(type) {
				this.$http.post('/question/findTodayQuestin', {
					'type': type
				}, {
					header: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
						'Authentication': this.res.token
					}
				}).then((res) => {
					res.data.token = this.res.token
					res.data.userId = this.res.userInfo.userId
					res.data.type = type
					if (res.data.data !== undefined) {
						uni.navigateTo({
						    url: '/pages/answer/answer?data=' + encodeURIComponent(JSON.stringify(res.data))
						})
					} else {
						if (type === 0) {
							this.$u.toast('今日暂无答题')
						} else {
							this.$u.toast('本周暂无答题')
						}
						
					}
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
			// tab栏切换
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
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
			handleClickBtn(type) {
				if (this.userInfo.unitId === undefined || this.userInfo.unitId === 1000000000) {
					if (type === 'goToWork' || type === 'goOutWork' || type === 'leave') {
						this.$u.toast('请先加入公司')
					} else if (type === 'signRecord') {
						uni.navigateTo({
						    url: '/pages/signrecord/signrecord?data=' + encodeURIComponent(JSON.stringify(this.res))
						})
					}
				} else {
					if (this.schedulingList.length > 0) {
						if (type === 'goToWork') {
							uni.navigateTo({
							    url: '/pages/gotowork/gotowork'
							})
						} else if (type === 'goOutWork') {
							this.modelshow = true
						} else if (type === 'signRecord') {
							uni.navigateTo({
							    url: '/pages/signrecord/signrecord?data=' + encodeURIComponent(JSON.stringify(this.res))
							})
						} else if (type === 'leave') {
							uni.navigateTo({
							    url: '/pages/leave/leave'
							})
						}
					} else {
						if(type === 'signRecord') {
							uni.navigateTo({
							    url: '/pages/signrecord/signrecord?data=' + encodeURIComponent(JSON.stringify(this.res))
							})
						} else if (type === 'leave') {
							uni.navigateTo({
							    url: '/pages/leave/leave'
							})
						} else {
							this.$u.toast('暂无排班')
						}
					}
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
			},
			beforeSwitch(index) {
				let page = getCurrentPages().pop(); //跳转页面成功之后
				if (!page) return;
				page.onLoad();
				return true
			},
			goUserInfo() {
				uni.navigateTo({
				    url: '/pages/userInfo/userInfo'
				})
			},
			goPersonalCert() {
				uni.navigateTo({
				    url: '/pages/personalCert/personalCert'
				})
			},
			goStudyReport() {
				uni.navigateTo({
				    url: '/pages/studyReport/studyReport'
				})
			},
			goSystem() {
				uni.navigateTo({
				    url: '/pages/system/system'
				})
			},
			goPhoto() {
				uni.navigateTo({
					url: '/pages/userPhoto/userPhoto'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.content{
		.u-page{
			.pageOne{
				.container{
					
					.header-main{
						width: 100%;
						height: 300rpx;
						padding-top: 300rpx;
						position: fixed;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						z-index: 999;
						
						.header-title{
							display: flex;
							align-items: center;
							padding-left: 20rpx;
							color: $color;
						}
						
						.header-container{
							flex: 1;
							display: flex;
							padding: 20rpx;
							
							.header-info{
								height: 100rpx;
								display: flex;
								justify-content: flex-start;
								
								.header-avatar{
									padding: 0 50rpx;
								}
								
								.header-name{
									display: flex;
									
									.name{
										display: flex;
										justify-content: space-around;
										flex-direction: column;
										color: $color;
									}
									
									.integral{
										
									}
								}
							}
						}
					}
					
					.complate{
						height: 300rpx;
					}
					
					.noNewsList{
						padding-top: 50rpx;
					}
					
					.newsList{
						padding: 20rpx 0;
						
						.listItem{
							padding-top: 20rpx;
							
							.time{
								padding: 10rpx 0;
								text-align: center;
								color: $color;
							}
							
							.list-item-content-nopic, 
							.list-item-content-ispic{
								height: 200rpx;
								padding: 20rpx;
							}
							
							.list-item-content-nopic{
								display: flex;
								flex-direction: column;
								justify-content: space-between;
								
								.title{
									padding: 10rpx 0;
									display: flex;
									align-items: center;
									font-size: 36rpx;
									color: $color;
								}
								
								.content{
									height: auto;
									display: -webkit-box;
									-webkit-box-orient: vertical;
									-webkit-line-clamp: 2;
									overflow: hidden;
									color: $color;
								}
							}
							
							.list-item-content-ispic{
								position: relative;
								
								.title{
									position: absolute;
									left: 20rpx;
									bottom: 20rpx;
									font-size: 36rpx;
									color: $color;
								}
							}
						}
					}
				}
			}
			
			.pageTwo{
				.container{
					
					.header-main{
						width: 100%;
						height: 300rpx;
						padding-top: 300rpx;
						position: fixed;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						z-index: 999;
						
						.header-title{
							display: flex;
							align-items: center;
							padding-left: 20rpx;
							color: $color;
						}
						
						.header-container{
							flex: 1;
							display: flex;
							padding: 20rpx;
							
							.header-info{
								width: 100%;
								height: 100rpx;
								display: flex;
								justify-content: flex-start;
								
								.header-avatar{
									width: 200rpx;
									padding: 0 50rpx;
								}
								
								.header-name{
									width: calc(100% - 300rpx);
									display: flex;
									flex-direction: column;
									justify-content: space-around;
									
									.name{
										display: flex;
										justify-content: space-between;
										color: $color;
									}
									
									.integral{
										display: flex;
										align-items: center;
										color: $color;
										
										.unitName{
											padding-right: 20rpx;
										}
									}
								}
							}
						}
					}
					
					.complate{
						height: 300rpx;
					}
					
					.head-btns{
						padding: 20rpx 10rpx;
					}
					
					
					
					.main{
						height: 800rpx;
						
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
										
										.everyday{
											background: url('https://xksv.atx.net.cn/xcx_static/img/timg01.jpg');
										}
										
										.everyday{
											display: flex;
											justify-content: center;
											align-items: center;
											background-size: 100%;
											
											.item-info{
												text-align: center;
												
												.item-info-title{
													font-size: 36rpx;
													margin-bottom: 20rpx;
												}
											}
										}
										
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
				}
				
				.content-main{
					height: 100%;
					background-color: #FFFFFF;
					
					.avatar{
						height: 300rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						
						.avatar-container{
							display: flex;
							flex-direction: column;
							justify-content: center;
							
							.avatar-name{
								display: flex;
								align-items: center;
								justify-content: center;
								
								text{
									padding-right: 10rpx;
								}
							}
							
							.avatar-img{
								display: flex;
								align-items: center;
								justify-content: center;
							}
						}
					}
				}
			}
		}
	}
	.u-demo-area {
		margin: 0 -40rpx;
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
</style>
