<template>
	<view class="content">
		<view class="upload">
			<u-upload ref="uUpload" width="300" height="300" :file-list="fileList" :source-type="sourceType" :auto-upload="false" :show-progress="false" max-count="1" upload-text="上传照片"  @on-list-change="onUploaded"></u-upload>
		</view>
		<view class="submitBtn">
			<u-button type="primary" @click="upload">更换壁纸</u-button>
		</view>
	</view>
</template>

<script>
	import { mapMutations } from 'vuex';
	export default {
		data () {
			return {
				res: {},
				userpicPath: '',
				sourceType: ['album', 'camera'],
				fileList: []
			}
		},
		onLoad() {
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					this.res = res.data
				}
			})
		},
		methods: {
			...mapMutations(['login']),
			onUploaded(lists, name) {
				this.fileList = lists;
			},
			upload() {
				uni.uploadFile({
					url: this.$http.config.baseURL + '/user/uploadWallpaper',    
					filePath: this.fileList[0].url,
					name: 'Wallpaper',
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
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		height: 100%;
		background-color: #FFFFFF;
		
		.upload{
			width: 100%;
			height: 500rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		
		.submitBtn{
			width: 60%;
			margin: 0 auto;
		}
	}
</style>
