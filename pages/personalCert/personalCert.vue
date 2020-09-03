<template>
	<view class="content">
		<view class="content-main">
			<u-cell-group>
				<u-cell-item title="证书名称" :value="certName" :arrow="false" @click="selectType"></u-cell-item>
				<u-cell-item title="有效期至" :value="certTime" :arrow="false" v-if="certTimeShow" @click="selectCertTime"></u-cell-item>
				<u-cell-item title="证书等级" :value="certLeaveLabel" :arrow="false" v-else @click="selectCertLeave"></u-cell-item>
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
		<u-select v-model="certSelectTypeLeaveShow" mode="single-column" :list="children" @confirm="getCertTypeLeave"></u-select>
		<u-picker v-model="certSelectTimeShow" mode="time" :default-time="defaultTime" @confirm="getCertTime"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				res: {},
				certType: 0,
				certLeave: 0,
				certName: '请选择证书',
				certTime: '请选择证书有效期',
				certLeaveLabel: '请选择证书等级',
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
						value: 0,
						label: '初级'
					},
					{
						value: 1,
						label: '中级'
					},
					{
						value: 2,
						label: '高级'
					}
				],
				certData: {},
				fileList: [],
				defaultTime: ''
			}
		},
		onLoad() {
			uni.getStorage({//获得保存在本地的用户信息
				key: 'userInfo',  
				success:(res) => {
					this.res = res.data
					this.getUserById()
				}
			})
		},
		methods: {
			getUserById() {
				this.$http.post('/user/findUserById', {
					'userId': this.res.userInfo.userId
				}, {
					header: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
						'Authentication': this.res.token
					}
				}).then((result) => {
					if (result.data.code === 200) {
						this.certData = result.data.data
						if (this.certData.transcriptPath !== undefined || this.certData.graduationPath !== undefined || this.certData.certificatePath !== undefined) {
							this.certName = this.certList[0].label
							this.certTimeShow = true
							this.certTime = this.certData.effectiveTime
							let row = {
								url: this.certData.transcriptPath
							}
							this.fileList.push(row)
						}
 					}
				})
			},
			selectType() {
				this.certSelectTypeShow = true
			},
			selectCertLeave() {
				this.certSelectTypeLeaveShow = true
			},
			selectCertTime() {
				this.certSelectTimeShow = true
				let nowTime = new Date()
				let year = nowTime.getFullYear()
				let month = nowTime.getMonth() + 1
				let day = nowTime.getDate()
				let hours = nowTime.getHours()
				let minutes = nowTime.getMinutes()
				const defaultTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes
				this.defaultTime = defaultTime
			},
			getCertType(res) {
				this.fileList.length = 0
				this.$refs.uUpload.clear()
				if (res[0].value !== this.certName) {
					this.certName = res[0].label
					this.certType = res[0].value
					const type = res[0].value
					if(type === 0) {
						this.certTimeShow = true
						if (this.certData.transcriptPath !== undefined && this.certData.effectiveTime !== undefined) {
							this.certTime = this.certData.effectiveTime
							let row = {
								url: this.certData.transcriptPath
							}
							this.fileList.push(row)
						} else {
							this.certTime = '请选择证书有效期'
						}
					} else if (type === 1) {
						this.certTimeShow = true
						if (this.certData.graduationPath !== undefined && this.certData.certificateTime !== undefined) {
							this.certTime = this.certData.certificateTime
							let row = {
								url: this.certData.graduationPath
							}
							this.fileList.push(row)
						} else {
							this.certTime = '请选择证书有效期'
						}
					} else {
						this.certTimeShow = false
						if (this.certData.certificatePath !== undefined) {
							let row = {
								url: this.certData.certificatePath
							}
							this.fileList.push(row)
						} else {
							this.certLeaveLabel = '请选择证书等级'
						}
					}
				}
			},
			getCertTypeLeave(res) {
				this.certLeave = res[0].value
				this.certLeaveLabel = res[0].label
			},
			getCertTime(obj) {
				this.certTime = obj.year + '-' + obj.month + '-' + obj.day
			},
			onUploaded(lists, name) {
				this.fileList = lists;
			},
			submit() {
				let user = {}
				if (this.certType === 0) {
					user = {
						'userId': this.res.userInfo.userId,
						'cType': this.certType,
						'effectiveTime': this.certTime
					}
					
					if (this.certTime === undefined || this.certTime === '请选择证书有效期') {
						this.$u.toast('请选择证书有效期')
						return false
					}
				} else if (this.certType === 1) {
					user = {
						'userId': this.res.userInfo.userId,
						'cType': this.certType,
						'certificateTime': this.certTime
					}
					
					if (this.certTime === undefined || this.certTime === '请选择证书有效期') {
						this.$u.toast('请选择证书有效期')
						return false
					}
				} else if (this.certType === 2) {
					user = {
						'userId': this.res.userInfo.userId,
						'cType': this.certType,
						'certificateLevel': this.certLeave
					}
					
					if (this.certLeaveLabel === undefined || this.certLeaveLabel === '请选择证书等级') {
						this.$u.toast('请选择证书等级')
						return false
					}
				}
				
				if (this.fileList.length === 0) {
					this.$u.toast('请上传证书')
					return false
				} else {
					uni.uploadFile({
						url: this.$http.config.baseURL + '/user/uploadCertificate',    
						filePath: this.fileList[0].url,
						name: 'userCertificate',
						header: {
							'Content-Type': 'multipart/form-data',
							'Authentication': this.res.token,
						},
						formData: user,
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
