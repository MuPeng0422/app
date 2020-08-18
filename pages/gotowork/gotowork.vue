<template>
	<view class="content">
		<view class="position">
			当前位置：{{address}}
		</view>
		<view class="camera" @click="getCamera">
			<u-avatar class="avatar-img" :src="src" size="200"></u-avatar>
		</view>
		<view class="timeBtn" @click="handliClickBtn">
			{{date}}
		</view>
		<u-popup v-model="show" width="80%" height="80%" mode="center" :safe-area-inset-bottom="true" border-radius="14">
			<view class="popup">
				<view class="title">
					{{title}}
				</view>
				<view class="checkBox">
					<u-checkbox-group :wrap="true" size="40" @change="checkboxGroupChange">
						<u-checkbox 
							@change="checkboxChange" 
							v-model="item.checked"
							v-for="(item, index) in list" :key="index" 
							:name="item.name"
						>{{item.name}}</u-checkbox>
					</u-checkbox-group>
				</view>
				<view class="submitBtn">
					<u-button type="primary" @click="submit">确认提交</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				address: '正在获取位置信息...',
				show: false,
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
				]
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
				this.show = true
			},
			// 选中某个复选框时，由checkbox时触发
			checkboxChange(e) {
				console.log(e);
			},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange(e) {
				console.log(e);
			},
			submit() {
				uni.showToast({
					title: '打卡成功',
					icon: 'success',
					success: () => {
						setTimeout(() => {
							this.show = false
							uni.navigateBack()
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
