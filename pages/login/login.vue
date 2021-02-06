<template>
	<view class="content">
		<view class="title">
			<text>{{title}}</text>
		</view>
		
		<view class="loginForm">
			<u-form :model="form" :rules="rules" ref="uForm">
				<u-form-item label="手机号码" label-width="150" prop="username">
					<u-input type="text" v-model="form.username" placeholder="请输入手机号码" />
				</u-form-item>
				<u-form-item label="密码" label-width="150" prop="password">
					<u-input type="password" v-model="form.password" placeholder="请输入密码" />
				</u-form-item>
			</u-form>
			
			<view class="bottomBtn">
				<view class="editPhone" @click="changePwd">
					<text>忘记密码？</text>
				</view>
				<view class="reg" @click="register">
					<text>前往注册</text>
				</view>
			</view>
			<view class="submitBtn">
				<u-button type="primary" :throttle-time="2000" @click="submit">登录</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'; 
	import CryptoJS from 'crypto-js'
	export default {
		data() {
			return {
				title: '消防中控室人员管理平台',
				form: {
					username: '',
					password: ''
				},
				rules: {
					username: [
						{
							required: true,
							message: '请输入手机号码',
							trigger: ['change','blur']
						},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value)
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change，二者之间用英文逗号隔开
							trigger: ['change','blur']
						}
					],
					password: [
						{
							required: true,
							message: '请输入密码',
							trigger: ['change','blur']
						}
					]
				}
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)
		},
		onShow() {
			if (uni.hideHomeButton) {
			   uni.hideHomeButton()
			}
		},
		methods: {
			...mapMutations(['login']),
			/**
			* AES加密
			* @param {Object} word 待加密的数据
			* @param {Object} keyStr 密钥
			*/
			encrypt(data) {
				/* AES前端加密 */
				var key = CryptoJS.enc.Utf8.parse('4Dd2Bb3Cc1Aa5Ee0')
				var iv = CryptoJS.enc.Utf8.parse('4Dd2Bb3Cc1Aa5Ee0')
				var str = CryptoJS.AES.encrypt(data, key, {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding}).toString()
				return str
			},
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						uni.showLoading({title: '请求中', mask:true});
						this.$http.post('/login', {
							'username': this.form.username,
							'password': this.encrypt(this.form.password)
						}, {
							header: {
								'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
							}
						}).then((res) => {
							const data = res.data.data.user;
							data.token = res.data.data.token;
							
							uni.hideLoading()
							
							this.login(data)
							uni.reLaunch({
							    url: '/pages/index/index'
							})
						}).catch((err) => {
							uni.hideLoading()
							this.$u.toast(err.data.message)
						})
					}
				})
			},
			// submit() {
			// 	this.$refs.uForm.validate(valid => {
			// 		if (valid) {
			// 			this.$http.post('/phoneLogin',{
			// 				'phoneNum': this.form.phone,
			// 				'code': this.form.code
			// 			}, {
			// 				header: {
			// 					'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
			// 				}
			// 			}).then((res) => {
			// 				if(res.data.code === 200) {
			// 					if (res.data.data !== undefined) {
			// 						this.$http.post('/user/findUserById', {
			// 							'userId': res.data.data.user.userId
			// 						}, {
			// 							header: {
			// 								'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
			// 								'Authentication': res.data.data.token
			// 							}
			// 						}).then((result) => {
			// 							if (res.data.data.user.unitId === 0 || res.data.data.user.unitId === 1000000000) {
			// 								result.data.data.unitName = '暂未加入公司'
			// 							}
										
			// 							let data = {
			// 								'userInfo': result.data.data,
			// 								'token': res.data.data.token
			// 							}
			// 							this.login(data)
										
			// 							// 判断用户是个人登录还是企业登录 0个人 1企业
			// 							if (res.data.data.user.state === 0) {
			// 								uni.reLaunch({
			// 								    url: '/pages/index/index'
			// 								})
			// 								this.$refs.uCode.reset()
			// 							} else {
			// 								uni.reLaunch({
			// 								    url: '/pages/enterprise/index/index'
			// 								})
			// 								this.$refs.uCode.reset()
			// 							}
			// 						})
			// 					} else {
			// 						this.$u.toast(res.data.message)
			// 					}
			// 				} else {
			// 					this.$u.toast(res.data.message)
			// 				}
			// 			})
			// 		}
			// 	})
			// },
			changePwd() {
				uni.navigateTo({
				    url: '/pages/changePwd/changePwd'
				})
			},
			register() {
				uni.navigateTo({
				    url: '/pages/register/register'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #fff;
		
		.title {
			width: 100%;
			margin-top: 100rpx;
			font-size: 48rpx;
			font-weight: bold;
			text-align: center;
			color: #303133;
		}
		
		.loginForm{
			width: 100%;
			padding: 100rpx 5%;
			
			.bottomBtn{
				margin: 50rpx 0;
				width: 100%;
				display: flex;
				justify-content: space-between;
			}
		}
	}
	
</style>
