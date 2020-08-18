<template>
	<view class="content">
		<view class="content-main">
			<view class="avatar">
				<view class="avatar-container">
					<view class="avatar-img">
						<u-avatar :src="userInfo.src" mode="square" :size="150"></u-avatar>
					</view>
					<view class="avatar-name">
						<text>{{userInfo.name}}</text>
						<u-icon name="checkmark-circle" size="40" color="#19be6b"></u-icon>
					</view>
				</view>
			</view>
			<u-cell-group>
				<u-cell-item icon="account-fill" title="个人信息" @click="goUserInfo"></u-cell-item>
				<u-cell-item icon="bookmark-fill" title="个人证书" @click="goPersonalCert"></u-cell-item>
				<u-cell-item icon="file-text-fill" title="学习报告" @click="goStudyReport"></u-cell-item>
				<u-cell-item icon="setting-fill" title="系统设置" @click="goSystem"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {
					src: '',
					name: '刘大招'
				}
			}
		},
		methods: {
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
