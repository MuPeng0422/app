<template>
	<view class="content">
		<view class="u-tabs-box">
			<u-tabs-swiper activeColor="#f29100" ref="uTabs" :list="tablist" :bold="false" :current="current" @change="tabsChange" :is-scroll="false" bar-width="200" swiperWidth="750"></u-tabs-swiper>
		</view>
		<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item leave">
				<scroll-view scroll-y style="height: 100%;width: 100%;">
					<view class="page-box">
						<!-- <view class="form-item itemType">
							<view class="label">
								请假类型
							</view>
							<view class="type">
								<u-input :border="true" type="select" :select-open="actionSheetShow" v-model="type" placeholder="请选择请假类型" @click="actionSheetShow = true"></u-input>
							</view>
						</view> -->
						<view class="form-item">
							<view class="label">
								请假时间
							</view>
							<view class="list">
								<view class="time start-time">
									<view class="text">
										开始时间：
									</view>
									<view class="input">
										<u-input v-model="startTime" type="text" placeholder="请选择开始时间" :border="true" @click="selectStartTime"/>
									</view>
								</view>
								<view class="time end-time">
									<view class="text">
										结束时间：
									</view>
									<view class="input">
										<u-input v-model="endTime" type="text" placeholder="请选择结束时间" :border="true" @click="selectEndTime"/>
									</view>
								</view>
							</view>
						</view>
						<view class="form-item itemReason">
							<view class="label">
								请假事由
							</view>
							<view class="reason">
								<u-input v-model="reason" type="textarea" placeholder="请输入请假事由" height="100" :auto-height="true" :border="true"/>
							</view>
						</view>
						<view class="submitBtn">
							<u-button type="primary" @click="submit">提交申请</u-button>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item class="swiper-item ">
				<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
					<view class="page-box itemList">
						<view class="lists-item" v-for="(item, index) in lists" :key="index" @click="getItem(item)">
							<view class="item-left">
								<view class="cell">
									始 {{ item.startTime }}
								</view>
								<view class="cell">
									止 {{ item.endTime }}
								</view>
							</view>
							<view class="item-right">
								{{ item.applicationState }}
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		
		<u-popup v-model="show" width="80%" height="80%" mode="center" :safe-area-inset-bottom="true" border-radius="14" :closeable="true">
			<view class="popup-container">
				<!-- <view class="col itemType">
					<view class="label">
						请假类型
					</view>
					<view class="type">
						<u-input :border="true" type="text" v-model="popupType" placeholder="请选择请假类型" :disabled="true" />
					</view>
				</view> -->
				<view class="col">
					<view class="label">
						请假时间
					</view>
					<view class="list">
						<view class="time start-time">
							<view class="text">
								开始时间：
							</view>
							<view class="input">
								<u-input v-model="popup.startTime" type="text" placeholder="请选择开始时间" :border="true" :disabled="true" />
							</view>
						</view>
						<view class="time end-time">
							<view class="text">
								结束时间：
							</view>
							<view class="input">
								<u-input v-model="popup.endTime" type="text" placeholder="请选择结束时间" :border="true" :disabled="true" />
							</view>
						</view>
					</view>
				</view>
				<view class="col itemReason">
					<view class="label">
						请假事由
					</view>
					<view class="reason">
						<u-input v-model="popup.applicationCause" type="textarea" placeholder="请输入请假事由" height="100" :auto-height="true" :border="true" :disabled="true" />
					</view>
				</view>
			</view>
		</u-popup>
		
		<u-action-sheet :list="actionSheetList" v-model="actionSheetShow" @click="actionSheetCallback"></u-action-sheet>
		<u-picker mode="time" v-model="startshow" :default-time="defaultTime" :params="params" @confirm="getStartTime"></u-picker>
		<u-picker mode="time" v-model="endshow" :default-time="defaultTime" :params="params" @confirm="getEndTime"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				res: {},
				current: 0,
				swiperCurrent: 0,
				startshow: false,
				endshow: false,
				defaultTime: '',
				type: '',
				startTime: '',
				endTime: '',
				reason: '',
				popup: {},
				tablist: [
					{
						name: '我要请假'
					},
					{
						name: '请假记录'
					}
				],
				actionSheetList: [
					{
						text: '事假',
						type: 1,
					},
					{
						text: '病假',
						type: 2,
					},
					{
						text: '丧假',
						type: 3,
					},
					{
						text: '其他',
						type: 4,
					}
				],
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false
				},
				lists: [],
				show: false
			}
		},
		onLoad() {
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					this.res = res.data
					this.getLists()
				}
			})
		},
		onReady() {
			let nowTime = new Date()
			let year = nowTime.getFullYear()
			let month = nowTime.getMonth()
			let day = nowTime.getDate()
			let hours = nowTime.getHours()
			let minutes = nowTime.getMinutes()
			const defaultTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes
			this.defaultTime = defaultTime
		},
		methods: {
			// tab栏切换
			// tabs通知swiper切换
			tabsChange(index) {
				console.log(index)
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
			// 点击actionSheet回调
			actionSheetCallback(index) {
				uni.hideKeyboard();
				this.type = this.actionSheetList[index].text;
			},
			selectStartTime() {
				this.startshow = true
			},
			selectEndTime() {
				this.endshow = true
			},
			getStartTime(obj) {
				this.startTime = obj.year + '-' + obj.month + '-' + obj.day + ' ' + obj.hour + ':' + obj.minute
			},
			getEndTime(obj) {
				this.endTime = obj.year + '-' + obj.month + '-' + obj.day + ' ' + obj.hour + ':' + obj.minute
			},
			getItem(obj) {
				console.log(obj)
				this.show = true
				this.popup = obj
			},
			getLists() {
				this.$http.post('/application/findUserApply', {
					'userId': this.res.userInfo.userId
				}, {
					header: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
						'Authentication': this.res.token
					}
				}).then((res) => {
					if (res.data.code === 200) {
						for (var i = 0; i < res.data.data.length; i++) {
							if (res.data.data[i].applicationState === 0) {
								res.data.data[i].applicationState = '待审核'
							} else if (res.data.data[i].applicationState === 1) {
								res.data.data[i].applicationState = '审核通过'
							} else if (res.data.data[i].applicationState === 2) {
								res.data.data[i].applicationState = '不通过'
							}
						}
						this.lists = res.data.data
					}
				})
			},
			submit() {
				const data = {
					'userId': this.res.userInfo.userId,
					'userName': this.res.userInfo.username,
					'startTime': this.startTime,
					'endTime': this.endTime,
					'applicationCause': this.reason,
					'applicationType': 1
				}
				
				this.$http.post('/application/add', data, {
					header: {
						'Authentication': this.res.token
					}
				}).then((res) => {
					if (res.data.code === 200) {
						uni.showToast({
							title: res.data.message,
							icon: 'block',
							duration: 1000,
							success: (res) => {
								setTimeout(() => {
									uni.navigateBack()
								}, 1000)
							}
						})
					}
				})
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		height: 100%;
		margin-top: 10rpx;
		
		.swiper-box{
			height: 100%;
			background-color: #FFFFFF;
			
			.leave{
				padding: 20rpx;
				box-sizing: border-box;
			}
		}
		
		.popup-container{
			padding: 100rpx 20rpx;
			
			.col{
				margin-bottom: 30rpx;
				
				.label{
					width: 150rpx;
					font-weight: bold;
					margin-bottom: 10rpx;
				}
				
				.list{
					
					.time{
						display: flex;
						align-items: center;
						justify-content: flex-start;
						margin-bottom: 20rpx;
						
						.text{
							width: 150rpx;
						}
						
						.input{
							width: calc(100% - 150rpx);
						}
					}
					
				}
				
				.type{
					width: calc(100% - 150rpx);
				}
				
				.reason{
					width: calc(100% - 150rpx);
				}
			}
		}
		
		.form-item{
			margin-bottom: 30rpx;
			
			.label{
				width: 150rpx;
				font-weight: bold;
				margin-bottom: 10rpx;
			}
			
			.list{
				
				.time{
					display: flex;
					align-items: center;
					justify-content: flex-start;
					margin-bottom: 20rpx;
					
					.text{
						width: 150rpx;
					}
					
					.input{
						width: calc(100% - 150rpx);
					}
				}
				
			}
			
			.type{
				width: calc(100% - 150rpx);
			}
			
			.reason{
				width: calc(100% - 150rpx);
			}
		}
		
		.submitBtn{
			width: 300rpx;
			margin: 200rpx auto 0;
		}
		
		.itemType{
			display: flex;
			align-items: center;
		}
		
		.itemReason{
			display: flex;
		}
		
		.itemList{
			width: 100%;
			height: 100%;
			padding: 20rpx;
			box-sizing: border-box;
			
			.lists-item{
				padding: 50rpx 0;
				display: flex;
				align-items: center;
				justify-content: space-around;
				border-bottom: 1rpx solid #c8c7cc;
			}
		}
	}
</style>
