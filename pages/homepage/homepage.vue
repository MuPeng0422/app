<template>
	<view class="container">
		<view class="head" :style="{background: 'url('+ imageURL +')', backgroundSize: backgroundSize}">
			<view class="avatar u-flex">
				<view class="avatar-img">
					<u-avatar class="img" :src="userInfo.src"></u-avatar>
				</view>
				<view class="avatar-text">
					<view class="company">
						{{userInfo.company}}
					</view>
					<view class="name">
						<text>{{userInfo.name}}</text>
						<u-icon :name="name" size="40" color="#19be6b"></u-icon>
					</view>
				</view>
				<view class="avatar-integral">
					{{userInfo.integral}}积分
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
					<u-tabs-swiper ref="uTabs" :list="list" :bar-width="width" :current="current" @change="tabsChange" :is-scroll="false"
					 swiperWidth="750"></u-tabs-swiper>
				</view>
				<swiper class="swiper" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
					<swiper-item class="swiper-item">
						<scroll-view scroll-y class="swiper-item-scroll" @scrolltolower="reachBottom">
							<view class="isLogin" v-if="isSignIn">
								<view v-for="(item,index) in dataList[0]" class="dataList" :key="index">
									<view class="dataListItem u-flex u-row-between" v-if="item.type === 0">
										<view class="item-img">
											<u-image width="100%" height="100%" :src="item.src" :lazy-load="true">
												<u-loading slot="loading"></u-loading>
											</u-image>
										</view>
										<view class="item-info">
											<view class="item-info-title">
												{{item.text}}
											</view>
											<view class="item-info-bottom">
												<view class="number">
													{{item.number}}积分
												</view>
												<view class="btn">
													<u-button type="primary" size="mini" @click="startStudy">立即学习</u-button>
												</view>
											</view>
										</view>
									</view>
									<view class="dataListItem" v-else>
										<view class="item-text">
											<view class="item-text-top">
												{{item.text}}
											</view>
											<view class="item-text-bottom">
												<view class="number">
													{{item.number}}积分
												</view>
												<view class="btn">
													<u-button type="primary" size="mini" @click="startStudy">立即学习</u-button>
												</view>
											</view>
										</view>
									</view>
								</view>
								<u-loadmore :status="loadStatus[0]" bgColor="#f2f2f2"></u-loadmore>
							</view>
							<view class="noLogin" v-else>
								<view class="patchsign">
									<text>需要打卡后才可以学习哦~</text>
									<view class="btn">
										<u-button type="primary" @click="goToWork">立即前往打卡</u-button>
									</view>
								</view>
								<view class="scheduling">
									<view class="scheduling-title">
										我的排班
									</view>
									<view class="scheduling-list">
										<view class="scheduling-list-item">
											<view class="u-body-item u-flex u-border-bottom u-col-between u-p-t-0">
												<image src="https://img11.360buyimg.com/n7/jfs/t1/94448/29/2734/524808/5dd4cc16E990dfb6b/59c256f85a8c3757.jpg" mode="aspectFill"></image>
												<view class="u-body-item-title u-line-2">
													瓶身描绘的牡丹一如你初妆，冉冉檀香透过窗心事我了然，宣纸上走笔至此搁一半
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
								<view v-for="(item,index) in dataList[0]" class="dataList" :key="index">
									<view class="dataListItem u-flex u-row-between">
										<view class="item-img">
											<u-image width="100%" height="100%" :src="item.src" :lazy-load="true">
												<u-loading slot="loading"></u-loading>
											</u-image>
										</view>
										<view class="item-info">
											<view class="item-info-title">
												{{item.text}}
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
	export default {
		data() {
			return {
				isSignIn: false,
				text: '无头像',
				imageURL: 'https://cdn.uviewui.com/uview/example/fade.jpg',
				backgroundSize: '100% 100%',
				name: 'checkmark-circle',
				userInfo: {
					src: '',
					name: '',
					company: '世纪金花(高新店)',
					integral: '15603'
				},
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
				dataList: [[], []],
				data: [
					{
						src: 'https://cdn.uviewui.com/uview/example/fade.jpg',
						number: 10,
						type: 1,
						text: '此组件内部使用uni-appbutton组件为基础utton组件为基础utton组件为基础，除了开头中所说的增加的功能，另外暴露出来的props属性和官方组件的属性完全一致， uni-appbutton组件比较特殊'
					},
					{
						src: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596689659408&di=8d200a54117ae26d52c6d7f75a4ea200&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F2a4ef1a24092aaa2211638e3e481b9ff454542d21a11-l6aRWH_fw658',
						number: 10,
						type: 0,
						text: '此组件内部使用uni-appbutton组件为基础，除了开头中所说的增加的功能，另外暴露出来的props属性和官方组件的属性完全一致， uni-appbutton组件比较特殊'
					},
					{
						src: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596689659408&di=8d200a54117ae26d52c6d7f75a4ea200&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F2a4ef1a24092aaa2211638e3e481b9ff454542d21a11-l6aRWH_fw658',
						number: 10,
						type: 0,
						text: '此组件内部使用uni-appbutton组件为基础，除了开头中所说的增加的功能，另外暴露出来的props属性和官方组件的属性完全一致， uni-appbutton组件比较特殊'
					},
					{
						src: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596689659408&di=8d200a54117ae26d52c6d7f75a4ea200&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F2a4ef1a24092aaa2211638e3e481b9ff454542d21a11-l6aRWH_fw658',
						number: 10,
						type: 0,
						text: '此组件内部使用uni-appbutton组件为基础，除了开头中所说的增加的功能，另外暴露出来的props属性和官方组件的属性完全一致， uni-appbutton组件比较特殊'
					},
					{
						src: 'https://cdn.uviewui.com/uview/example/fade.jpg',
						number: 10,
						type: 0,
						text: '此组件内部使用uni-appbutton组件为基础，除了开头中所说的增加的功能，另外暴露出来的props属性和官方组件的属性完全一致， uni-appbutton组件比较特殊'
					},
					{
						src: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596689659408&di=8d200a54117ae26d52c6d7f75a4ea200&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F2a4ef1a24092aaa2211638e3e481b9ff454542d21a11-l6aRWH_fw658',
						number: 10,
						type: 0,
						text: '此组件内部使用uni-appbutton组件为基础，除了开头中所说的增加的功能，另外暴露出来的props属性和官方组件的属性完全一致， uni-appbutton组件比较特殊'
					},
					{
						src: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596689659408&di=8d200a54117ae26d52c6d7f75a4ea200&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F2a4ef1a24092aaa2211638e3e481b9ff454542d21a11-l6aRWH_fw658',
						number: 10,
						type: 0,
						text: '此组件内部使用uni-appbutton组件为基础，除了开头中所说的增加的功能，另外暴露出来的props属性和官方组件的属性完全一致， uni-appbutton组件比较特殊'
					},
					{
						src: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596689659408&di=8d200a54117ae26d52c6d7f75a4ea200&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F2a4ef1a24092aaa2211638e3e481b9ff454542d21a11-l6aRWH_fw658',
						number: 10,
						type: 0,
						text: '此组件内部使用uni-appbutton组件为基础，除了开头中所说的增加的功能，另外暴露出来的props属性和官方组件的属性完全一致， uni-appbutton组件比较特殊'
					}
				],
				loadStatus: ['loadmore', 'loading', 'nomore'],
				pageNo: 1,
				pageSize: 10,
				modelshow: false,
				xbtitle: '您今日还有未完成任务，完成后才能打卡哦~',
				timelong: '9/15'
			}
		},
		onReady() {
			this.getUserInfo()
			this.getStudyData()
		},
		methods: {
			getUserInfo() {
				this.userInfo.src = this.$store.state.wxUserInfo.avatarUrl
				this.userInfo.name = this.$store.state.wxUserInfo.nickName
			},
			startStudy() {
				uni.navigateTo({
				    url: '/pages/study/study'
				})
			},
			next() {
				uni.navigateTo({
				    url: '/pages/gooutwork/gooutwork'
				})
			},
			startExam() {
				uni.navigateTo({
				    url: '/pages/answer/answer'
				})
			},
			getStudyData() {
				this.dataList[this.current] = this.data
				this.loadStatus.splice(this.current, 1, "loadmore")
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
					this.pageNo++
					this.getStudyData()
				}, 1200)
			},
			handleClickBtn(type) {
				console.log(type)
				if (this.isSignIn) {
					if (type === 'goToWork') {
						uni.navigateTo({
						    url: '/pages/gotowork/gotowork'
						})
					} else if (type === 'goOutWork') {
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
								padding: 50rpx 10rpx;
								
								.scheduling-title{
									font-size: 36rpx;
									font-weight: bolder;
								}
								
								.u-card-wrap {
									background-color: $u-bg-color;
									padding: 1px;
								}
								
								.u-body-item {
									font-size: 32rpx;
									color: #333;
									padding: 20rpx 10rpx;
								}
									
								.u-body-item image {
									width: 120rpx;
									flex: 0 0 120rpx;
									height: 120rpx;
									border-radius: 50%;
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
