<template>
	<view class="content">
		<view class="u-tabs-box">
			<u-tabs-swiper activeColor="#f29100" ref="uTabs" :list="tablist" :bold="false" :current="current" @change="tabsChange" :is-scroll="false" bar-width="200" swiperWidth="750"></u-tabs-swiper>
		</view>
		<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item">
				<scroll-view scroll-y style="height: 100%;width: 100%;">
					<view class="page-box">
						<view class="pending-approval">
							<view class="pending-approval-item" v-for="(item, index) in datalist" :key="index">
								<view class="pending-approval-item-avatar">
									<view class="item-avatar">
										<view class="avatar">
											<u-avatar :src="item.src" size="60" mode="square"></u-avatar>
										</view>
										<view class="username">
											{{ item.username }}
										</view>
									</view>
								</view>
								<view class="pending-approval-info">
									<view class="pending-approval-info-reason">
										{{ item.reason }}
									</view>
									<view class="pending-approval-info-btn">
										<u-button type="primary" size="mini" @click="handleClickItem(item)">待处理</u-button>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item class="swiper-item ">
				<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
					<view class="page-box">
						<view class="pending-search">
							<view class="pending-search-box">
								<view class="search-input">
									<u-input v-model="search.startTime" height="60" placeholder="开始时间" type="text" :border="true" @click="selectStartTime"/>
								</view>
								<view class="search-input">
									<u-input v-model="search.endTime" height="60" placeholder="结束时间" type="text" :border="true" @click="selectEndTime"/>
								</view>
								<view class="search-btn">
									<u-button type="success" :custom-style="customStyle" size="mini">搜索</u-button>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		
		<u-popup v-model="show" width="80%" mode="center" :safe-area-inset-bottom="true" border-radius="14" :closeable="true">
			<view class="popup-container">
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
								<u-input v-model="popup.startTime" type="text" :border="true" :disabled="true" />
							</view>
						</view>
						<view class="time end-time">
							<view class="text">
								结束时间：
							</view>
							<view class="input">
								<u-input v-model="popup.endTime" type="text" :border="true" :disabled="true" />
							</view>
						</view>
					</view>
				</view>
				<view class="col itemReason">
					<view class="label">
						请假事由
					</view>
					<view class="reason">
						<u-input v-model="popup.reason" type="textarea" height="100" :auto-height="true" :border="true" :disabled="true" />
					</view>
				</view>
				<view class="submitBtn">
					<view class="btn">
						<u-button type="error">驳回</u-button>
					</view>
					<view class="btn">
						<u-button type="primary">通过</u-button>
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
				customStyle: {
					width: '100rpx',
					height: '60rpx'
				},
				popup: {},
				search: {},
				tablist: [
					{
						name: '待审批'
					},
					{
						name: '已处理'
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
					hour: false,
					minute: false,
					second: false
				},
				lists: [],
				datalist: [
					{
						src: '',
						username: '刘大招',
						reason: '身体不舒服身体不舒服身体不舒服身体不舒服身体不舒服身体不舒服',
						startTime: '2020年7月6日 20时7分6秒',
						endTime: '2020年7月6日 20时7分6秒'
					},
					{
						src: '',
						username: '刘大招',
						reason: '身体不舒服',
						startTime: '2020年7月6日 20时7分6秒',
						endTime: '2020年7月6日 20时7分6秒'
					}
				],
				show: false
			}
		},
		onLoad() {
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					this.res = res.data
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
			handleClickItem(row) {
				this.show = true
				this.popup.startTime = row.startTime
				this.popup.endTime = row.endTime
				this.popup.reason = row.reason
				console.log(row)
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
			
			.page-box{
				.pending-approval{
					border-top: 1rpx solid #999999;
					margin: 20rpx 0;
					
					.pending-approval-item{
						height: 150rpx;
						display: flex;
						justify-content: space-between;
						border-bottom: 1rpx solid #999999;
						
						.pending-approval-item-avatar{
							width: 200rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							
							.item-avatar{
								.avatar{
									text-align: center;
								}
							}
						}
						
						.pending-approval-info{
							width: calc(100% - 200rpx);
							padding: 40rpx 40rpx 40rpx 0rpx;
							display: flex;
							align-items: center;
							justify-content: space-between;
							
							.pending-approval-info-reason{
								width: calc(100% - 100rpx);
								padding-right: 20rpx;
								overflow: hidden;
								text-overflow:ellipsis;
								white-space: nowrap;
							}
							
							.pending-approval-info-btn{
								width: 100rpx;
							}
						}
					}
				}
				
				.pending-search{
					.pending-search-box{
						padding: 20rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						
						.search-input{
							padding-right: 20rpx;
						}
						.search-btn{
							height: 60rpx;
						}
					}
				}
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
					width: 100%;
				}
			}
			
			.submitBtn{
				width: 100%;
				margin: 100rpx 0;
				display: flex;
				justify-content: space-around;
				
				.btn{
					width: 40%;
				}
			}
		}
	}
</style>
