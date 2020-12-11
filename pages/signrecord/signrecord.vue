<template>
    <view class="content">
		<view class="calendar">
			<uni-calendar
			:insert="true" 
			:selected="selected"
			@change="change"
			@monthSwitch="monthSwitch"
			 ></uni-calendar>
		</view>
		<view class="sign-info" v-show="show">
			<view class="item" v-for="(item, index) in dataList" :key="index">
				<view class="sign-time">
					上班打卡：{{ item.sbtime }}
				</view>
				<view class="sign-time">
					下班打卡：{{ item.xbtime }}
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
				year: '',
				month: '',
				selected: [],
				dataList: []
			}
		},
		onLoad(data) {
			const item = JSON.parse(decodeURIComponent(data.data));
			this.res = item
			let date = new Date()
			this.year = date.getFullYear()
			this.month = date.getMonth() + 1
			this.getAttendance(this.year, this.month)
		},
        methods: {
			getAttendance(year, month) {
				this.$http.get('/attendance/currentMonth', {
					params: {
						'userId': this.res.userInfo.userId,
						'year': year,
						'month': month
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
						'Authentication': this.res.token
					}
				}).then((res) => {
					if (res.data.code === 200) {
						for (var i = 0; i < res.data.data.length; i++) {
							const row = {
								date: '',
								info: '',
								data: []
							}
							
							if (res.data.data[i].Status === 1) {
								
							} else if (res.data.data[i].Status === 0) {
								row.date = res.data.data[i].date
								row.info = ''
								if (res.data.data[i].work.length > 0) {
									for (var j = 0; j < res.data.data[i].work.length; j++) {
										const item = {
											sbtime: '',
											xbtime: ''
										}
										
										if (res.data.data[i].work[j].downWork === '未打卡') {
											item.xbtime = '未打卡'
										} else {
											const downWork = res.data.data[i].work[j].downWork.split(' ')
											item.xbtime = downWork[1]
										}
										
										if (res.data.data[i].work[j].upWork === '未打卡') {
											item.sbtime = '未打卡'
										} else {
											const upWork = res.data.data[i].work[j].upWork.split(' ')
											item.sbtime = upWork[1]
										}
										row.data.push(item)
									}
								} else {
									console.log('暂无考勤数据')
								}
							} else if (res.data.data[i].Status === 2){
								row.date = res.data.data[i].date
								row.info = '异常'
								if (Array.isArray(res.data.data[i].work)) {
									for (var j = 0; j < res.data.data[i].work.length; j++) {
										const item = {
											sbtime: '',
											xbtime: ''
										}
										
										if (res.data.data[i].work[j].downWork === '未打卡') {
											item.xbtime = '未打卡'
										} else {
											const downWork = res.data.data[i].work[j].downWork.split(' ')
											item.xbtime = downWork[1]
										}
										
										if (res.data.data[i].work[j].upWork === '未打卡') {
											item.sbtime = '未打卡'
										} else {
											const upWork = res.data.data[i].work[j].upWork.split(' ')
											item.sbtime = upWork[1]
										}
										row.data.push(item)
									}
								} else {
									console.log('暂无考勤数据')
								}
							}
							this.selected.push(row)
						}
					}
				})
			},
			monthSwitch(e) {
				this.show = false
				this.getAttendance(e.year, e.month)
			},
            change(e) {
				if (e.extraInfo.data === undefined) {
					this.show = false
				} else {
					this.show = true
					this.dataList = e.extraInfo.data
				}
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