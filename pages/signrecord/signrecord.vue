<template>
    <view class="content">
    	<view class="sign-total">
    		<view class="total">
    			<view class="title">
    				考勤统计
    			</view>
    			<view class="total-num">
    				<view class="late">
    					本月迟到<span>{{ late }}</span>次
    				</view>
    				<view class="nosign">
    					本月迟到<span>{{ nosign }}</span>次
    				</view>
    			</view>
    		</view>
			<view class="addsignrecord" @click="goAddSignRecord">
				<text>补卡记录</text>
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
			<view class="item">
				<view class="sign-time">
					上班打卡： {{ data.sbtime }}
				</view>
				<view class="sign-btn" v-show="data.sbstatus">
					<u-button type="primary" size="mini" @click="handleClickSign">上班补卡</u-button>
				</view>
			</view>
			<view class="item">
				<view class="sign-time">
					下班打卡： {{ data.xbtime }}
				</view>
				<view class="sign-btn" v-show="data.xbstatus">
					<u-button type="primary" size="mini" @click="handleClickSign">下班补卡</u-button>
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
				late: 2,
				nosign: 1,
				show: false,
				selected: [
					{
						date: '2020-08-01',
						data: {
							sbstatus: false,
							xbstatus: true,
							sbtime: '09:10:56',
							xbtime: '06:15:12'
						}
					}, {
						date: '2020-08-05',
						data: {
							sbstatus: true,
							xbstatus: false,
							sbtime: '08:29:15',
							xbtime: '07:45:37'
						}
					}
				],
				data: {}
			}
		},
        methods: {
            change(e) {
				this.show = true
                console.log(e);
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
			padding: 20rpx;
			background-color: #fff;
			border-bottom: 1rpx solid #c8c7cc;
			display: flex;
			justify-content: space-between;
			
			.total{
				.title{
					font-weight: bolder;
				}
				
				.total-num{
					padding: 20rpx;
					
					span{
						padding: 0 10rpx;
					}
				}
			}
			
			.addsignrecord{
				display: flex;
				align-items: center;
				
				text{
					color: #2979ff;
				}
			}
		}
		
		.sign-info{
			padding: 20rpx;
			background-color: #fff;
			border-top: 1rpx solid #c8c7cc;
			
			.item{
				height: 60rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
		}
	}
</style>