<template>
	<view class="content">
		<view class="u-page">
			<view class="pageOne" v-if="current === 0">
				<view class="container">
					<view class="head" :style="{background: 'url('+ avatarURL +')', backgroundSize: '100%'}">
						<view class="avatar u-flex">
							<view class="avatar-img">
								<u-avatar class="img" :src="userInfo.unitAcceptance" bg-color="#F4F4F5"></u-avatar>
							</view>
							<view class="avatar-text">
								<view class="company">
									{{ userInfo.unitName }}
								</view>
								<view class="name">
									<text>{{ userInfo.realName }}</text>
								</view>
							</view>
						</view>
						<view class="head-btns">
							<view class="bottons">
								<u-row justify="space-between">
									<u-col span="4">
										<u-button @click="handleClickBtn('goSignRecord')">考勤记录</u-button>
									</u-col>
									<u-col span="4">
										<u-button @click="handleClickBtn('goWorkApproval')">工作审批</u-button>
									</u-col>
									<u-col span="4">
										<u-button @click="handleClickBtn('mailList')">通讯录</u-button>
									</u-col>
								</u-row>
							</view>
						</view>
					</view>
					
					<view class="main">
						<view class="scheduling-list" v-if="schedulingList.length > 0">
							<view class="scheduling-list-item" v-for="(item, index) in schedulingList" :key="index" :style="{ background: item.backgroundColor }">
								<view class="scheduling-list-item-avatar">
									<u-avatar :src="item.userpicPath" bg-color="#F4F4F5"></u-avatar>
								</view>
								<view class="scheduling-list-item-info">
									<view class="name">
										<span>{{ item.userName }}</span>
										<span>{{ item.schedulingName }}</span>
									</view>
									<view class="list-item-info-cert">
										<span>{{ item.certType }}</span>
										<span>{{ item.certDueDate }}</span>
									</view>
								</view>
								<view class="scheduling-list-item-icon">
									<u-button type="primary" size="mini" :custom-style="customStyle">{{ item.text }}</u-button>
								</view>
							</view>
						</view>
						<view class="scheduling-empty" v-else>
							<u-empty text="暂无人员排班" mode="list"></u-empty>
						</view>
					</view>
				</view>
			</view>
			<view class="pageTwo" v-else-if="current === 1">
				<view class="content-main">
					<view class="avatar">
						<view class="avatar-container">
							<view class="avatar-img">
								<u-avatar :src="userInfo.unitAcceptance" mode="circle" :size="150"  bg-color="#F4F4F5"></u-avatar>
							</view>
							<view class="avatar-name">
								<text>{{userInfo.realName}}</text>
							</view>
						</view>
					</view>
					<u-cell-group>
						<u-cell-item icon="account-fill" title="单位信息" @click="goCompanyInfo"></u-cell-item>
						<u-cell-item icon="photo" title="个人照片" @click="goPhoto"></u-cell-item>
						<u-cell-item icon="bookmark-fill" title="营业执照" @click="goBusinessCert"></u-cell-item>
						<u-cell-item icon="file-text-fill" title="考勤设置" @click="goAttendanceSetting"></u-cell-item>
						<u-cell-item icon="setting-fill" title="系统设置" @click="goSystem"></u-cell-item>
					</u-cell-group>
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
				res: {},
				userInfo: {},
				current: 0,
				bgColor: '#ffffff',
				borderTop: true,
				customStyle: {
					width: '100rpx'
				},
				list: [{
						iconPath: "home",
						selectedIconPath: "home-fill",
						text: '主页'
					},
					{
						iconPath: "account",
						selectedIconPath: "account-fill",
						text: '我的'
					}
				],
				inactiveColor: '#909399',
				activeColor: '#5098FF',
				imageURL: '/static/fade.jpg',
				avatarURL: '',
				schedulingList: []
			}
		},
		onLoad() {
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					console.log('res', res)
					this.res = res.data
					this.getUserInfo()
					this.getSchedulingList()
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
				
				if (this.userInfo.wallpaperPath !== undefined) {
					this.avatarURL = this.userInfo.wallpaperPath
				} else {
					uni.getFileSystemManager().readFile({
						filePath: this.imageURL,
						encoding: 'base64',
						success: (r) => {
							this.avatarURL = 'data:image/jpeg;base64,' + r.data
						}
					})
				}
				
				if(this.userInfo.unitAcceptance === undefined) {
					this.userInfo.unitAcceptance = '/static/default_avatar.jpg'
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
							// 当前日期
							let d = new Date()
							let year = d.getFullYear()
							let month = '' + (d.getMonth() + 1)
							let day = '' + d.getDate()
							if (month < 10) month = '0' + month
							if (day < 10) day = '0' + day
							
							let nowDate = Date.parse(year + '-' + month + '-' + day)
							
							for (var i = 0; i < res.data.data.length; i++) {
								if (res.data.data[i].userpicPath === undefined) {
									res.data.data[i].userpicPath = '/static/default_avatar.jpg'
								}
								
								if (res.data.data[i].effectiveTime === undefined && res.data.data[i].certificateTime === undefined && res.data.data[i].certificatePath === undefined) {
									res.data.data[i].certType = '未上传证书'
									res.data.data[i].backgroundColor = 'linear-gradient(to right, #F68711, #E91406)'
									
									if (res.data.data[i].pbState === 0) {
										res.data.data[i].schedulingName = '未排班'
										res.data.data[i].text = '休息'
									} else {
										if (res.data.data[i].applicationState === 0) {
											if (res.data.data[i].attState === 0) {
												res.data.data[i].text = '未打卡'
											} else {
												res.data.data[i].text = '执勤'
											}
										} else {
											res.data.data[i].text = '请假'
										}
									}
								} else {
									let dueDate, dateSpan;
									if (res.data.data[i].effectiveTime !== undefined) {
										res.data.data[i].certType = '成绩单'
										dueDate = Date.parse(res.data.data[i].effectiveTime)
										dateSpan = Math.floor((nowDate - dueDate) / (24*3600*1000))
										
										if (dateSpan <= -30) {
											res.data.data[i].certDueDate = Math.abs(dateSpan) + '天后到期'
											if (res.data.data[i].pbState === 0) {
												res.data.data[i].schedulingName = '未排班'
												res.data.data[i].text = '休息'
												res.data.data[i].backgroundColor = 'linear-gradient(to right, #7FFAB6, #4CDC8C)'
											} else {
												if (res.data.data[i].applicationState === 0) {
													if (res.data.data[i].attState === 0) {
														res.data.data[i].text = '未打卡'
														res.data.data[i].backgroundColor = 'linear-gradient(to right, #FCCB32, #F78845)'
													} else {
														res.data.data[i].text = '执勤'
														res.data.data[i].backgroundColor = 'linear-gradient(to right, #7FFAB6, #4CDC8C)'
													}
												} else {
													res.data.data[i].text = '请假'
													res.data.data[i].backgroundColor = 'linear-gradient(to right, #E1E3E6, #E1E3E6)'
												}
											}
										} else if (dateSpan < 0 && dateSpan > -30) {
											res.data.data[i].certDueDate = Math.abs(dateSpan) + '天后到期'
											res.data.data[i].backgroundColor = 'linear-gradient(to right, #FCCB32, #F78845)'
											if (res.data.data[i].pbState === 0) {
												res.data.data[i].schedulingName = '未排班'
												res.data.data[i].text = '休息'
											} else {
												if (res.data.data[i].applicationState === 0) {
													if (res.data.data[i].attState === 0) {
														res.data.data[i].text = '未打卡'
													} else {
														res.data.data[i].text = '执勤'
													}
												} else {
													res.data.data[i].text = '请假'
												}
											}
										} else if (dateSpan === 0) {
											res.data.data[i].certDueDate = '今天到期'
											res.data.data[i].backgroundColor = 'linear-gradient(to right, #F68711, #E91406)'
											if (res.data.data[i].pbState === 0) {
												res.data.data[i].schedulingName = '未排班'
												res.data.data[i].text = '休息'
											} else {
												if (res.data.data[i].applicationState === 0) {
													if (res.data.data[i].attState === 0) {
														res.data.data[i].text = '未打卡'
													} else {
														res.data.data[i].text = '执勤'
													}
												} else {
													res.data.data[i].text = '请假'
												}
											}
										} else {
											res.data.data[i].certDueDate = '已过期' + Math.abs(dateSpan) + '天'
											res.data.data[i].backgroundColor = 'linear-gradient(to right, #F68711, #E91406)'
											if (res.data.data[i].pbState === 0) {
												res.data.data[i].schedulingName = '未排班'
												res.data.data[i].text = '休息'
											} else {
												if (res.data.data[i].applicationState === 0) {
													if (res.data.data[i].attState === 0) {
														res.data.data[i].text = '未打卡'
													} else {
														res.data.data[i].text = '执勤'
													}
												} else {
													res.data.data[i].text = '请假'
												}
											}
										}
									}
									
									if (res.data.data[i].certificateTime !== undefined) {
										res.data.data[i].certType = '结业证'
										dueDate = Date.parse(res.data.data[i].certificateTime)
										dateSpan = Math.floor((nowDate - dueDate) / (24*3600*1000))
										
										if (dateSpan <= -30) {
											if (res.data.data[i].pbState === 0) {
												res.data.data[i].schedulingName = '未排班'
												res.data.data[i].text = '休息'
												res.data.data[i].backgroundColor = 'linear-gradient(to right, #7FFAB6, #4CDC8C)'
											} else {
												if (res.data.data[i].applicationState === 0) {
													if (res.data.data[i].attState === 0) {
														res.data.data[i].text = '未打卡'
														res.data.data[i].backgroundColor = 'linear-gradient(to right, #FCCB32, #F78845)'
													} else {
														res.data.data[i].text = '执勤'
														res.data.data[i].backgroundColor = 'linear-gradient(to right, #7FFAB6, #4CDC8C)'
													}
												} else {
													res.data.data[i].text = '请假'
													res.data.data[i].backgroundColor = 'linear-gradient(to right, #E1E3E6, #E1E3E6)'
												}
											}
										} else if (dateSpan < 0 && dateSpan > -30) {
											res.data.data[i].certDueDate = Math.abs(dateSpan) + '天后到期'
											res.data.data[i].backgroundColor = 'linear-gradient(to right, #FCCB32, #F78845)'
											if (res.data.data[i].pbState === 0) {
												res.data.data[i].schedulingName = '未排班'
												res.data.data[i].text = '休息'
											} else {
												if (res.data.data[i].applicationState === 0) {
													if (res.data.data[i].attState === 0) {
														res.data.data[i].text = '未打卡'
													} else {
														res.data.data[i].text = '执勤'
													}
												} else {
													res.data.data[i].text = '请假'
												}
											}
										} else if (dateSpan === 0) {
											res.data.data[i].certDueDate = '今天到期'
											res.data.data[i].backgroundColor = 'linear-gradient(to right, #F68711, #E91406)'
											if (res.data.data[i].pbState === 0) {
												res.data.data[i].schedulingName = '未排班'
												res.data.data[i].text = '休息'
											} else {
												if (res.data.data[i].applicationState === 0) {
													if (res.data.data[i].attState === 0) {
														res.data.data[i].text = '未打卡'
													} else {
														res.data.data[i].text = '执勤'
													}
												} else {
													res.data.data[i].text = '请假'
												}
											}
										} else {
											res.data.data[i].certDueDate = '已过期' + Math.abs(dateSpan) + '天'
											res.data.data[i].backgroundColor = 'linear-gradient(to right, #F68711, #E91406)'
											if (res.data.data[i].pbState === 0) {
												res.data.data[i].schedulingName = '未排班'
												res.data.data[i].text = '休息'
											} else {
												if (res.data.data[i].applicationState === 0) {
													if (res.data.data[i].attState === 0) {
														res.data.data[i].text = '未打卡'
													} else {
														res.data.data[i].text = '执勤'
													}
												} else {
													res.data.data[i].text = '请假'
												}
											}
										}
									}
									
									if (res.data.data[i].certificatePath !== undefined) {
										res.data.data[i].certType = '消防证'
										if (res.data.data[i].pbState === 0) {
											res.data.data[i].schedulingName = '未排班'
											res.data.data[i].text = '休息'
											res.data.data[i].backgroundColor = 'linear-gradient(to right, #7FFAB6, #4CDC8C)'
										} else {
											if (res.data.data[i].applicationState === 0) {
												if (res.data.data[i].attState === 0) {
													res.data.data[i].text = '未打卡'
													res.data.data[i].backgroundColor = 'linear-gradient(to right, #F68711, #E91406)'
												} else {
													res.data.data[i].text = '执勤'
													res.data.data[i].backgroundColor = 'linear-gradient(to right, #7FFAB6, #4CDC8C)'
												}
											} else {
												res.data.data[i].text = '请假'
												res.data.data[i].backgroundColor = 'linear-gradient(to right, #E1E3E6, #E1E3E6)'
											}
										}
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
				}
			},
			beforeSwitch(index) {
				let page = getCurrentPages().pop(); //跳转页面成功之后
				if (!page) return;
				page.onLoad();
				return true
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
		height: 100%;
		
		.u-page{
			height: calc(100% - 100rpx);
			
			.pageOne{
				height: 100%;
				
				.container{
					padding-top: 10rpx;
					height: 100%;
					
					.head{
						height: 300rpx;
						background-color: #FFFFFF;
						
						.avatar {
							height: 150rpx;
							padding: 20rpx;
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
						}
						
						.head-btns{
							height: 150rpx;
							display: flex;
							align-items: center;
							padding: 0 20rpx;
							
							.bottons{
								width: 100%;
							}
						}
					}
					
					.main{
						padding: 20rpx 20rpx 100rpx;
						
						.scheduling-list{
							height: 100%;
							
							.scheduling-list-item{
								height: 150rpx;
								display: flex;
								align-items: center;
								margin-bottom: 20rpx;
								
								.scheduling-list-item-avatar{
									width: 150rpx;
									height: 150rpx;
									display: flex;
									align-items: center;
									justify-content: center;
								}
								
								.scheduling-list-item-info{
									flex: 1;
									padding: 10rpx;
									
									.name{
										width: 80%;
										display: flex;
										justify-content: flex-start;
										
										span{
											padding-right: 20rpx;
										}
									}
									
									.list-item-info-cert{
										width: 80%;
										display: flex;
										justify-content: flex-start;
										
										span{
											padding-right: 20rpx;
										}
									}
								}
								
								.scheduling-list-item-icon{
									width: 150rpx;
									display: flex;
									justify-content: center;
								}
							}
						}
						
						.scheduling-empty{
							height: 500rpx;
						}
					}
				}
			}
			
			.pageTwo{
				height: 100%;
				
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
