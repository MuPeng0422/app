<template>
	<view class="content">
		<view class="content-main">
			<view class="content-form">
				<view class="form-item">
					<view class="label">
						您的问题
					</view>
					<view class="input">
						<u-input v-model="question" :placeholder="placeholder" type="textarea" height="200" :auto-height="true" :border="true"/>
					</view>
				</view>
				<view class="form-item">
					<view class="label">
						问题截图
					</view>
					<view class="input">
						<u-upload ref="uUpload" :file-list="fileList"  :auto-upload="false" :show-progress="false" max-count="1" upload-text="上传照片"  @on-list-change="onUploaded"></u-upload>
					</view>
				</view>
			</view>
			<view class="submitBtn">
				<u-button type="primary" @click="submit">提交反馈</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				res: {},
				question: '',
				placeholder: '请简单的描述您遇到的问题或者对我们的建议~',
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
			onUploaded(lists, name) {
				this.fileList = lists;
			},
			submit() {
				if (this.question === '') {
					this.$u.toast('请简单的描述您遇到的问题或者对我们的建议')
					return false
				}
				
				if (this.fileList.length === 0) {
					this.$u.toast('请上传截图')
					return false
				}
				
				
				let data = {
					'userId': this.res.userInfo.userId,
					'userName': this.res.userInfo.realName,
					'userPhone': this.res.userInfo.mobile,
					'unitId': this.res.userInfo.unitId,
					'content': this.question
				}
				
				uni.uploadFile({
					url: this.$http.config.baseURL + '/user/addFeedBack',    
					filePath: this.fileList[0].url,
					name: 'feedBackPic',
					header: {
						'Content-Type': 'multipart/form-data',
						'Authentication': this.res.token,
					},
					formData: data,
					success: (res) =>{
						let data = JSON.parse(res.data)
						console.log(data)
					}
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
			padding: 30rpx;
			background-color: #FFFFFF;
			
			.content-form{
				.form-item{
					margin-bottom: 30rpx;
					
					.label{
						font-size: 28rpx;
						margin-bottom: 20rpx;
						font-weight: bold;
						color: #000;
					}
				}
			}
			
			.submitBtn{
				width: 300rpx;
				margin: 100rpx auto 0;
			}
		}
	}
</style>
