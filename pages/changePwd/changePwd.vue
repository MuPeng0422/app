<template>
	<view class="content">
		<view class="changePwdForm">
			<u-form :model="form" :rules="rules" ref="uForm">
				<u-form-item label="旧手机号码" label-width="150" prop="oldPhone">
					<u-input type="number" v-model="form.oldPhone" placeholder="请输入旧手机号码" maxlength="11" />
				</u-form-item>
				<u-form-item label="新手机号码" label-width="150" prop="newPhone">
					<u-input type="number" v-model="form.newPhone" placeholder="请输入新手机号码" maxlength="11" />
				</u-form-item>
				<u-form-item label="身份证号码" label-width="150" prop="idCard">
					<u-input type="number" v-model="form.idCard" placeholder="请输入身份证号码" maxlength="18" />
				</u-form-item>
				<u-form-item label="短信验证码" label-width="150" prop="code">
					<u-input type="number" v-model="form.code" placeholder="请输入短信验证码" />
					<u-button slot="right" type="success" size="mini" @click="getCode">{{tips}}</u-button>
				</u-form-item>
				<view class="submitBtn">
					<u-row gutter="16" justify="around">
						<u-col span="6">
							<u-button :custom-style="customStyle" size="medium" type="primary" @click="submit">确认修改</u-button>
						</u-col>
						<u-col span="6">
							<u-button :custom-style="customStyle" size="medium" type="info" :hair-line="false" @click="cancel">取消</u-button>
						</u-col>
					</u-row>
				</view>
			</u-form>
			
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
	export default {
		data() {
			return {
				form: {
					oldPhone: '',
					newPhone: '',
					idCard: '',
					code: ''
				},
				tips: '',
				seconds: 120,
				rules: {
					oldPhone: [
						{
							required: true,
							message: '请输入旧手机号码',
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
					newPhone: [
						{
							required: true,
							message: '请输入旧手机号码',
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
					idCard: [
						{
							required: true,
							message: '请输入身份证号码',
							trigger: ['change','blur']
						},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.idCard(value)
							},
							message: '身份证号码不正确',
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
			}
		},
		onLoad() {

		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)
		},
		methods: {
			codeChange(text) {
				this.tips = text
			},
			getCode() {
				if(this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
					setTimeout(() => {
						uni.hideLoading()
						// 这里此提示会被this.start()方法中的提示覆盖
						this.$u.toast('验证码已发送')
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start()
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
						console.log('验证通过')
					} else {
						console.log('验证失败')
					}
				})
			},
			cancel() {
				uni.navigateBack()
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
		
		.changePwdForm{
			width: 100%;
			padding: 50rpx 5%;
			
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
