<template>
	<view class="content">
		<view class="content-main">
			<view class="avatar">
				<view class="avatar-container">
					<view class="avatar-img">
						<u-avatar :src="userInfo.userpicPath" mode="circle" :size="150"></u-avatar>
					</view>
					<view class="avatar-name">
						<text>{{userInfo.realName}}</text>
					</view>
				</view>
			</view>
			<u-cell-group>
				<u-cell-item icon="account-fill" title="单位信息" @click="goCompanyInfo"></u-cell-item>
				<u-cell-item icon="photo" title="个人照片" @click="goPhoto"></u-cell-item>
				<u-cell-item icon="bookmark-fill" title="营业执照" @click="goBusinessCert"></u-cell-item>
				<u-cell-item icon="file-text-fill" title="考勤设置" @click="goAttendanceSetting"></u-cell-item>
				<u-cell-item icon="setting-fill" title="系统设置" @click="goSystem"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				res: {},
				userInfo: {},
				color: ''
			}
		},
		onReady() {
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					console.log(res)
					this.res = res.data
					this.userInfo = res.data.userInfo
					if (this.userInfo.userpicPath === undefined) {
						this.userInfo.userpicPath = '/static/default_avatar.jpg'
					}
					
					if (this.userInfo.certificateState === 0) {
						this.color = '#19be6b'
					} else if (this.userInfo.certificateState === 1) {
						this.color = '#ff9900'
					} else if (this.userInfo.certificateState === 2) {
						this.color = '#909399'
					}
				}
			})
		},
		methods: {
			goCompanyInfo() {
				uni.navigateTo({
				    url: '/pages/enterprise/CompanyInfo/CompanyInfo'
				})
			},
			goPhoto() {
				uni.navigateTo({
					url: '/pages/enterprise/unitPhoto/unitPhoto'
				})
			},
			goBusinessCert() {
				uni.navigateTo({
				    url: '/pages/enterprise/businessCert/businessCert'
				})
			},
			goAttendanceSetting() {
				uni.navigateTo({
				    url: '/pages/enterprise/attendanceSetting/attendanceSetting'
				})
			},
			goSystem() {
				uni.navigateTo({
				    url: '/pages/system/system'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		height: 100%;
		padding-top: 10rpx;
		
		.content-main{
			height: 100%;
			background-color: #FFFFFF;
			
			.avatar{
				height: 300rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				
				.avatar-container{
					
					.avatar-img{
						display: flex;
						justify-content: center;
					}
					.avatar-name{
						display: flex;
						align-items: center;
						justify-content: center;
						
						text{
							padding-right: 10rpx;
						}
					}
				}
			}
		}
	}
</style>
