<template>
	<view class="content">
		<view class="u-page">
			<view class="pageOne" v-if="current === 0">
				<view class="container">
					<view class="head" :style="{background: 'url('+ imageURL +')', backgroundSize: backgroundSize}">
						<view class="avatar u-flex">
							<view class="avatar-img">
								<u-avatar class="img" :src="userInfo.userpicPath"></u-avatar>
							</view>
							<view class="avatar-text">
								<view class="company">
									{{ userInfo.unitName }}
								</view>
								<view class="name">
									<text>{{ userInfo.realName }}</text>
									<u-icon :name="name" size="40" color="#19be6b"></u-icon>
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
						<view class="scheduling-list">
							<view class="scheduling-list-item" v-for="(item, index) in schedulingList" :key="index" :style="{ backgroundColor: item.backgroundColor }">
								<view class="scheduling-list-item-avatar">
									<u-avatar :src="userInfo.src"></u-avatar>
								</view>
								<view class="scheduling-list-item-info">
									<view class="list-item-info-top">
										<text>{{ item.username }}</text>
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
			</view>
			<view class="pageTwo" v-else-if="current === 1">
				<my-page ref="mypage"></my-page>
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
	import mypage from '../mypage/mypage.vue'
	
	
	export default {
		components: {
			'my-page': mypage
		},
		data() {
			return {
				current: 0,
				bgColor: '#ffffff',
				borderTop: true,
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
				imageURL: 'https://cdn.uviewui.com/uview/example/fade.jpg',
				backgroundSize: '100% 100%',
				name: 'checkmark-circle',
				userInfo: {},
				schedulingList: [
					{
						type: 0,
						backgroundColor: '#64EAA0',
						username: '牟鹏',
						schedulingName: '白班',
						starClockIn: '08:00',
						stopClockIn: '12:00'
					},
					{
						type: 0,
						backgroundColor: '#64EAA0',
						username: '牟鹏',
						schedulingName: '白班',
						starClockIn: '08:00',
						stopClockIn: '12:00'
					},
					{
						type: 0,
						backgroundColor: '#64EAA0',
						username: '牟鹏',
						schedulingName: '白班',
						starClockIn: '08:00',
						stopClockIn: '12:00'
					},
					{
						type: 0,
						backgroundColor: '#64EAA0',
						username: '牟鹏',
						schedulingName: '白班',
						starClockIn: '08:00',
						stopClockIn: '12:00'
					},
					{
						type: 0,
						backgroundColor: '#64EAA0',
						username: '牟鹏',
						schedulingName: '白班',
						starClockIn: '08:00',
						stopClockIn: '12:00'
					},
					{
						type: 0,
						backgroundColor: '#64EAA0',
						username: '牟鹏',
						schedulingName: '白班',
						starClockIn: '08:00',
						stopClockIn: '12:00'
					},
					{
						type: 0,
						backgroundColor: '#64EAA0',
						username: '牟鹏',
						schedulingName: '白班',
						starClockIn: '08:00',
						stopClockIn: '12:00'
					}
				]
			}
		},
		onLoad() {
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					console.log('res', res)
					this.res = res.data
					this.getUserInfo()
				}
			})
		},
		methods: {
			getUserInfo() {
				this.userInfo = this.res.userInfo
				if(!this.userInfo.hasOwnProperty('userpicPath')) {
					this.userInfo.userpicPath = '/static/default_avatar.jpg'
				}
				
				if (this.userInfo.certificateState === 0) {
					this.color = '#19be6b'
				} else if (this.userInfo.certificateState === 1) {
					this.color = '#ff9900'
				} else if (this.userInfo.certificateState === 2) {
					this.color = '#909399'
				}
				
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
					    url: '/pages/mailList/mailList'
					})
				}
			},
			beforeSwitch(index) {
				return true;
			}
		}
	}
</script>

<style scoped lang="scss">
	.content{
		height: 100%;
		
		.u-page{
			height: 100%;
			
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
									width: calc(100% - 130rpx);
									height: 100%;
									padding: 10rpx;
									
									.list-item-info-top{
										height: 50%;
										display: flex;
										align-items: center;
										
										text{
											padding-right: 20rpx;
											box-sizing: border-box;
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
			}
		}
	}
</style>
