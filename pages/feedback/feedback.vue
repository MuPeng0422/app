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
						<u-upload ref="uUpload" :action="action" :file-list="fileList" :auto-upload="false" max-count="3"></u-upload>
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
				question: '',
				placeholder: '请简单的描述您遇到的问题或者对我们的建议~',
				action: '',
				fileList: []
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
