<template>
	<view class="content">
		<view class="u-tabs-box">
			<u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false"
			 swiperWidth="750"></u-tabs-swiper>
		</view>
		<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item">
				<scroll-view>
					<u-form :model="form" :rules="rules" ref="uForm">
						<u-form-item label="姓名" label-width="150" label-position="left" label-align="right" prop="realName">
							<u-input type="text" v-model="form.realName" placeholder="请输入您的姓名" />
						</u-form-item>
						<u-form-item label="手机号码" label-width="150" label-position="left" label-align="right" prop="mobile">
							<u-input type="number" v-model="form.mobile" placeholder="请输入您的手机号码" maxlength="11"/>
						</u-form-item>
						<u-form-item label="短信验证码" label-width="150" label-position="left" label-align="right" prop="code">
							<u-input type="number" v-model="form.code" placeholder="请输入短信验证码" maxlength="6" />
							<u-button slot="right" type="success" size="mini" @click="getCode">{{tips}}</u-button>
						</u-form-item>
						<u-form-item label="登录密码" label-width="150" label-position="left" label-align="right" prop="password">
							<u-input type="password" v-model="form.password" placeholder="请输入您的登录密码" />
						</u-form-item>
						<u-form-item label="重复密码" label-width="150" label-position="left" label-align="right" prop="repeatPWD">
							<u-input type="password" v-model="form.repeatPWD" placeholder="请输入您的重复密码" />
						</u-form-item>
					</u-form>
					<view class="submitBtn">
						<u-row gutter="16" justify="around">
							<u-col span="6">
								<u-button :custom-style="customStyle" size="medium" type="primary" :throttle-time="2000" @click="submit(0)">确认注册</u-button>
							</u-col>
							<u-col span="6">
								<u-button :custom-style="customStyle" size="medium" type="" :hair-line="false" @click="cancel">取消</u-button>
							</u-col>
						</u-row>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<scroll-view>
					<u-form :model="form1" :rules="rules1" ref="uForm1">
						<u-form-item label="单位名称" label-width="150" label-position="left" label-align="right" prop="unitName">
							<u-input type="text" v-model="form1.unitName" placeholder="所在单位名称" />
						</u-form-item>
						<u-form-item label="姓名" label-width="150" label-position="left" label-align="right" prop="realName">
							<u-input type="text" v-model="form1.realName" placeholder="请输入您的姓名" />
						</u-form-item>
						<u-form-item label="手机号码" label-width="150" label-position="left" label-align="right" prop="mobile">
							<u-input type="number" v-model="form1.mobile" placeholder="请输入您的手机号码" maxlength="11"/>
						</u-form-item>
						<u-form-item label="所在区域" label-width="150" label-position="left" label-align="right" prop="reachName">
							<u-input :border="border" type="select" :select-open="actionSheetShow" v-model="form1.reachName" placeholder="请选择所在区域" @click="actionSheetShow = true"></u-input>
						</u-form-item>
						<u-form-item label="短信验证码" label-width="150" label-position="left" label-align="right" prop="code">
							<u-input type="number" v-model="form1.code" placeholder="请输入短信验证码" maxlength="6" />
							<u-button slot="right" type="success" size="mini" @click="getCode1">{{tips1}}</u-button>
						</u-form-item>
						<u-form-item label="登录密码" label-width="150" label-position="left" label-align="right" prop="password">
							<u-input type="password" v-model="form1.password" placeholder="请输入您的登录密码" />
						</u-form-item>
						<u-form-item label="重复密码" label-width="150" label-position="left" label-align="right" prop="repeatPWD">
							<u-input type="password" v-model="form1.repeatPWD" placeholder="请输入您的重复密码" />
						</u-form-item>
					</u-form>
					<view class="submitBtn">
						<u-row gutter="16" justify="around">
							<u-col span="6">
								<u-button :custom-style="customStyle" size="medium" type="primary" :throttle-time="2000" @click="submit(1)">确认注册</u-button>
							</u-col>
							<u-col span="6">
								<u-button :custom-style="customStyle" size="medium" type="" :hair-line="false" @click="cancel1">取消</u-button>
							</u-col>
						</u-row>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<u-verification-code
			:seconds="seconds"
			@end="end"
			@start="start"
			ref="uCode"
			@change="codeChange"
		></u-verification-code>
		<u-verification-code
			:seconds="seconds1"
			@end="end1"
			@start="start1"
			ref="uCode1"
			@change="codeChange1"
		></u-verification-code>
		<u-select mode="single-column" :list="selectList" value-name="id" label-name="reachName" v-model="actionSheetShow" @confirm="selectConfirm"></u-select>
	</view>
</template>

<script>
	import { mapMutations } from 'vuex'; 
	import CryptoJS from 'crypto-js';
	export default {
		data() {
			return {
				actionSheetShow: false,
				selectList: [],
				list: [{
					name: '建（构）筑消防员注册'
				}, {
					name: '负责人注册'
				}],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				form: {
					realName: '',
					mobile: '',
					code: '',
					password: '',
					repeatPWD: ''
				},
				form1: {
					unitName: '',
					realName: '',
					reachName: '',
					reachId: '',
					mobile: '',
					code: '',
					password: '',
					repeatPWD: ''
				},
				tips: '',
				seconds: 120,
				tips1: '',
				seconds1: 120,
				rules: {
					realName: [{ required: true, message: '请输入姓名', trigger: ['change','blur'] }],
					mobile: [
						{
							required: true,
							message: '请输入手机号',
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
					],
					password: [
						{
							required: true,
							message: '请输入密码',
							trigger: ['change','blur']
						}
					],
					repeatPWD: [
						{
							required: true,
							message: '请输入重复密码',
							trigger: ['change','blur']
						},
						{
							validator: (rule, value, callback) => {
								return value === this.form.password;
							},
							message: '两次输入的密码不相等',
							trigger: ['change','blur'],
						}
					]
				},
				rules1: {
					unitName: [{ required: true, message: '请输入公司名称', trigger: ['change','blur'] }],
					realName: [{ required: true, message: '请输入姓名', trigger: ['change','blur'] }],
					reachName: [{ required: true, message: '请选择所在区域', trigger: 'change' }],
					mobile: [
						{
							required: true,
							message: '请输入手机号',
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
					],
					password: [
						{
							required: true,
							message: '请输入密码',
							trigger: ['change','blur']
						}
					],
					repeatPWD: [
						{
							required: true,
							message: '请输入重复密码',
							trigger: ['change','blur']
						},
						{
							validator: (rule, value, callback) => {
								return value === this.form1.password;
							},
							message: '两次输入的密码不相等',
							trigger: ['change','blur'],
						}
					]
				},
				customStyle: {
					width: '100%'
				}
			};
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)
		},
		onShow() {
			if (uni.hideHomeButton) {
			   uni.hideHomeButton()
			}
		},
		onLoad() {
			this.getReachList()
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
			// 获取区域列表
			getReachList() {
				this.$http.get('/reach').then(res => {
					console.log(res)
					this.selectList = res.data.data;
				})
			},
			selectConfirm(e) {
				console.log(e)
				this.form1.reachName = e[0].label;
				this.form1.reachId = e[0].value;
			},
			// tabs通知swiper切换
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
			codeChange1(text) {
				this.tips1 = text
			},
			end() {
				// this.$u.toast('倒计时结束')
			},
			start() {
				// this.$u.toast('倒计时开始')
			},
			getCode() {
				if (this.form.mobile !== '') {
					if(this.$refs.uCode.canGetCode) {
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start()
						setTimeout(() => {
							// 这里此提示会被this.start()方法中的提示覆盖
							this.$http.get('/phoneNumValidation', {
								params: {
									'phoneNum': this.form.mobile
								}
							}).then((res) => {
								if (res.data.data === undefined) {
									this.$http.get('/sendVerificationCode', {
										params: {
											'phoneNum': this.form.mobile
										}
									}).then((res) => {
										this.$u.toast('验证码已发送')
									})
									
								} else {
									this.$u.toast('手机号已注册')
									this.$refs.uCode.reset()
								}
							})
						}, 1000);
					} else {
						this.$u.toast('倒计时结束后再发送')
					}
				} else {
					this.$u.toast('请填写正确的手机号')
				}
			},
			getCode1() {
				if (this.form1.mobile !== '') {
					if(this.$refs.uCode1.canGetCode) {
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode1.start()
						setTimeout(() => {
							// 这里此提示会被this.start()方法中的提示覆盖
							this.$http.get('/phoneNumValidation', {
								params: {
									'phoneNum': this.form1.mobile
								}
							}).then((res) => {
								if (res.data.data === undefined) {
									this.$http.get('/sendVerificationCode', {
										params: {
											'phoneNum': this.form1.mobile
										}
									}).then((res) => {
										this.$u.toast('验证码已发送')
									})
									
								} else {
									this.$u.toast('手机号已注册')
									this.$refs.uCode1.reset()
								}
							})
						}, 1000);
					} else {
						this.$u.toast('倒计时结束后再发送')
					}
				} else {
					this.$u.toast('请填写正确的手机号')
				}
			},
			submit(type) {
				if (type === 0) {
					this.$refs.uForm.validate(valid => {
						if (valid) {
							uni.showLoading({
								title: '注册中...',
								mask: false
							})
							
							
							this.$http.post('/phoneRegist', {
								'mobile': this.form.mobile,
								'password': this.encrypt(this.form.password),
								'state': type
							}, {
								header: {
									'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
								}
							}).then((res) => {
								// 判断用户是个人登录还是企业登录 0个人 1企业
								if (res.data.data === 0 || res.data.data === 1) {
									uni.hideLoading();
									uni.showToast({
										icon: 'success',
										title: '注册成功！',
										success: (res) => {
											setTimeout(() => {
												uni.reLaunch({
												    url: '/pages/login/login'
												})
											}, 1000)
										}
									})
									this.$refs.uCode1.reset();
								} else {
									uni.showToast({
										icon: 'none',
										title: res.data.message
									})
								}
								
								// if (res.data.data === 1) {
								// 	this.$http.post('/phoneLogin', {
								// 		'phoneNum': this.form.phone,
								// 		'code': this.form.code
								// 	}, {
								// 		header: {
								// 			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
								// 		}
								// 	}).then((result) => {
								// 		if(result.data.code === 200) {
											
								// 			if (result.data.data !== undefined) {
								// 				this.$http.post('/user/findUserById', {
								// 					'userId': result.data.data.user.userId
								// 				}, {
								// 					header: {
								// 						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
								// 						'Authentication': result.data.data.token
								// 					}
								// 				}).then((results) => {
													
								// 					if (results.data.data.unitId === undefined) {
								// 						results.data.data.unitName = '暂未加入公司'
								// 					}
													
								// 					let data = {
								// 						'userInfo': results.data.data,
								// 						'token': result.data.data.token
								// 					}
								// 					this.login(data)
													
								// 					// 判断用户是个人登录还是企业登录 0个人 1企业
								// 					if (results.data.data.state === 0) {
								// 						uni.reLaunch({
								// 						    url: '/pages/index/index'
								// 						})
								// 						this.$refs.uCode.reset();
								// 					} else {
								// 						uni.reLaunch({
								// 						    url: '/pages/enterprise/index/index'
								// 						})
								// 						this.$refs.uCode.reset();
								// 					}
								// 				})
								// 			} else {
								// 				this.$u.toast(result.data.message)
								// 			}
								// 		} else {
								// 			this.$u.toast(result.data.message)
								// 		}
								// 	})
								// } else {
								// 	this.$u.toast('手机号已注册')
								// }
							})
						} else {
							console.log('验证失败')
						}
					})
				} else {
					this.$refs.uForm1.validate(valid => {
						if (valid) {
							uni.showLoading({
								title: '注册中...',
								mask: false
							})
							
							this.$http.post('/phoneRegist', {
								'mobile': this.form1.mobile,
								'password': this.encrypt(this.form1.password),
								'state': type
							}, {
								header: {
									'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
								}
							}).then((res) => {
								
								// 判断用户是个人登录还是企业登录 0个人 1企业
								if (res.data.data === 0 || res.data.data === 1) {
									uni.hideLoading();
									uni.showToast({
										icon: 'success',
										title: '注册成功！',
										success: (res) => {
											setTimeout(() => {
												uni.reLaunch({
												    url: '/pages/login/login'
												})
											}, 1000)
										}
									})
									this.$refs.uCode1.reset();
								} else {
									uni.showToast({
										icon: 'none',
										title: res.data.message
									})
								}
								
								// if (res.data.data === 1) {
								// 	this.$http.post('/phoneLogin', {
								// 		'phoneNum': this.form1.phone,
								// 		'code': this.form1.code
								// 	}, {
								// 		header: {
								// 			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
								// 		}
								// 	}).then((result) => {
								// 		if(result.data.code === 200) {
											
								// 			if (result.data.data !== undefined) {
								// 				this.$http.post('/user/findUserById', {
								// 					'userId': result.data.data.user.userId
								// 				}, {
								// 					header: {
								// 						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
								// 						'Authentication': result.data.data.token
								// 					}
								// 				}).then((results) => {
													
								// 					if (results.data.data.unitId === undefined) {
								// 						results.data.data.unitName = '暂未加入公司'
								// 					}
													
								// 					let data = {
								// 						'userInfo': results.data.data,
								// 						'token': result.data.data.token
								// 					}
								// 					this.login(data)
													
								// 					// 判断用户是个人登录还是企业登录 0个人 1企业
								// 					if (results.data.data.state === 0) {
								// 						uni.reLaunch({
								// 						    url: '/pages/index/index'
								// 						})
								// 						this.$refs.uCode1.reset();
								// 					} else {
								// 						uni.reLaunch({
								// 						    url: '/pages/enterprise/index/index'
								// 						})
								// 						this.$refs.uCode1.reset();
								// 					}
								// 				})
								// 			} else {
								// 				this.$u.toast(result.data.message)
								// 			}
								// 		} else {
								// 			this.$u.toast(result.data.message)
								// 		}
								// 	})
								// } else {
								// 	this.$u.toast('手机号已注册')
								// }
							})
						} else {
							console.log('验证失败')
						}
					})
				}
			},
			cancel() {
				uni.navigateBack()
			}
		}
	};
</script>

<style>
/* #ifndef H5 */
page {
	height: 100%;
	background-color: #FFFFFF;
}
/* #endif */
</style>

<style lang="scss" scoped>
	.content{
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;
		
		.swiper-box {
			flex: 1;
		}
		.swiper-item {
			height: 100%;
			padding: 0 50rpx 50rpx 50rpx;
			box-sizing: border-box;
			overflow-y: auto;
			background-color: #FFFFFF;
			
			.submitBtn{
				margin-top: 50rpx;
			}
			.bottomBtn{
				width: 100%;
				display: flex;
				justify-content: space-between;
			}
		}
	}
</style>