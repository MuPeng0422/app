<template>
	<view class="content">
		<view class="content-main">
			<view class="avatar">
				<view class="avatar-container">
					<view class="avatar-img">
						<u-avatar :src="userInfo.userpicPath" mode="circle" :size="150" @click="getAvatar"></u-avatar>
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
				color: ''
			}
		},
		onReady() {
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
				}
			})
		},
		methods: {
			...mapMutations(['login']),
			getAvatar() {
				uni.chooseImage({
					sourceType: ['camera'],
					success: (res) => {
						this.userInfo.userpicPath = res.tempFilePaths[0]
						
						uni.uploadFile({
							url: this.$http.config.baseURL + '/user/updateUserInfo',    
							filePath: this.userInfo.userpicPath,
							name: 'userPicFile',
							header: {
								'Content-Type': 'multipart/form-data',
								'Authentication': this.res.token,
							},
							formData: {
								'userId': this.res.userInfo.userId
							},
							success: (res) =>{
								let data = JSON.parse(res.data)
								if (data.code === 200){
									this.$u.toast(data.message)
									this.$http.post('/user/findUserById', {
										'userId': this.res.userInfo.userId
									}, {
										header: {
											'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
											'Authentication': this.res.token
										}
									}).then((result) => {
										
										console.log('result', result)
										let data = {
											'userInfo': result.data.data,
											'token': this.res.token
										}
										this.login(data)
										
										let page = getCurrentPages().pop(); //跳转页面成功之后
										if (!page) return;
										page.onLoad();
										return true
									})
								}
							}
						})
					}
				})
			},
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
