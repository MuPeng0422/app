<template>
	<view class="content">
		<view class="title">
			<text>{{title}}</text>
		</view>
		
		<view class="loginForm">
			<u-form :model="form" :rules="rules" ref="uForm">
				<u-form-item label="手机号码" label-width="150" prop="phone">
					<u-input type="number" v-model="form.phone" placeholder="请输入手机号码" maxlength="11" />
				</u-form-item>
				<u-form-item label="短信验证码" label-width="150" prop="code">
					<u-input type="number" v-model="form.code" placeholder="请输入短信验证码" />
					<u-button slot="right" type="success" size="mini" @click="getCode">{{tips}}</u-button>
				</u-form-item>
			</u-form>
			<view class="submitBtn">
				<u-button type="primary" open-type="getUserInfo" @click="submit">提交</u-button>
			</view>
			<view class="bottomBtn">
				<view class="editPhone" @click="changePwd">
					<text>{{editPhone}}</text>
				</view>
				<view class="reg" @click="register">
					<text>{{reg}}</text>
				</view>
			</view>
		</view>
		<u-verification-code
			:seconds="seconds"
			@end="end"
			@start="start"
			ref="uCode"
			@change="codeChange"
		></u-verification-code>
	</view>
</template>

<script>
	 import { mapMutations } from 'vuex'; 
	export default {
		data() {
			return {
				title: '消防中控室人员管理平台',
				editPhone: '手机丢失？',
				reg: '立即注册',
				form: {
					phone: '',
					code: ''
				},
				tips: '',
				seconds: 120,
				rules: {
					phone: [
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
					code: [
						{
							required: true,
							message: '请输入短信验证码',
							trigger: ['change','blur']
						},
						{
							type: 'number',
							message: '短信验证码只能为数字',
							trigger: ['change','blur']
						}
					]
				}
			}
		},
		onLoad() {
			if(this.$store.state.hasLogin) {
				uni.navigateTo({
				    url: '/pages/index/index'
				})
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)
		},
		methods: {
			...mapMutations(['login', 'getUserInfo']),
			codeChange(text) {
				this.tips = text
			},
			getCode() {
				if(this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
					this.$refs.uCode.start()
					setTimeout(() => {
						uni.hideLoading()
						// 这里此提示会被this.start()方法中的提示覆盖
						// 通知验证码组件内部开始倒计时
						uni.request({
							url: 'http://192.168.0.34:9527/sendVerificationCode',
							data: {
								'phoneNum': this.form.phone
							},
							method: 'GET',
							dataType: 'json',
							success: (res) => {
								this.$u.toast('验证码已发送')
							}
						})
					}, 2000);
				} else {
					this.$u.toast('倒计时结束后再发送')
				}
			},
			end() {
				this.$u.toast('倒计时结束')
			},
			start() {
				this.$u.toast('倒计时开始')
			},
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						uni.request({
							url: 'http://192.168.0.34:9527/phoneLogin',
							data: {
								phoneNum: this.form.phone,
								code: this.form.code
							},
							method: 'POST',
							header: {
								'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
							},
							dataType: 'json',
							success: (res) => {
								console.log(res)
								console.log('data', res.data) 
								if(res.data.code === 200) {
									// this.$store.commit('login', res.data.data)
									this.login(res.data.data)
									
									// 判断用户是个人登录还是企业登录 0个人 1企业
									if (res.data.data.user.state === 0) {
										uni.navigateTo({
										    url: '/pages/index/index'
										})
									} else {
										uni.navigateTo({
										    url: '/pages/index/index'
										})
									}
									
									uni.getUserInfo({
										success: (res) => {
											console.log(res)
											// this.$store.commit('getUserInfo', res.userInfo)
											this.getUserInfo(res.userInfo)
										}
									})
								} else {
									uni.showToast({
										title: res.data.message,
										icon: 'none',
										duration: 2000
									})
								}
							}
						})
					} else {
						console.log('验证失败')
					}
				})
			},
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
			
			.submitBtn{
				margin: 50rpx 0;
			}
			.bottomBtn{
				width: 100%;
				display: flex;
				justify-content: space-between;
			}
		}
	}
	
</style>
