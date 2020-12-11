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
						<u-avatar :src="item.heardPic"></u-avatar>
					</view>
					<view class="item-content-info">
						<view class="item-content-info-name">
							<span>{{ item.name }}</span>
							<span>{{ item.schedulName }}</span>
						</view>
						<view class="item-content-info-time">
							<span>上班时间：{{ item.sbtime }}</span>
							<span>下班时间：{{ item.xbtime }}</span>
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
				res: {},
				signList: [],
				show: false,
				selected: [],
				date: '',
				data: []
			}
		},
		onLoad() {
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					this.res = res.data
					let date = new Date()
					this.year = date.getFullYear()
					this.month = date.getMonth() + 1
					this.getAttendance(this.year, this.month)
				}
			})
		},
        methods: {
			getAttendance(year, month) {
				
				this.$http.get('/attendance/currentByDayUnitId', {
					params: {
						'unitId': this.res.userInfo.unitId,
						'year': year,
						'month': month
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
						'Authentication': this.res.token
					}
				}).then((res) => {
					if (res.data.code === 200) {
						if (res.data.data.length > 0) {
							this.signList = [							
								{
									num: res.data.data[res.data.data.length - 1].addenceRight,
									name: '正常'
								},
								{
									num: res.data.data[res.data.data.length - 1].leave,
									name: '请假'
								},
								{
									num: res.data.data[res.data.data.length - 1].absentWork,
									name: '缺勤'
								}
							]
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
									for (var j = 0; j < res.data.data[i].work.length; j++) {
										const item = {
											heardPic: res.data.data[i].work[j].heardPic,
											name: res.data.data[i].work[j].name,
											schedulName: res.data.data[i].work[j].schedulName,
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
								} else if (res.data.data[i].Status === 2) {
									row.date = res.data.data[i].date
									row.info = '异常'
									for (var j = 0; j < res.data.data[i].work.length; j++) {
										const item = {
											heardPic: res.data.data[i].work[j].heardPic,
											name: res.data.data[i].work[j].name,
											schedulName: res.data.data[i].work[j].schedulName,
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
								}
								this.selected.push(row)
							}
						}
					}
				})
			},
			monthSwitch(e) {
				this.show = false
				this.getAttendance(e.year, e.month)
			},
            change(e) {
				this.show = true
				this.date = e.extraInfo.date
				if (e.extraInfo.data === undefined) {
					this.show = false
				} else {
					this.data = e.extraInfo.data
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
						align-items: center;
						justify-content: space-between;
						
						.item-content-info-name{
							width: 150rpx;
							display: flex;
							flex-direction: column;
							justify-content: space-between;
						}
						
						.item-content-info-time{
							padding-left: 50rpx;
							flex: 1;
							display: flex;
							flex-direction: column;
							justify-content: space-around;
						}
						
					}
				}
			}
		}
	}
</style>