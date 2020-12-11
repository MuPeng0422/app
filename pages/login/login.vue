<template>
	<view class="content">
		<view class="title">
			<text>{{title}}</text>
		</view>
		
		<view class="loginForm">
			<view>
				<u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false"
				 swiperWidth="750"></u-tabs-swiper>
			</view>
			<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 800rpx;width: 100%;">
						<u-form :model="form" :rules="rules" ref="uForm">
							<u-form-item label="手机号码" label-width="150" prop="phone">
								<u-input type="number" v-model="form.phone" placeholder="请输入手机号码" maxlength="11" />
							</u-form-item>
							<u-form-item label="短信验证码" label-width="150" prop="code">
								<u-input type="number" v-model="form.code" placeholder="请输入短信验证码" maxlength="6" />
								<u-button slot="right" type="success" size="mini" @click="getCode">{{tips}}</u-button>
							</u-form-item>
						</u-form>
						<view class="submitBtn">
							<u-button type="primary" :throttle-time="2000" @click="submit">登录</u-button>
						</view>
						<view class="bottomBtn">
							<view class="editPhone" @click="changePwd">
								<text>{{editPhone}}</text>
							</view>
							<view class="reg" @click="register">
								<text>{{reg}}</text>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 800rpx;width: 100%;">
						<u-form :model="pwdform" :rules="pwdrules" ref="uFormPwd">
							<u-form-item label="用户名" label-width="150" prop="username">
								<u-input type="text" v-model="pwdform.username" placeholder="请输入用户名" />
							</u-form-item>
							<u-form-item label="密码" label-width="150" prop="password">
								<u-input type="password" v-model="pwdform.password" placeholder="请输入密码" />
							</u-form-item>
						</u-form>
						<view class="submitBtn">
							<u-button type="primary" :throttle-time="2000" @click="pwdsubmit">登录</u-button>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
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
	import { mapState, mapMutations } from 'vuex'; 
	import CryptoJS from 'crypto-js'
	export default {
		data() {
			return {
				list: [{
					name: '手机登录'
				}, {
					name: '账号登录'
				}],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				tabs: [
					{
						name: '1'
					},
					{
						name: '2'
					}
				],
				title: '消防中控室人员管理平台',
				editPhone: '手机丢失？',
				reg: '立即注册',
				form: {
					phone: '',
					code: ''
				},
				pwdform: {
					username: '',
					password: ''
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
				},
				pwdrules: {
					username: [
						{
							required: true,
							message: '请输入用户名',
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
			this.$refs.uFormPwd.setRules(this.pwdrules)
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
			tabsChange(index) {
				this.swiperCurrent = index;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			codeChange(text) {
				this.tips = text
			},
			getCode() {
				if (this.form.phone === '') {
					this.$u.toast('手机号不能为空')
				} else {
					if(this.$refs.uCode.canGetCode) {
						this.$refs.uCode.start()
						this.$http.get('/phoneNumValidation', {
							params: {
								'phoneNum': this.form.phone
							}
						}).then((res) => {
							if (res.data.data === undefined) {
								uni.showToast({
									title: '该手机号未注册，请您先注册',
									icon: 'none',
									duration: 1000,
									success: () => {
										setTimeout(() => {
											uni.navigateTo({
												url: '../register/register'
											})
										}, 2000)
									}
								})
							} else {
								this.$http.get('/sendVerificationCode', {
									params: {
										'phoneNum': this.form.phone
									}
								}).then((res) => {
									this.$u.toast('验证码已发送')
								})
							}
						})
					} else {
						this.$u.toast('倒计时结束后再发送')
					}
				}
			},
			pwdsubmit() {
				this.$refs.uFormPwd.validate(valid => {
					if (valid) {
						uni.showLoading({title: '请求中',mask:true})
						this.$http.post('/login', {
							username: this.pwdform.username,
							password: this.encrypt(this.pwdform.password)
						}, {
							header: {
								'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
							}
						}).then((res) => {
							uni.hideLoading()
							this.login(res.data)
							uni.reLaunch({
							    url: '/pages/admin/index'
							})
						}).catch((err) => {
							uni.hideLoading()
							this.$u.toast(err.data.message)
						})
					}
				})
			},
			end() {
				// this.$u.toast('倒计时结束')
				console.log('倒计时结束')
			},
			start() {
				// this.$u.toast('倒计时开始')
				console.log('倒计时开始')
			},
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						this.$http.post('/phoneLogin',{
							'phoneNum': this.form.phone,
							'code': this.form.code
						}, {
							header: {
								'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
							}
						}).then((res) => {
							if(res.data.code === 200) {
								if (res.data.data !== undefined) {
									this.$http.post('/user/findUserById', {
										'userId': res.data.data.user.userId
									}, {
										header: {
											'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
											'Authentication': res.data.data.token
										}
									}).then((result) => {
										if (res.data.data.user.unitId === 0 || res.data.data.user.unitId === 1000000000) {
											result.data.data.unitName = '暂未加入公司'
										}
										
										let data = {
											'userInfo': result.data.data,
											'token': res.data.data.token
										}
										this.login(data)
										
										// 判断用户是个人登录还是企业登录 0个人 1企业
										if (res.data.data.user.state === 0) {
											uni.reLaunch({
											    url: '/pages/index/index'
											})
											this.$refs.uCode.reset()
										} else {
											uni.reLaunch({
											    url: '/pages/enterprise/index/index'
											})
											this.$refs.uCode.reset()
										}
									})
								} else {
									this.$u.toast(res.data.message)
								}
							} else {
								this.$u.toast(res.data.message)
							}
						})
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
	
	swiper{
		height: 500rpx;
	}
	
</style>
