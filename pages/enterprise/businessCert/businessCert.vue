<template>
	<view class="content">
		<view class="content-main">
			<u-cell-group>
				<u-cell-item title="证书名称" :value="certName" :arrow="false" @click="selectType"></u-cell-item>
			</u-cell-group>
			<view class="uploadCert">
				<view class="label">
					证件：
				</view>
				<view class="upload">
					<u-upload ref="uUpload" :file-list="fileList" :auto-upload="false" :show-progress="false" max-count="1" upload-text="上传证书" @on-list-change="onUploaded"></u-upload>
				</view>
			</view>
			<view class="submitBtn">
				<u-button type="primary" @click="submit">上传</u-button>
			</view>
		</view>
		
		<u-select v-model="certSelectTypeShow" mode="single-column" :list="certList" @confirm="getCertType"></u-select>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				res: {},
				certType: 0,
				certName: '请选择证书',
				certSelectTypeShow: false,
				certList: [
					{
						value: 0,
						label: '营业执照'
					},
					{
						value: 1,
						label: '消防验收书'
					}
				],
				certData: {},
				fileList: []
			}
		},
		onLoad() {
			uni.getStorage({//获得保存在本地的用户信息
				key: 'userInfo',  
				success:(res) => {
					console.log(res.data)
					this.res = res.data
					this.getUserById()
				}
			})
		},
		methods: {
			getUserById() {
				this.$http.get('/unit/getUnitById', {
					params: {
						'unitId': this.res.userInfo.unitId
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
						'Authentication': this.res.token
					}
				}).then((result) => {
					console.log(result)
					if (result.data.code === 200) {
						this.certData = result.data.data
						if (this.certData.unitBusiness !== undefined) {
							this.certName = this.certList[0].label
							let row = {
								url: this.certData.unitBusiness
							}
							this.fileList.push(row)
						}
 					}
				})
			},
			selectType() {
				this.certSelectTypeShow = true
			},
			getCertType(res) {
				console.log(res)
				if (res[0].value !== this.certName) {
					this.fileList.length = 0
					this.$refs.uUpload.clear()
					
					this.certName = res[0].label
					this.certType = res[0].value
					const type = res[0].value
					console.log(type)
					if(type === 0) {
						if (this.certData.transcriptPath !== '' && this.certData.effectiveTime !== '') {
							let row = {
								url: this.certData.transcriptPath
							}
							this.fileList.push(row)
						}
					} else if (type === 1) {
						if (this.certData.graduationPath !== '' && this.certData.certificateTime !== '') {
							let row = {
								url: this.certData.graduationPath
							}
							this.fileList.push(row)
						}
					}
				}
			},
			onUploaded(lists, name) {
				this.fileList = lists;
			},
			submit() {
				let name = ''
				if (this.certType === 0) {
					name = 'businessPic'
				} else if (this.certType === 1) {
					name = 'acceptancePic'
				}
				
				uni.uploadFile({
					url: this.$http.config.baseURL + '/unit/uploadBusinessLicense',    
					filePath: this.fileList[0].url,
					name: name,
					header: {
						'Content-Type': 'multipart/form-data',
						'Authentication': this.res.token,
					},
					formData: {
						'id': this.res.userInfo.unitId
					},
					success: (res) =>{
						let data = JSON.parse(res.data)
						if (data.code === 200){
							uni.showToast({
								title: data.message,
								icon: 'block',
								duration: 1000,
								success: () => {
									setTimeout(() => {
										uni.navigateBack()
									}, 1000)
								}
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
