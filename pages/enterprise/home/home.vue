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
						<text>{{userInfo.realName}}</text>
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
</template>

<script>
	import { state, mapMutations } from 'vuex'; 
	export default {
		data() {
			return {
				imageURL: 'https://cdn.uviewui.com/uview/example/fade.jpg',
				backgroundSize: '100% 100%',
				name: 'checkmark-circle',
				res: {},
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
		onReady() {
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					this.res = res.data
				}
			})
		},
		methods: {
			...mapMutations(['login']),
			getScheduling() {
				this.$http.post('/scheduling/findUserSchedulingBydeptId', {
					'unitId': this.res.userInfo.unitId
				}, {
					header: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
						'Authentication': this.res.token
					}
				}).then((res) => {
					console.log(res)
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
					    url: '/pages/mailList/mailList'
					})
				}
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
			padding: 20rpx;
			
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
</style>
