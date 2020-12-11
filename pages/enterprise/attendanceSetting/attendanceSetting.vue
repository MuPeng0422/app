<template>
	<view class="content">
		<view class="setting-top">
			<view class="setting-position">
				<view class="label">
					打卡位置
				</view>
				<view class="input">
					<u-input v-model="address"  placeholder="根据选择的位置填充" type="text" :border="true" :disabled="true" />
				</view>
			</view>
			<view class="setting-range">
				<view class="label">
					打卡范围
				</view>
				<view class="input">
					<u-input v-model="range" placeholder="请输入打卡范围" type="number" :border="true" />
				</view>
				<view>
					米
				</view>
			</view>
			<view class="map">
				<map
					id="myMap"
					style="width: 100%; height: 300rpx;"
					:markers="markers"
					@tap="getAddress"
				>
					<cover-view class="positon" style="position: absolute; top: 20rpx; right: 20rpx;  width: 50rpx; height: 50rpx;" @click="controltap(objPosition)">
						<cover-image src="https://xksv.atx.net.cn/xcx_static/img/position.png"></cover-image>
					</cover-view>
				</map>
				
			</view>
		</view>
		<view class="setting-scheduling">
			<view class="setting-scheduling-t">
				班次设置
			</view>
			<view class="setting-scheduling-b">
				<view class="setting-scheduling-b-cell">
					<view class="setting-scheduling-cell-label">
						班次名称
					</view>
					<view class="setting-scheduling-b-cell-input">
						<u-input v-model="schedulingName" placeholder="班次名称" type="text" :border="true" />
					</view>
				</view>
				<view class="setting-scheduling-b-cell">
					<view class="setting-scheduling-cell-label">
						上班人员
					</view>
					<view class="setting-scheduling-b-cell-input">
						<u-input v-model="users" placeholder="上班人员" type="text" :border="true" />
					</view>
					<view class="setting-scheduling-b-cell-btn">
						<u-button type="primary" :custom-style="customStyle" @click="selectUsers">添加人员</u-button>
					</view>
				</view>
				<view class="setting-scheduling-b-cell">
					<view class="setting-scheduling-cell-label">
						有效时间
					</view>
					<view class="setting-scheduling-b-cell-input">
						<u-input v-model="dateRange" placeholder="日期范围" type="text" :border="true" :disabled="true" @click="dateRangeShow"/>
					</view>
				</view>
				<view class="setting-scheduling-b-cell">
					<view class="setting-scheduling-ClockIn">
						<view class="setting-scheduling-clock-cell">
							<view class="Clock-label">
								上班打卡时间
							</view>
							<view class="Clock-input">
								<u-input v-model="startTime" placeholder="请选择上班时间" :type="text" :border="true" :disabled="true" @click="selectStartTime" />
							</view>
						</view>
						<view class="setting-scheduling-clock-cell">
							<view class="Clock-label">
								下班打卡时间
							</view>
							<view class="Clock-input">
								<u-input v-model="endTime" placeholder="请选择下班时间" :type="text" :border="true" :disabled="true" @click="selectStopTime" />
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="submitBtn">
			<view class="btn">
				<u-button type="primary" @click="submitSchduling" :throttle-time="2000" >添加班次</u-button>
			</view>
		</view>
		<u-picker v-model="startTimeShow" :params="params" :default-time="defaultTime" mode="time" @confirm="startTimeConfirm"></u-picker>
		<u-picker v-model="stopTimeShow" :params="params" :default-time="defaultTime" mode="time" @confirm="stopTimeConfirm"></u-picker>
		<u-calendar v-model="dateShow" mode="range" @change="change" max-date="2050-01-01"></u-calendar>
	</view>
</template>

<script>
	import qqmapsdk from '@/static/js/qqmap-wx-jssdk.js'
	const QQMapWX = new qqmapsdk({
	    key: '643BZ-56QK5-ZFEIH-QJRKV-YMYMZ-GCFD6'
	});
	var self ,mapCtx
	export default {
		data() {
			return {
				res: {},
				address: '',
				range: '',
				schedulingName: '',
				dateRange: '',
				users: '',
				usersIds: '',
				usersList: [],
				current: 0,
				customStyle: {
					width: '150rpx',
					height: '70rpx'
				},
				params: {
					year: false,
					month: false,
					day: false,
					hour: true,
					minute: true,
					second: false
				},
				// 标记点
				markers: [{
					id: 1,
					latitude: 34.237681,
					longitude: 108.942241,
					name: 'T.I.T 创意园'
				}],
				defaultTime: '',
				startDate: '',
				endDate: '',
				startTime: '',
				endTime: '',
				dateShow: false,
				startTimeShow: false,
				stopTimeShow: false,
				objPosition: {}
			}
		},
		onLoad() {
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					console.log(res)
					this.res = res.data
				}
			})
			self = this
			// 获取当前map
			mapCtx =  uni.createMapContext('myMap')
			self.getAuthorizeInfo()
		},
		onReady() {
			let nowTime = new Date()
			let year = nowTime.getFullYear()
			let month = nowTime.getMonth() + 1
			let day = nowTime.getDate()
			let hours = nowTime.getHours()
			let minutes = nowTime.getMinutes()
			const defaultTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes
			this.defaultTime = defaultTime
		},
		onShow() {
			if (this.usersList.length > 0) {
				let usersArr = []
				let usersIds = []
				for (var i = 0; i < this.usersList.length; i++) {
					usersIds.push(this.usersList[i].userId)
					usersArr.push(this.usersList[i].realName)
				}
				this.users = usersArr.join(',')
				this.usersIds = usersIds.join(',')
			}
		},
		methods:{
			selectStartTime() {
				this.startTimeShow = true
			},
			selectStopTime() {
				this.stopTimeShow = true
			},
			startTimeConfirm(e) {
				this.startTime = e.hour + ':' + e.minute
			},
			stopTimeConfirm(e) {
				this.endTime = e.hour + ':' + e.minute
			},
			selectUsers() {
				uni.navigateTo({
					url: '../selectUser/selectUser'
				})
			},
			dateRangeShow() {
				this.dateShow = true
			},
			change(e) {
				this.dateRange = e.startDate + ' 至 ' + e.endDate
				this.startDate = e.startDate
				this.endDate = e.endDate
			},
			controltap(obj) {
				this.toLocation(obj)
			},
			submitSchduling() {
				let data = {
					'starDateStr': this.startDate,
					'stopDateStr': this.endDate,
					'starClockInStr': this.startTime,
					'stopClockInStr': this.endTime,
					'scheduLgt': this.longitude,
					'scheduLat': this.latitude,
					'userList': this.usersIds,
					'distance': this.range,
					'schedulingName': this.schedulingName,
					'address': this.address
				}
				
				if (this.startDate === '' && this.endDate === '' && this.startTime === '' && this.endTime === '' && this.longitude === '' && this.latitude === '' && this.usersIds === '' && this.range === '' && this.schedulingName === '' && this.address === '') {
					this.$u.toast('请完善考勤信息')
					return false
				} else {
					this.$http.post('/scheduling/addScheduling', data, {
						header: {
							'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
							'Authentication': this.res.token
						}
					}).then((res) => {
						uni.showToast({
							title: res.data.message,
							icon: 'block',
							duration: 1000,
							success: () => {
								setTimeout(() => {
									let pages = getCurrentPages();  //获取所有页面栈实例列表
									let nowPage = pages[ pages.length - 1];  //当前页页面实例
									let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
									uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
										delta: 1
									});
								}, 1000)
							}
						})
					})
				}
			},
			// 位置授权
			getAuthorizeInfo(){
				uni.authorize({
					scope: 'scope.userLocation',
					success() { // 允许授权
						self.getLocationInfo();
					},
					fail() {    // 拒绝授权
						self.openConfirm();
						console.log("你拒绝了授权，无法获得周边信息")
					}
				})
			},
			// 获取地理位置
			getLocationInfo(){  
				uni.getLocation({
					type: 'gcj02',
					success (res) {
						self.objPosition = res
						// 移动到当前位置
						self.toLocation(res)
						self.latitude = res.latitude;
						self.longitude = res.longitude;
						
						var locationString = res.latitude + "," + res.longitude;
						QQMapWX.reverseGeocoder({
							location: {
							  latitude: self.latitude,
							  longitude: self.longitude
							},
							get_poi: 1,
							poi_options: 'policy=2;radius=3000;page_size=20;page_index=1',
							success: function (r) {
								console.log(r)
								self.address = r.result.pois[0].address
							}
						})
					}
				});
			},
			// 再次获取授权
			// 当用户第一次拒绝后再次请求授权
			openConfirm(){
				uni.showModal({
					title: '请求授权当前位置',
					content: '需要获取您的地理位置，请确认授权',
					success: (res)=> {
						if (res.confirm) {
							uni.openSetting(); // 打开地图权限设置
						} else if (res.cancel) {
							uni.showToast({
						        title: '你拒绝了授权，无法获得周边信息',
								icon: 'none',
						        duration: 1000
						    })
						}
					}
				});
			},
			toLocation(obj) {
				// 改变地图中心位置
				mapCtx.moveToLocation(obj)
					// 移动标记点并添加动画效果
					mapCtx.translateMarker({
						markerId: 1,
						duration: 100,
						destination: {
						latitude:obj.latitude,
						longitude:obj.longitude,
					}
				})
			},
			getAddress(e) {
				this.longitude = e.detail.longitude
				this.latitude = e.detail.latitude
				var obj = {
					'latitude': e.detail.latitude,
					'longitude': e.detail.longitude,
					'speed': -1,
					'accuracy': 65,
					'verticalAccuracy': 65,
					'horizontalAccuracy': 65,
					'errMsg': 'getLocation:ok'
				}
				// 改变地图中心位置
				mapCtx.moveToLocation(obj)
					// 移动标记点并添加动画效果
					mapCtx.translateMarker({
						markerId: 1,
						duration: 100,
						destination: {
						latitude: obj.latitude,
						longitude: obj.longitude,
					}
				})
				
				var locationString = e.detail.latitude + "," + e.detail.longitude;
				uni.request({
					url: 'https://apis.map.qq.com/ws/geocoder/v1/',
					data: {
					  "key": "643BZ-56QK5-ZFEIH-QJRKV-YMYMZ-GCFD6",
					  "location": locationString
					},
					method: 'get',
					success: function (r) {
						//输出一下位置信息
						self.address = r.data.result.address
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		padding: 20rpx;
		background-color: #FFFFFF;
		
		.setting-top{
			padding: 20rpx 10rpx;
			background-color: #F9FAFA;
			
			.setting-position{
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;
				
				.label{
					width: 5em;
					padding-right: 10rpx;
				}
				
				.input{
					flex: 1;
				}
				
				.searchBtn{
					width: 150rpx;
					padding: 0 25rpx;
				}
			}
			
			.setting-range{
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;
				
				.label {
					width: 5em;
					padding-right: 10rpx;
				}
				
				.input{
					padding-right: 10rpx;
				}
			}
			
			.map{
				border: 1rpx solid #E1E1E1;
			}
		}
		
		.setting-scheduling{
			padding: 0 10rpx;
			
			.setting-scheduling-t{
				padding: 20rpx 0;
			}
			
			.setting-scheduling-b{
				border: 1rpx solid #E1E1E1;
				
				.setting-scheduling-b-cell{
					padding: 10rpx 0;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-bottom: 1rpx solid #E1E1E1;
					
					&:last-child{
						border-bottom: none;
					}
					
					.setting-scheduling-cell-label{
						padding: 0 20rpx;
					}
					
					.setting-scheduling-b-cell-input{
						padding-right: 10rpx;
						flex: 1;
					}
					
					.setting-scheduling-b-cell-btn{
						padding-right: 10rpx;
					}
					
					.setting-scheduling-ClockIn{
						width: 100%;
						padding: 20rpx;
						
						.setting-scheduling-clock-cell{
							display: flex;
							justify-content: space-between;
							align-items: center;
							margin-bottom: 20rpx;
							
							.Clock-label{
								padding-right: 20rpx;
							}
							
							.Clock-input{
								flex: 1;
							}
						}
					}
				}
				
			}
		}
		
		.submitBtn{
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #FFFFFF;
			
			.btn{
				width: 150rpx;
				margin: 100rpx auto;
			}
		}
	}
</style>
