<template>
	<view class="content">
		<view class="content-main">
			<u-cell-group>
				<u-cell-item title="证书名称" :value="certName" :arrow="false" @click="selectType"></u-cell-item>
				<u-cell-item title="有效期至" :value="certTime" :arrow="false" v-if="certTimeShow" @click="selectCertTime"></u-cell-item>
			</u-cell-group>
			<view class="uploadCert">
				<view class="label">
					证件：
				</view>
				<view class="upload">
					<u-upload ref="uUpload" :action="action" :file-list="fileList" max-count="1" upload-text="上传证书"></u-upload>
				</view>
			</view>
			<view class="submitBtn">
				<u-button type="primary" @click="submit">上传</u-button>
			</view>
		</view>
		
		<u-select v-model="certSelectTypeShow" mode="single-column" :list="certList" @confirm="getCertType"></u-select>
		<u-select v-model="certSelectTypeLeaveShow" mode="single-column" :list="children" @confirm="getCertTypeLeave"></u-select>
		<u-picker v-model="certSelectTimeShow" mode="time" @confirm="getCertTime"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				certType: 0,
				certName: '请选择证书',
				certTime: '请选择证书有效期',
				certTimeShow: false,
				certSelectTypeShow: false,
				certSelectTypeLeaveShow: false,
				certSelectTimeShow: false,
				certList: [
					{
						value: 0,
						label: '成绩单'
					},
					{
						value: 1,
						label: '结业证'
					},
					{
						value: 2,
						label: '消防证'
					}
				],
				children: [
					{
						value: 2,
						label: '初级'
					},
					{
						value: 5,
						label: '中级'
					},
					{
						value: 5,
						label: '高级'
					}
				],
				action: 'http://www.example.com/upload',
				fileList: []
			}
		},
		methods: {
			selectType() {
				this.certSelectTypeShow = true
			},
			selectCertTime() {
				this.certSelectTimeShow = true
			},
			getCertType(res) {
				this.certName = res[0].label
				this.certType = res[0].value
				const type = res[0].value
				if(type === 0 || type === 1) {
					this.certTimeShow = true
				} else {
					this.certTimeShow = false
					this.certSelectTypeLeaveShow = true
				}
			},
			getCertTypeLeave(res) {
				this.certName = this.certName + '-' + res[0].label
				console.log(res)
				console.log(this.certName)
			},
			getCertTime(obj) {
				console.log(obj)
				this.certTime = obj.year + '-' + obj.month + '-' + obj.day
			},
			submit() {
				console.log(this.certType)
				console.log(this.certName)
				console.log(this.certTime)
				console.log(this.fileList)
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
			
			.uploadCert{
				padding: 26rpx 32rpx;
				
				.upload{
					padding: 20rpx;
				}
			}
			
			.submitBtn{
				width: 300rpx;
				margin: 50rpx auto 0;
			}
		}
	}
</style>
