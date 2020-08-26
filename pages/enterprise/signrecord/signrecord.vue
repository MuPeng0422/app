<template>
    <view class="content">
    	<view class="sign-total">
    		<view class="sign-btn" v-for="(item, index) in signList" :key="index">
    			<view class="num">
    				{{ item.num }}
    			</view>
				<view class="name">
					{{ item.name }}
				</view>
    		</view>
    	</view>
		<view class="calendar">
			<uni-calendar
			:insert="true" 
			:selected="selected"
			@change="change"
			 ></uni-calendar>
		</view>
		<view class="sign-info" v-show="show">
			<view class="item" v-for="(item, index) in data" :key="index">
				<view class="item-title">
					<view>
						打卡记录
					</view>
					<view>
						{{ date }}
					</view>
				</view>
				<view class="item-content">
					<view class="item-content-avatar1">
						<u-avatar :src="item.avatar"></u-avatar>
					</view>
					<view class="item-content-info">
						<view class="item-content-info-t">
							<view class="item-content-info-t-l">
								<view class="name-attendance">
									<view class="name">
										{{ item.username }}
									</view>
									<view class="attendance">
										{{ item.attendance }}
									</view>
								</view>
							</view>
							<view class="item-content-info-t-r">
								上班时间：{{ item.sbTime }}
							</view>
						</view>
						<view class="item-content-info-b">
							<view class="item-content-info-t-l">
								{{ item.cert }}
							</view>
							<view class="item-content-info-t-r">
								下班时间：{{ item.xbTime }}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
    </view>
</template>

<script>
    import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
    export default {
        components: {
            uniCalendar
        },
        data() {
			return {
				signList: [
					{
						num: '25',
						name: '正常'
					},
					{
						num: '1',
						name: '请假'
					},
					{
						num: '3',
						name: '缺勤'
					}
				],
				show: false,
				selected: [
					{
						date: '2020-08-01',
						data: [
							{
								id: 0,
								avatar: '/static/default_avatar.jpg',
								username: '李霜双',
								attendance: '白班',
								sbTime: '08:54',
								xbTime: '未打卡',
								cert: '中级消防证书'
							},
							{
								id: 1,
								avatar: '/static/default_avatar.jpg',
								username: '李丹',
								attendance: '白班',
								sbTime: '未打卡',
								xbTime: '未打卡',
								cert: '中级消防证书'
							}
						]
					}, {
						date: '2020-08-05',
						data: [
							{
								id: 0,
								avatar: '',
								username: '王鑫',
								attendance: '白班',
								sbTime: '08:54',
								xbTime: '未打卡',
								cert: '中级消防证书'
							},
							{
								id: 1,
								avatar: '',
								username: '卫振鹏',
								attendance: '白班',
								sbTime: '未打卡',
								xbTime: '未打卡',
								cert: '中级消防证书'
							}
						]
					}
				],
				date: '',
				data: []
			}
		},
        methods: {
            change(e) {
				this.show = true
				this.date = e.extraInfo.date
				this.data = e.extraInfo.data
            },
			handleClickSign() {
				uni.navigateTo({
				    url: '/pages/patchSign/patchSign'
				})
			},
			goAddSignRecord() {
				uni.navigateTo({
				    url: '/pages/patchsignrecord/patchsignrecord'
				})
			}
        }
    };
</script>
	
<style lang="scss" scoped>
	.content{
		height: 100%;
		background-color: #FFFFFF;
		
		.sign-total{
			height: 200rpx;
			padding: 20rpx;
			border-bottom: 1rpx solid #c8c7cc;
			display: flex;
			align-items: center;
			justify-content: space-between;
			
			.sign-btn{
				width: 130rpx;
				height: 130rpx;
				border-radius: 50%;
				background-color: #5677FC;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				color: #FFFFFF;
				
				.num{
					font-size: 48rpx;
					font-weight: bold;
				}
				
				.name{
					font-size: 20rpx;
				}
			}
			
		}
		
		.sign-info{
			padding: 20rpx;
			background-color: #FFFFFF;
			border-top: 1rpx solid #c8c7cc;
			
			.item{
				height: 200rpx;
				margin-bottom: 20rpx;
				border: 1rpx solid #BEBEBE;
				
				.item-title{
					display: flex;
					align-items: center;
					justify-content: space-between;
					height: 50rpx;
					padding: 0 20rpx;
					background-color: #C1CDD1;
				}
				
				.item-content{
					display: flex;
					justify-content: space-between;
					
					.item-content-avatar1{
						width: 150rpx;
						height: 150rpx;
						display: flex;
						justify-content: center;
						align-items: center;
					}
					
					.item-content-info{
						width: calc(100% - 150rpx);
						padding: 20rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-around;
						
						.item-content-info-t{
							display: flex;
							justify-content: space-between;
							
							.item-content-info-t-l{
								width: 50%;
								display: flex;
								justify-content: space-between;
								
								.name-attendance{
									width: 70%;
									display: flex;
									justify-content: space-between;
								}
							}
							
							.item-content-info-t-r{
								width: 50%;
								padding-left: 20rpx;
							}
						}
						
						.item-content-info-b{
							display: flex;
							justify-content: space-between;
							
							.item-content-info-t-l{
								width: 50%;
							}
							
							.item-content-info-t-r{
								width: 50%;
								padding-left: 20rpx;
							}
						}
					}
				}
			}
		}
	}
</style>