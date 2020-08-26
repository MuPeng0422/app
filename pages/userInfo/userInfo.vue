<template>
	<view class="content">
		<view class="content-main">
			<u-cell-group>
				<u-cell-item title="姓名" :value="userInfo.username" :arrow="false" @click="showModel('username')"></u-cell-item>
				<u-cell-item title="所在单位" :value="userInfo.company" :arrow="false"></u-cell-item>
				<u-cell-item title="联系方式" :value="userInfo.phone" :arrow="false"></u-cell-item>
				<u-cell-item title="岗位" :value="userInfo.position" :arrow="false"></u-cell-item>
				<u-cell-item title="身份证号码" :value="userInfo.idcard" :arrow="false" @click="showModel('idcard')"></u-cell-item>
			</u-cell-group>
		</view>
		
		<u-popup v-model="modelshow" width="80%" height="400" mode="center" :safe-area-inset-bottom="true" border-radius="14">
			<view class="popup">
				<view class="title">
					{{ title }}
				</view>
				<view class="taskList" v-if="usernameShow">
					<view class="label">
						姓名：
					</view>
					<view class="input">
						<u-input v-model="username" type="text" :border="true" />
					</view>
				</view>
				<view class="taskList" v-else>
					<view class="label">
						身份证号：
					</view>
					<view class="input">
						<u-input v-model="idcard" type="text" :border="true" />
					</view>
				</view>
				<view class="submitBtn">
					<u-button type="primary" size="medium" @click="submit">确认修改</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				res: {},
				modelshow: false,
				usernameShow: false,
				title: '修改',
				userInfo: {
					username: '',
					company: '',
					phone: '',
					position: '',
					idcard: '请输入您的身份证号码'
				}
			}
		},
		onLoad() {
			this.getUserInfo()
		},
		onBackPress(event) {
			console.log('e', event);
		},
		methods: {
			getUserInfo() {
				uni.getStorage({//获得保存在本地的用户信息
					key: 'userInfo',  
					success:(res) => {
						console.log('resresresres',  res)
						this.res = res
						if (res.data.userInfo.state === 0) {
							this.userInfo.position = '职员'
						}
						this.userInfo.username = res.data.userInfo.realName
						this.userInfo.company = res.data.userInfo.unitName
						this.userInfo.phone = res.data.userInfo.mobile
						this.userInfo.idcard = res.data.userInfo.cardId
					}
				})
			},
			showModel(type) {
				this.modelshow = true
				if (type === 'username') {
					this.usernameShow = true
				} else if (type === 'idcard') {
					this.usernameShow = false
				}
			},
			submit() {
				let data = {}
				console.log(this.res)
				if (this.usernameShow) {
					data = {
						'userId': this.res.data.userInfo.userId,
						'realName': this.username
					}
				} else {
					data = {
						'userId': this.res.data.userInfo.userId,
						'cardId': this.idcard
					}
				}
				this.$http.post('/user/updateUserInfo', data, {
					header: {
						'Authentication': this.res.data.token
					}
				}).then((res) => {
					console.log(res)
					this.modelshow = false
					
					this.$http.post('/user/findUserById', {
						'userId': this.res.data.userInfo.userId
					}, {
						header: {
							'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
							'Authentication': this.res.data.token
						}
					}).then((result) => {
						console.log('result', result)
						
						let userInfo = {
							'userInfo': result.data.data,
							'token': this.res.data.token
						}
						
						uni.setStorage({// 将用户信息保存在本地
						    key: 'userInfo',  
						    data: userInfo
						})
						
						if (result.data.data.state === 0) {
							this.userInfo.position = '职员'
						}
						this.userInfo.username = result.data.data.realName
						this.userInfo.company = result.data.data.unitName
						this.userInfo.phone = result.data.data.mobile
						this.userInfo.idcard = result.data.data.cardId
					})
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
		}
		
		.popup{
			height: 100%;
			padding: 30rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			
			.title{
				font-size: 36rpx;
				margin-bottom: 20rpx;
				text-align: center;
				font-weight: bold;
			}
			
			.taskList{
				margin-bottom: 20rpx;
				display: flex;
				align-items: center;
				
				.input{
					flex: 1;
				}
			}
			
			.submitBtn{
				width: 200rpx;
				margin: 0 auto;
			}
		}
	}
</style>
