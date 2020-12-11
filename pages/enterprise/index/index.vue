<template>
	<view class="content">
		<view class="u-page">
			<view class="pageOne" v-if="current === 0">
				<view class="container">
					
					<!-- 首页头部信息 -->
					<view class="header-main" :style="'padding-top: '+ top +'px;background: url('+ backgroundImage +'); background-size: 100%;'">
						<view class="header-title" :style="'height:' + height + 'px;'">
							高新区消控室人员管理系统
						</view>
						<view class="header-container">
							<view class="header-info">
								<view class="header-avatar" @click="getUserView">
									<u-image width="100rpx" height="100rpx" :border-radius="10" :src="userInfo.unitAcceptance">
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
					
					<view class="newLoading" v-if="show === true">
						<u-loading mode="flower" size="100" :show="show"></u-loading>
					</view>
					<!-- 消息列表 -->
					<view class="news" v-else>
						<view class="newsList" v-if="newsList.length > 0">
							<view class="listItem" v-for="(item, index) in newsList" :key="index" @click="goViewNew(item)">
								<view class="time">{{ item.creatTime }}</view>
								<view class="list-item-content-ispic" v-if="item.coursePic !== ''" :style="'background: url('+ item.coursePic +'); background-size: 100%;'">
									<view class="title">
										{{ item.courseName }}
									</view>
									
								</view>
								<view class="list-item-content-nopic" v-else :style="'background: #000000;'">
									<view class="title">
										{{ item.courseName }}
									</view>
									<view class="content">
										{{ item.courseContent }}
									</view>
								</view>
							</view>
						</view>
						<view class="noNewsList" v-else>
							<u-empty text="暂无新闻公告" mode="list"></u-empty>
						</view>
					</view>
				</view>
			</view>
			<view class="pageTwo" v-else-if="current === 1">
				<view class="container">
					<!-- 首页头部信息 -->
					<view class="header-main" :style="'padding-top: '+ top +'px;background: url('+ backgroundImage +'); background-size: 100%;'">
						<view class="header-title" :style="'height:' + height + 'px;'">
							高新区消控室人员管理系统
						</view>
						<view class="header-container">
							<view class="header-info">
								<view class="header-avatar" @click="getUserView">
									<u-image width="100rpx" height="100rpx" :border-radius="10" :src="userInfo.unitAcceptance">
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
					
					<!-- 导航按钮 -->
					<view class="head-btns">
						<view class="bottons">
							<u-row justify="space-between">
								<u-col span="3">
									<u-button type="primary" @click="handleClickBtn('goStudy')">学习</u-button>
								</u-col>
								<u-col span="3">
									<u-button type="primary" @click="handleClickBtn('goWorkApproval')">工作审批</u-button>
								</u-col>
								<u-col span="3">
									<u-button type="primary" @click="handleClickBtn('goSignRecord')">考勤记录</u-button>
								</u-col>
								<u-col span="3">
									<u-button type="primary" @click="handleClickBtn('mailList')">通讯录</u-button>
								</u-col>
							</u-row>
						</view>
					</view>
					
					<view class="scheduling">
						<view class="scheduling-title">
							执勤信息
						</view>
						<view class="scheduling-list" v-if="schedulingList.length > 0">
							<view class="scheduling-item" v-for="(item, index) in schedulingList" :key="index">
								<view class="scheduling-item-avatar">
									<u-image width="100rpx" height="100rpx" shape="circle" :lazy-load="true" :src="item.UserpicPath">
									</u-image>
								</view>
								<view class="scheduling-item-info">
									<view class="scheduling-item-info-top">
										<view class="scheduling-item-info-name">
											{{ item.RealName }}
										</view>
										<view class="scheduling-item-info-status">
											{{ item.status }}
										</view>
									</view>
									<view class="scheduling-item-info-top">
										<view class="scheduling-item-info-name">
											{{ item.certName }}
										</view>
										<view class="scheduling-item-info-status">
											{{ item.schedulingName }}
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="scheduling-nolist" v-else>
							<u-empty text="暂无执勤信息" mode="list"></u-empty>
						</view>
					</view>
					
					<!-- 学习排名 -->
					<view class="study">
						<view class="study-title">
							学习排名
						</view>
						<view class="study-list" v-if="studyList.length > 0">
							<view class="study-list-item" v-for="(item, index) in studyList" :key="index">
								<view class="study-list-item-avatar">
									<u-image width="100rpx" height="100rpx" shape="circle" :lazy-load="true" :src="item.userpicPath"></u-image>
								</view>
								<view class="study-list-item-info">
									<view class="study-list-item-info-name">
										{{ item.userName }}
									</view>
									<view class="study-list-item-info-certName">
										{{ item.certName }}
									</view>
								</view>
								<view class="study-list-item-timelong">
									总学习时长 {{ item.userCourseNum }} 分钟
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-tabbar
		    :beforeSwitch="beforeSwitch"
		    v-model="current"
		    :bg-color="bgColor"
		    :border-top="borderTop"
		    :list="list"
			:inactive-color="inactiveColor"
			:activeColor="activeColor"
		></u-tabbar>
	</view>
</template>

<script>
	
	
	export default {
		data() {
			return {
				top: '',
				height: '',
				res: {},
				userInfo: {},
				current: 0,
				bgColor: '#ffffff',
				borderTop: true,
				backgroundImage: 'https://xksv.atx.net.cn/xcx_static/img/bg.jpg',
				customStyle: {
					width: '100rpx'
				},
				list: [{
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
				show: false,
				inactiveColor: '#909399',
				activeColor: '#5098FF',
				imageURL: 'https://xksv.atx.net.cn/xcx_static/img/fade.jpg',
				avatarURL: '',
				schedulingList: [],
				newsList: [],
				studyList: []
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
					this.getSchedulingList()
					this.getNewsList()
					this.getStudyList()
				}
			})
		},
		onShow() {
			if (uni.hideHomeButton) {
			   uni.hideHomeButton()
			}
		},
		methods: {
			getUserInfo() {
				this.userInfo = this.res.userInfo
				
				if(this.res.userInfo.wallpaperPath !== undefined) {
					this.backgroundImage = this.res.userInfo.wallpaperPath
				} else {
					let wallpaperPath = this.backgroundImage
					uni.getFileSystemManager().readFile({
						filePath: wallpaperPath,
						encoding: 'base64',
						success: (r) => {
							this.backgroundImage = 'data:image/jpeg;base64,' + r.data
						}
					})
				}
				
				if(this.userInfo.unitAcceptance === undefined) {
					this.userInfo.unitAcceptance = 'https://xksv.atx.net.cn/xcx_static/img/default_avatar.jpg'
				}
			},
			getSchedulingList() {
				this.schedulingList = []
				this.$http.post('/scheduling/findUserSchedulingBydeptId', {
					'unitId': this.res.userInfo.unitId
				}, {
					header: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
						'Authentication': this.res.token
					}
				}).then((res) => {
					if (res.data.code === 200) {
						if (res.data.data !== undefined) {
							for (var i = 0; i < res.data.data.length; i++) {
								if (res.data.data[i].UserpicPath === undefined) {
									res.data.data[i].UserpicPath = 'https://xksv.atx.net.cn/xcx_static/img/default_avatar.jpg'
								}
								
								if (res.data.data[i].PbState === 0) {
									res.data.data[i].schedulingName = '未排班'
									res.data.data[i].status = '休息'
								} else {
									if (res.data.data[i].ApplicationState === 0) {
										if (res.data.data[i].AttState === 0) {
											res.data.data[i].status = '未打卡'
										} else {
											res.data.data[i].status = '执勤中'
										}
									} else {
										res.data.data[i].status = '请假'
									}
								}
								
								if (res.data.data[i].EffectiveTime === undefined && res.data.data[i].CertificateTime === undefined && res.data.data[i].CertificatePath === undefined) {
									res.data.data[i].certName = '未上传证书'
								} else {
									if (res.data.data[i].EffectiveTime !== undefined) {
										res.data.data[i].certName = '成绩单'
									}
									
									if (res.data.data[i].CertificateTime !== undefined) {
										res.data.data[i].certName = '结业证'
									}
									
									if (res.data.data[i].CertificatePath !== undefined) {
										res.data.data[i].certName = '消防证'
									}
								}
								this.schedulingList.push(res.data.data[i])
							}
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
			getNewsList() {
				this.show = true
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
						this.show = false
						this.newsList = res.data.data.records
					}
				})
			},
			getStudyList() {
				this.studyList = []
				this.$http.get('course/findUserRanks', {
					params: {
						'unitId': this.userInfo.unitId
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
						'Authentication': this.res.token
					}
				}).then((res) => {
					if (res.data.userJsonArray.length > 0) {
						for (var i = 0; i < res.data.userJsonArray.length; i++) {
							if (res.data.userJsonArray[i].effectiveTime === undefined && res.data.userJsonArray[i].certificateTime === undefined && res.data.userJsonArray[i].certificatePath === undefined) {
								res.data.userJsonArray[i].certName = '未上传证书'
							} else {
								if (res.data.userJsonArray[i].effectiveTime !== undefined) {
									res.data.userJsonArray[i].certName = '成绩单'
								}
								
								if (res.data.userJsonArray[i].certificateTime !== undefined) {
									res.data.userJsonArray[i].certName = '结业证'
								}
								
								if (res.data.userJsonArray[i].certificatePath !== undefined) {
									res.data.userJsonArray[i].certName = '消防证'
								}
							}
							this.studyList.push(res.data.userJsonArray[i])
						}
					}
				})
			},
			handleClickBtn(type) {
				if(type === 'goSignRecord') {
					uni.navigateTo({
					    url: '/pages/enterprise/signrecord/signrecord'
					})
				} else if(type === 'goWorkApproval') {
					uni.navigateTo({
					    url: '/pages/enterprise/workapproval/workapproval'
					})
				} else if(type === 'mailList'){
					uni.navigateTo({
					    url: '/pages/enterprise/mailList/mailList'
					})
				} else if(type === 'goStudy') {
					uni.navigateTo({
						url: '/pages/enterprise/study/study'
					})
				}
			},
			getUserView() {
				uni.navigateTo({
				    url: '/pages/enterprise/mypage/mypage'
				})
			},
			goViewNew(val) {
				uni.navigateTo({
				    url: '/pages/enterprise/viewNews/viewNews?data=' + encodeURIComponent(JSON.stringify(val))
				})
			},
			goCompanyInfo() {
				uni.navigateTo({
				    url: '/pages/enterprise/CompanyInfo/CompanyInfo'
				})
			},
			goPhoto() {
				uni.navigateTo({
					url: '/pages/enterprise/unitPhoto/unitPhoto'
				})
			},
			goBusinessCert() {
				uni.navigateTo({
				    url: '/pages/enterprise/businessCert/businessCert'
				})
			},
			goAttendanceSetting() {
				uni.navigateTo({
				    url: '/pages/enterprise/attendanceSetting/attendanceSetting'
				})
			},
			goSystem() {
				uni.navigateTo({
				    url: '/pages/system/system'
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
					
					.newLoading{
						padding: 100rpx 0;
						text-align: center;
					}
					
					.news{
						.newsList{
							padding: 20rpx 0;
							
							.listItem{
								padding-top: 20rpx;
								
								.time{
									padding: 10rpx 0;
									text-align: center;
									color: #C0C0C0;
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
										color: #000000;
									}
									
									.content{
										height: auto;
										display: -webkit-box;
										-webkit-box-orient: vertical;
										-webkit-line-clamp: 2;
										overflow: hidden;
										color: #000000;
									}
								}
								
								.list-item-content-ispic{
									position: relative;
									
									.title{
										position: absolute;
										left: 20rpx;
										bottom: 20rpx;
										font-size: 36rpx;
										color: #000000;
									}
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
					
					.scheduling{
						padding: 0 20rpx;
						
						.scheduling-title{
							padding: 20rpx 0;
							font-weight: bolder;
						}
						
						.scheduling-list{
							display: flex;
							flex-wrap: wrap;
							padding: 10rpx 0;
							
							.scheduling-item{
								width: calc(50% - 5rpx);
								height: 120rpx;
								padding: 10rpx;
								display: flex;
								align-items: center;
								justify-content: space-between;
								background-color: #E1E3E6;
								
								&:nth-child(odd) {
									margin: 0 5rpx 10rpx 0;
								}
								
								&:nth-child(even) {
									margin: 0 0 10rpx 5rpx;
								}
								
								.scheduling-item-avatar{
									width: 100rpx;
								}
								
								.scheduling-item-info{
									padding-left: 10rpx;
									flex: 1;
									display: flex;
									flex-direction: column;
									
									.scheduling-item-info-top{
										display: flex;
										justify-content: space-between;
										
										.scheduling-item-info-name,
										.scheduling-item-info-schedulingName,
										.scheduling-item-info-status{
											font-size: 22rpx;
										}
									}
								}
							}
						}
					}
					
					.study{
						padding: 0 20rpx;
						
						.study-title{
							padding: 20rpx 0;
							font-weight: bolder;
						}
						
						.study-list{
							.study-list-item{
								display: flex;
								justify-content: space-between;
								align-items: center;
								padding: 20rpx;
								margin-bottom: 20rpx;
								background-color: #E1E3E6;
								
								.study-list-item-avatar{
									width: 100rpx;
								}
								
								.study-list-item-info{
									flex: 1;
									padding-left: 20rpx;
								}
								
								.study-list-item-timelong{
									width: 300rpx;
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
							
							.avatar-img{
								display: flex;
								justify-content: center;
							}
							.avatar-name{
								display: flex;
								align-items: center;
								justify-content: center;
								
								text{
									padding-right: 10rpx;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
