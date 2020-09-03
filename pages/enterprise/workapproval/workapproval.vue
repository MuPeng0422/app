<template>
	<view class="content">
		<view class="u-tabs-box">
			<u-tabs-swiper activeColor="#f29100" ref="uTabs" :list="tablist" :bold="false" :current="current" @change="tabsChange" :is-scroll="false" bar-width="200" swiperWidth="750"></u-tabs-swiper>
		</view>
		<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item">
				<scroll-view scroll-y style="height: 100%;width: 100%;">
					<view class="page-box">
						<view class="pending-approval  u-margin-top-20" v-if="pending === true">
							<view class="pending-approval-item" v-for="(item, index) in pendinglist" :key="index">
								<view class="pending-approval-item-avatar">
									<view class="item-avatar">
										<view class="avatar">
											<u-avatar :src="item.userPic" size="60" mode="square"></u-avatar>
										</view>
										<view class="username">
											{{ item.userName }}
										</view>
									</view>
								</view>
								<view class="pending-approval-info">
									<view class="pending-approval-info-reason">
										{{ item.applicationCause }}
									</view>
									<view class="pending-approval-info-btn">
										<u-button :type="item.type" size="mini" @click="handleClickItem(item)">{{ item.status }}</u-button>
									</view>
								</view>
							</view>
						</view>
						<view class="pending-approval u-margin-top-20" v-else>
							<view class="empty">
								<view>
									<u-empty text="暂无数据" mode="data"></u-empty>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
					<view class="page-box">
						<view class="pending-search">
							<view class="pending-search-box">
								<view class="search-input">
									<u-input v-model="search.startTime" height="60" placeholder="开始时间" type="text" :border="true" :disabled="true" @click="selectStartTime"/>
								</view>
								<view class="search-input">
									<u-input v-model="search.endTime" height="60" placeholder="结束时间" type="text" :border="true" :disabled="true" @click="selectEndTime"/>
								</view>
								<view class="search-btn">
									<u-button type="success" :custom-style="customStyle" size="mini" @click="handleClickSearch">搜索</u-button>
								</view>
							</view>
						</view>
						<view class="pending-search-list" v-if="alreadyList.length > 0">
							<view class="pending-approval-item" v-for="(item, index) in alreadyList" :key="index">
								<view class="pending-approval-item-avatar">
									<view class="item-avatar">
										<view class="avatar">
											<u-avatar :src="item.userPic" size="60" mode="square"></u-avatar>
										</view>
										<view class="username">
											{{ item.userName }}
										</view>
									</view>
								</view>
								<view class="pending-approval-info">
									<view class="pending-approval-info-reason">
										{{ item.applicationCause }}
									</view>
									<view class="pending-approval-info-btn">
										<u-button :type="item.type" size="mini" @click="handleClickItem(item)">{{ item.status }}</u-button>
									</view>
								</view>
							</view>
						</view>
						<view class="pending-approval" v-else>
							<view class="empty">
								<view>
									<u-empty text="暂无数据" mode="data"></u-empty>
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
						<u-input v-model="popup.applicationCause" type="textarea" height="100" :auto-height="true" :border="true" :disabled="true" />
					</view>
				</view>
				<view class="submitBtn">
					<view class="btn">
						<u-button type="error" @click="handleClickApproval(popup, 2)">驳回</u-button>
					</view>
					<view class="btn">
						<u-button type="primary" @click="handleClickApproval(popup, 1)">通过</u-button>
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
				type: '',
				status: '',
				typeList: ['primary', 'success', 'warning'],
				statusList: ['待处理', '已通过', '已驳回'],
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
				pending: false,
				already: false,
				pendinglist: [],
				alreadyList: [],
				show: false
			}
		},
		onLoad() {
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					this.res = res.data
					console.log(this.res)
					this.getDataList()
				}
			})
		},
		onReady() {
			let nowTime = new Date()
			let year = nowTime.getFullYear()
			let month = nowTime.getMonth() + 1
			let day = nowTime.getDate()
			const defaultTime = year + '-' + month + '-' + day
			this.defaultTime = defaultTime
		},
		methods: {
			getDataList() {
				this.$http.post('/application/findApplyByUnitId', {
					'unitId': this.res.userInfo.unitId
				}, {
					header: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
						'Authentication': this.res.token
					}
				}).then((res) => {
					if (res.data.code === 200) {
						for (var i = 0; i < res.data.data.length; i++) {
							if (res.data.data[i].applicationState === 0) {
								this.type = this.typeList[0]
								this.status = this.statusList[0]
								res.data.data[i].type = this.type
								res.data.data[i].status = this.status
								this.pendinglist.push(res.data.data[i])
							} else if (res.data.data[i].applicationState === 1) {
								this.type = this.typeList[1]
								this.status = this.statusList[1]
								res.data.data[i].type = this.type
								res.data.data[i].status = this.status
								this.alreadyList.push(res.data.data[i])
							} else {
								this.type = this.typeList[2]
								this.status = this.statusList[2]
								res.data.data[i].type = this.type
								res.data.data[i].status = this.status
								this.alreadyList.push(res.data.data[i])
							}
						}
						
						if (this.pendinglist.length > 0) {
							this.pending = true
						}
						
						if (this.alreadyList.length > 0) {
							this.already = true
						}
					} else {
						this.$u.toast(res.data.message)
					}
				})
			},
			handleClickApproval(popup, index) {
				this.$http.post('/application/audit', {
					'id': popup.id,
					'applicationState': index 
				}, {
					header: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
						'Authentication': this.res.token
					}
				}).then((res) => {
					if (res.data.code === 200) {
						this.show = false
						let pages = getCurrentPages(); // 当前页面
						console.log(pages)
						let beforePage = pages[pages.length - 2]; // 前一个页面
						console.log(beforePage)
						// uni.navigateBack({
						//     success: function() {
						//         beforePage.onLoad(); // 执行前一个页面的onLoad方法
						//     }
						// });
					}
				})
			},
			handleClickSearch() {
				this.$http.post('/application/findApplyByUnitId', {
					'unitId': this.res.userInfo.unitId,
					'startTime': this.search.startTime,
					'endTime': this.search.endTime
				}, {
					header: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
						'Authentication': this.res.token
					}
				}).then((res) => {
					console.log(res)
					if (res.data.code === 200) {
						this.alreadyList = []
						if (res.data.code === 200) {
							for (var i = 0; i < res.data.data.length; i++) {
								if (res.data.data[i].applicationState === 1) {
									this.type = this.typeList[1]
									this.status = this.statusList[1]
									res.data.data[i].type = this.type
									res.data.data[i].status = this.status
									this.alreadyList.push(res.data.data[i])
								} else {
									this.type = this.typeList[2]
									this.status = this.statusList[2]
									res.data.data[i].type = this.type
									res.data.data[i].status = this.status
									this.alreadyList.push(res.data.data[i])
								}
							}	
						} else {
							this.$u.toast(res.data.message)
						}
					}
				})
			},
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
				this.search.startTime = obj.year + '-' + obj.month + '-' + obj.day
			},
			getEndTime(obj) {
				console.log(obj)
				this.search.endTime = obj.year + '-' + obj.month + '-' + obj.day
			},
			handleClickItem(row) {
				this.show = true
				this.popup = row
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
				height: 100%;
				
				.pending-approval{
					
					.pending-approval-item{
						height: 150rpx;
						display: flex;
						justify-content: space-between;
						border-bottom: 1rpx solid #c8c7cc;
						
						&:first-child {
							border-top: 1rpx solid #c8c7cc;
						}
						
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
					
					.empty{
						padding-top: 100rpx;
						display: flex;
						align-items: center;
						justify-content: center;
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
				
				.pending-search-list{
					
					.pending-approval-item{
						height: 150rpx;
						display: flex;
						justify-content: space-between;
						border-bottom: 1rpx solid #c8c7cc;
						
						&:first-child {
							border-top: 1rpx solid #c8c7cc;
						}
						
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
