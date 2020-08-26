<template>
    <view class="content">
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
				<view class="sign-time">
					下班打卡： {{ data.xbtime }}
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
				res: {},
				late: 2,
				nosign: 1,
				show: false,
				selected: [],
				data: {}
			}
		},
		onLoad(data) {
			const item = JSON.parse(decodeURIComponent(data.data));
			this.res = item
			this.getAttendance()
		},
        methods: {
			getAttendance() {
				this.$http.post('/attendance/findUserAttendance', {
					'userId': this.res.data.user.userId
				}, {
					header: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
						'Authentication': this.res.data.token
					}
				}).then((res) => {
					console.log(res)
					for (var i = 0; i < res.data.data.length; i++) {
						const row = {
							date: '',
							data: {
								sbtime: '',
								xbtime: ''
							}
						}
						if (res.data.data[i].type === 1) {
							const data = res.data.data[i].goWorkTime.split(' ')
							console.log(data)
							row.date = data[0]
							row.data.sbtime = data[1]
							row.info = '迟到'
							
						} else if (res.data.data[i].type === 2) {
							const data = res.data.data[i].outWorkTime.split(' ')
							console.log(data)
							row.date = data[0]
							row.data.xbtime = data[1]
						}
						this.selected.push(row)
					}
					console.log(this.selected)
				})
			},
            change(e) {
				this.show = true
                console.log(e);
				this.data = e.extraInfo.data
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