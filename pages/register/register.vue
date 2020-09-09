<template>
	<view class="content">
		<view>
			<u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false"
			 swiperWidth="750"></u-tabs-swiper>
		</view>
		<swiper class="swiper" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item" v-for="(item, index) in list" :key="index">
				<scroll-view>
					<u-form :model="form" :rules="rules" :ref="'uForm' + index">
						<u-form-item label="手机号码" label-width="150" prop="phone">
							<u-input type="number" v-model="form.phone" placeholder="请输入您的手机号码" maxlength="11"/>
						</u-form-item>
						<u-form-item label="短信验证码" label-width="150" prop="code">
							<u-input type="number" v-model="form.code" placeholder="请输入短信验证码" />
							<u-button slot="right" type="success" size="mini" @click="getCode">{{tips}}</u-button>
						</u-form-item>
					</u-form>
					<view class="submitBtn">
						<u-row gutter="16" justify="around">
							<u-col span="6">
								<u-button :custom-style="customStyle" size="medium" type="primary" :throttle-time="2000" @click="submit">确认注册</u-button>
							</u-col>
							<u-col span="6">
								<u-button :custom-style="customStyle" size="medium" type="info" :hair-line="false" @click="cancel">取消</u-button>
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
	</view>
</template>

<script>
	import { mapMutations } from 'vuex'; 
	export default {
		data() {
			return {
				list: [{
					name: '个人注册'
				}, {
					name: '企业注册'
				}],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
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
					]
				},
				customStyle: {
					width: '100%'
				}
			};
		},
		onReady() {
			this.list.forEach((item, index) => {
				this.$refs['uForm' + index][0].setRules(this.rules)
			})
		},
		onShow() {
			if (uni.hideHomeButton) {
			   uni.hideHomeButton()
			}
		},
		methods: {
			...mapMutations(['login']),
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
			end() {
				// this.$u.toast('倒计时结束')
			},
			start() {
				// this.$u.toast('倒计时开始')
			},
			getCode() {
				if (this.form.phone !== '') {
					if(this.$refs.uCode.canGetCode) {
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start()
						setTimeout(() => {
							// 这里此提示会被this.start()方法中的提示覆盖
							this.$http.get('/phoneNumValidation', {
								params: {
									'phoneNum': this.form.phone
								}
							}).then((res) => {
								if (res.data.data === undefined) {
									this.$http.get('/sendVerificationCode', {
										params: {
											'phoneNum': this.form.phone
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
			submit() {
				this.$refs['uForm' + this.current][0].validate(valid => {
					if (valid) {
						this.$http.post('/phoneRegist', {
							'mobile': this.form.phone,
							'state': this.current // 0个人 1 企业
						}, {
							header: {
								'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
							}
						}).then((res) => {
							if (res.data.data === 1) {
								this.$http.post('/phoneLogin', {
									'phoneNum': this.form.phone,
									'code': this.form.code
								}, {
									header: {
										'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
									}
								}).then((result) => {
									if(result.data.code === 200) {
										
										if (result.data.data !== undefined) {
											this.$http.post('/user/findUserById', {
												'userId': result.data.data.user.userId
											}, {
												header: {
													'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
													'Authentication': result.data.data.token
												}
											}).then((results) => {
												
												if (results.data.data.unitId === undefined) {
													results.data.data.unitName = '暂未加入公司'
												}
												
												let data = {
													'userInfo': results.data.data,
													'token': result.data.data.token
												}
												this.login(data)
												
												// 判断用户是个人登录还是企业登录 0个人 1企业
												if (results.data.data.state === 0) {
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
											this.$u.toast(result.data.message)
										}
									} else {
										this.$u.toast(result.data.message)
									}
								})
							} else {
								this.$u.toast('手机号已注册')
							}
						})
					} else {
						console.log('验证失败')
					}
				})
			},
			cancel() {
				uni.navigateBack()
			},
			finish(value) {
				this.form.code = value
			}
		}
	};
</script>

<style lang="scss" scoped>
	.content{
		padding: 0 50rpx;
		background-color: #fff;
		
		.swiper{
			height: 450rpx;
			
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