<template>
	<view class="content">
		<view class="sign-attendance">
			<view class="label">
				当前位置：
			</view>
			<view class="input">
				<u-input v-model="location" type="text" :border="true" :disabled="true" placeholder="正在获取您的当前位置..." />
			</view>
		</view>
		<view class="sign-attendance">
			<view class="label">
				选择班次：
			</view>
			<view class="input">
				<u-input v-model="attendance.label" type="select" :border="true" placeholder="请选择班次" @click="signAttendance = true" />
			</view>
		</view>
		<view class="camera" @click="getCamera">
			<u-avatar class="avatar-img" :src="src" size="200"></u-avatar>
		</view>
		<view class="timeBtn" @click="handliClickBtn">
			{{ date }}
		</view>
		<u-popup v-model="show" width="80%" height="80%" mode="center" :safe-area-inset-bottom="true" border-radius="14">
			<view class="popup">
				<view class="title">
					{{ title }}
				</view>
				<view class="checkBox">
					<u-checkbox-group :wrap="true" size="40" @change="checkboxGroupChange">
						<u-checkbox 
							@change="checkboxChange" 
							v-model="item.checked"
							v-for="(item, index) in list" :key="index" 
							:name="item.name"
						>{{ item.name }}</u-checkbox>
					</u-checkbox-group>
				</view>
				<view class="submitBtn">
					<u-button type="primary" @click="submit">确认提交</u-button>
				</view>
			</view>
		</u-popup>
		<u-action-sheet v-model="signAttendance" :list="schedulingList" @click="actionSheetCallback"></u-action-sheet>
	</view>
</template>

<script>
	import { mapMutations } from 'vuex';
	import qqmapsdk from '@/static/js/qqmap-wx-jssdk.js'
	const QQMapWX = new qqmapsdk({
	    key: '643BZ-56QK5-ZFEIH-QJRKV-YMYMZ-GCFD6'
	});
	export default {
		data() {
			return {
				res: {},
				location: '',
				show: false,
				signAttendance: false,
				src: '',
				date: new Date().toTimeString().slice(0, 5),
				title: '交接事项',
				list: [
					{
						name: '班次记录变核实班次记录变核实班次记录变核实',
						checked: false,
						disabled: false
					},
					{
						name: '系统工作情况记录表',
						checked: false,
						disabled: false
					},
					{
						name: '系统进行全面检查',
						checked: false,
						disabled: false
					}
				],
				attendance: {
					attId: null,
					label: '',
					value: null
				},
				schedulingList: [],
				goLongitude: '',
				goLatitude: ''
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
			...mapMutations(['login']),
			getScheduling() {
				this.$http.post('/scheduling/findUserScheduling', {
					'userId': this.res.userInfo.userId,
					'state': 0
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
					}
				})
			},
			// 获取当前位置
			getLocationInfo(){
				var that = this
				uni.getLocation({
					type: 'gcj02',
					success (res) {
						that.goLongitude = res.longitude
						that.goLatitude = res.latitude
							
						var locationString = res.latitude + "," + res.longitude;
						QQMapWX.reverseGeocoder({
							location: {
							  latitude: that.goLatitude,
							  longitude: that.goLongitude
							},
							get_poi: 1,
							poi_options: 'policy=2;radius=3000;page_size=20;page_index=1',
							success: function (r) {
								that.location = r.result.pois[0].address
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
			// 调用摄像头
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
				if (this.res.userInfo.userpicPath === undefined) {
					uni.showToast({
						title: '请先传个人照片再打卡',
						icon: 'none',
						duration: 2000,
						success: () => {
							setTimeout((res) => {
								uni.navigateTo({
									url: '../userPhoto/userPhoto'
								})
							}, 1000)
						}
					})
					return false
				}
				uni.uploadFile({
					url: this.$http.config.baseURL + '/attendance/uploadFace',    
					filePath: this.src,
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
							this.show = true
						}
					}
				})
			},
			// 选中某个复选框时，由checkbox时触发
			checkboxChange(e) {
			},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange(e) {
			},
			submit() {
				let data = {
					userId: this.res.userInfo.userId,
					type: 1,  // 1上班  2下班
					schedulingId: this.attendance.value,
					goLongitude: String(this.goLongitude),
					goLatitude: String(this.goLatitude),
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
								this.show = false
								
								this.$http.post('/user/findUserById', {
									'userId': this.res.userInfo.userId
								}, {
									header: {
										'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
										'Authentication': this.res.token
									}
								}).then((result) => {
									
									let data = {
										'userInfo': result.data.data,
										'token': this.res.token
									}
									this.login(data)
									
									// 返回刷新
									
									let pages = getCurrentPages(); // 当前页面
									let beforePage = pages[pages.length - 2]; // 前一个页面
									uni.navigateBack({
									     success: function() {
									         beforePage.onLoad(); // 执行前一个页面的onLoad方法
									     }
									 });
								})
							}
						})
					} else {
						this.show = false
						uni.showToast({
							title: res.data.message,
							icon: 'none',
							duration: 3000
						})
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
		
		.position{
			height: 100rpx;
			display: flex;
			align-items: center;
		}
		
		.sign-attendance{
			height: 100rpx;
			display: flex;
			align-items: center;
			
			.input{
				flex: 1;
			}
		}
		
		.camera{
			width: 300rpx;
			height: 300rpx;
			margin: 50rpx auto 0;
			display: flex;
			align-items: center;
			justify-items: center;
			text-align: center;
			background-color: $u-type-info-light;
			border-radius: 50rpx;
			
			.avatar-img{
				margin: 0 auto;
			}
		}
		
		.timeBtn{
			width: 200rpx;
			height: 200rpx;
			font-size: 36rpx;
			display: flex;
			justify-content:center;
			align-items: center;
			margin: 50rpx auto 0;
			border-radius: 50%;
			background-color: $u-type-primary;
			color: #fff
		}
		
		.popup{
			width: 100%;
			height: 100%;
			padding: 50rpx;
			
			.title{
				font-size: 32rpx;
				font-weight: bolder;
				text-align: center;
			}
			
			.checkBox{
				padding-bottom: 100rpx;
			}
		}
	}
</style>
