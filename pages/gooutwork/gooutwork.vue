<template>
	<view class="content">
		<view class="item" style="align-items: center;">
			<view class="label">
				当前位置：
			</view>
			<view class="input">
				<u-input v-model="address" type="text" :border="false" />
			</view>
		</view>
		<view class="item" style="align-items: center;">
			<view class="label">
				选择班次：
			</view>
			<view class="input">
				<u-input v-model="attendance.label" type="select" :border="true" placeholder="请选择班次" @click="signAttendance = true" />
			</view>
		</view>
		<view class="item">
			<view class="label">
				拍照打卡：
			</view>
			<view class="input">
				<u-upload ref="uUpload" :file-list="fileList" :source-type="sourceType" :auto-upload="false" :show-progress="false" max-count="1" upload-text="上传照片"  @on-list-change="onUploaded"></u-upload>
			</view>
		</view>
		<view class="item">
			<view class="label">
				工作汇总：
			</view>
			<view class="input">
				<u-input v-model="work" type="textarea" height="100" :auto-height="true" :border="true"/>
			</view>
		</view>
		
		<view class="timeBtn" @click="handliClickBtn">
			<view class="time">
				<view class="date">{{ date }}</view>
				<view class="name">下班打卡</view>
			</view>
		</view>
		<u-action-sheet v-model="signAttendance" :list="schedulingList" @click="actionSheetCallback"></u-action-sheet>
	</view>
</template>

<script>
	import qqmapsdk from '@/static/js/qqmap-wx-jssdk.js'
	const QQMapWX = new qqmapsdk({
	    key: '643BZ-56QK5-ZFEIH-QJRKV-YMYMZ-GCFD6'
	});
	export default {
		data() {
			return {
				res: {},
				address: '',
				work: '',
				signAttendance: false,
				date: new Date().toTimeString().slice(0, 5),
				fileList: [],
				sourceType: ['camera'],
				attendance: {
					label: '',
					value: null
				},
				schedulingList: [],
				endLongitude: '',
				endLatitude: ''
			}
		},
		onShow() {
			this.getAuthorizeInfo();
		},
		onLoad() {
			uni.getStorage({//获得保存在本地的用户信息
				key: 'userInfo',  
				success:(res) => {
					this.res = res.data
					this.getScheduling()
				}
			})
		},
		methods: {
			getScheduling() {
				this.$http.post('/scheduling/findUserScheduling', {
					'userId': this.res.userInfo.userId,
					'state': 1
				}, {
					header: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
						'Authentication': this.res.token
					}
				}).then((res) => {
					if(res.data.code === 200) {
						for (var i = 0; i < res.data.data.length; i++) {
							let row = {}
							row['value'] = res.data.data[i].id
							row['text'] = res.data.data[i].schedulingName
							row['starDate'] = res.data.data[i].starDate
							row['stopDate'] = res.data.data[i].stopDate
							row['starClockIn'] = res.data.data[i].starClockIn.substring(0, 5)
							row['stopClockIn'] = res.data.data[i].stopClockIn.substring(0, 5)
							row['attId'] = res.data.data[i].attId
							this.schedulingList.push(row)
						}
					}
				})
			},
			// 班次点击回调
			actionSheetCallback(index) {
				uni.hideKeyboard();
				this.attendance.label = this.schedulingList[index].text;
				this.attendance.value = this.schedulingList[index].value;
				this.attendance.attId = this.schedulingList[index].attId;
			},
			// 位置授权
			getAuthorizeInfo(){
				const that = this;
				uni.authorize({
					scope: 'scope.userLocation',
					success() { // 允许授权
						that.getLocationInfo();
					},
					fail(){    // 拒绝授权
						that.openConfirm();
						console.log("你拒绝了授权，无法获得周边信息")
					}
				})
			},
			getLocationInfo(){
				var that = this
				uni.getLocation({
					type: 'gcj02',
					success (res) {
						that.endLongitude = res.longitude
						that.endLatitude = res.latitude
						var locationString = res.latitude + "," + res.longitude;
						
						QQMapWX.reverseGeocoder({
							location: {
							  latitude: that.endLatitude,
							  longitude: that.endLongitude
							},
							get_poi: 1,
							poi_options: 'policy=2;radius=3000;page_size=20;page_index=1',
							success: function (r) {
								that.address = r.result.pois[0].address
							}
						})		
						
						
						// uni.request({
						// 	url: 'https://apis.map.qq.com/ws/geocoder/v1/',
						// 	data: {
						// 	  "key": "643BZ-56QK5-ZFEIH-QJRKV-YMYMZ-GCFD6",
						// 	  "location": locationString
						// 	},
						// 	method: 'get',
						// 	success: function (r) {
						// 		//输出一下位置信息
						// 		that.address = r.data.result.address
						// 		//r.data.result.address获得的就是用户的位置信息，将它保存到一个全局变量上
						// 		getApp().globalData.locationInfo = r.data.result.address;
						// 		//这步是将位置信息保存到本地缓存中，key = value的形式
						// 		try {
						// 			uni.setStorageSync('locationInfo', r.data.result.address)
						// 		} catch (e) {
						// 			console.log(e)
						// 		}
						// 	}
						// });
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
							uni.openSetting();// 打开地图权限设置
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
			onUploaded(lists, name) {
				this.fileList = lists;
			},
			onListChange(lists) {
				console.log('onListChange', lists);
				this.lists = lists;
			},
			getCamera() {
				var that = this
				uni.chooseImage({
					sourceType: ['camera'],
					success: (res) => {
						that.src = res.tempFilePaths[0]
					}
				})
			},
			handliClickBtn() {
				
				uni.uploadFile({
					url: this.$http.config.baseURL + '/attendance/uploadFace',    
					filePath: this.fileList[0].url,
					name: 'userCertificate',
					header: {
						'Content-Type': 'multipart/form-data',
						'Authentication': this.res.token,
					},
					formData: {
						'userId': this.res.userInfo.userId
					},
					success: (res) =>{
						let data = JSON.parse(res.data)
						this.$u.toast(data.data.msg)
						if (data.data.code === '1') {
							
							let data = {
								userId: this.res.userInfo.userId,
								type: 2,  // 1上班  2下班
								schedulingId: this.attendance.value,
								endLongitude: String(this.endLongitude),
								endLatitude: String(this.endLatitude),
								id: this.attendance.attId
							}
							this.$http.post('/attendance/addUserAttendance', data, {
								header: {
									'Authentication': this.res.token
								}
							}).then((res) => {
								if (res.data.code === 200) {
									uni.showToast({
										title: res.data.message,
										icon: 'block',
										duration: 1000,
										success: () => {
											uni.navigateBack();
										}
									})
								} else {
									uni.showToast({
										title: res.data.message,
										icon: 'none',
										duration: 3000
									})
								}
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		margin-top: 10rpx;
		height: 100%;
		padding: 20rpx;
		background-color: #fff;
		
		.item{
			display: flex;
			margin-bottom: 20rpx;
			
			.label{
				width: 150rpx;
			}
			
			.input{
				flex: 1;
				
				.upload{
					width: 200rpx;
					height: 200rpx;
					background-color: #F4F5F6;
					border-radius: 10rpx;
					display: flex;
					align-items: center;
					flex-direction: column;
					justify-content: center;
					
					text{
						color: #606266;
						font-size: 12px;
						margin-top: 10rpx;
					}
				}
			}
		}
		
		.timeBtn{
			width: 200rpx;
			height: 200rpx;
			font-size: 36rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 50rpx auto 0;
			border-radius: 50%;
			background-color: $u-type-primary;
			color: #fff;
			
			
			.time{
				text-align: center;
				
				.name{
					font-size: 28rpx;
				}
			}
		}
		
	}
</style>
