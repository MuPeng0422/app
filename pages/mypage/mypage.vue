<template>
	<view class="content">
		<view class="content-main">
			<view class="avatar" :style="'background: url('+ backgroundImage +'); background-size: 100%;'">
				<view class="avatar-container">
					<view class="avatar-img">
						<u-avatar :src="userInfo.userpicPath" mode="circle" :size="150"></u-avatar>
					</view>
					<view class="avatar-name">
						<text>{{userInfo.realName}}</text>
						<u-icon name="checkmark-circle" size="40" :color="color"></u-icon>
					</view>
				</view>
			</view>
			<u-cell-group>
				<u-cell-item icon="account-fill" title="个人信息" @click="goUserInfo"></u-cell-item>
				<u-cell-item icon="photo" title="个人照片" @click="goPhoto"></u-cell-item>
				<u-cell-item icon="bookmark-fill" title="个人证书" @click="goPersonalCert"></u-cell-item>
				<u-cell-item icon="file-text-fill" title="学习报告" @click="goStudyReport"></u-cell-item>
				<u-cell-item icon="setting-fill" title="系统设置" @click="goSystem"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	import { mapMutations } from 'vuex';
	export default {
		data() {
			return {
				res: {},
				userInfo: {},
				color: '',
				backgroundImage: 'https://xksv.atx.net.cn/xcx_static/img/bg.jpg'
			}
		},
		onLoad() {
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					console.log('res.data', res.data)
					this.res = res.data
					this.userInfo = this.res.userInfo
					
					if (res.data.userInfo.certificateState === 0) {
						this.color = '#19be6b'
					} else if (res.data.userInfo.certificateState === 1) {
						this.color = '#ff9900'
					} else if (res.data.userInfo.certificateState === 2) {
						this.color = '#909399'
					}
					
					if (this.userInfo.userpicPath === undefined) {
						this.userInfo.userpicPath = 'https://xksv.atx.net.cn/xcx_static/img/default_avatar.jpg'
					}
					
					if(this.userInfo.wallpaperPath !== undefined) {
						this.backgroundImage = this.userInfo.wallpaperPath
					}
				}
			})
		},
		onUnload() { // 返回刷新
			let pages = getCurrentPages(); // 当前页面
			let beforePage = pages[pages.length - 2]; // 前一个页面
			beforePage.onLoad(); // 执行前一个页面的onLoad方法
		},
		methods: {
			...mapMutations(['login']),
			goUserInfo() {
				uni.navigateTo({
				    url: '/pages/userInfo/userInfo'
				})
			},
			goPersonalCert() {
				uni.navigateTo({
				    url: '/pages/personalCert/personalCert'
				})
			},
			goStudyReport() {
				uni.navigateTo({
				    url: '/pages/studyReport/studyReport'
				})
			},
			goSystem() {
				uni.navigateTo({
				    url: '/pages/system/system'
				})
			},
			goPhoto() {
				uni.navigateTo({
					url: '/pages/userPhoto/userPhoto'
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
							color: $color;
							padding-right: 10rpx;
						}
					}
				}
			}
		}
	}
</style>
