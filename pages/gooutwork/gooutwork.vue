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
		<view class="item">
			<view class="label">
				拍照打卡：
			</view>
			<view class="input">
				<u-upload ref="uUpload" :action="action" :file-list="fileList" :auto-upload="false" :show-progress="false" :deletable="true" max-count="1" @on-list-change="onListChange"></u-upload>
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				address: '正在获取位置信息...',
				work: '',
				date: new Date().toTimeString().slice(0, 5),
				action: 'http://www.example.com/upload',
				fileList: []
			}
		},
		onShow() {
			this.getAuthorizeInfo();
		},
		methods: {
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
					type: 'wgs84',
					success (res) {
						var locationString = res.latitude + "," + res.longitude;
						uni.request({
							url: 'https://apis.map.qq.com/ws/geocoder/v1/',
							data: {
							  "key": "643BZ-56QK5-ZFEIH-QJRKV-YMYMZ-GCFD6",
							  "location": locationString
							},
							method: 'get',
							success: function (r) {
								//输出一下位置信息
								that.address = r.data.result.address
								//r.data.result.address获得的就是用户的位置信息，将它保存到一个全局变量上
								getApp().globalData.locationInfo = r.data.result.address;
								//这步是将位置信息保存到本地缓存中，key = value的形式
								try {
									uni.setStorageSync('locationInfo', r.data.result.address)
								} catch (e) {
									console.log(e)
								}
							}
						});
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
				console.log(this.address)
				console.log(this.lists)
				console.log(this.work)
				console.log(this.date)
				uni.showToast({
					title: '打卡成功',
					icon: 'success',
					success: () => {
						setTimeout(() => {
							uni.navigateTo({
							    url: '/pages/index/index'
							})
						}, 2000)
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
