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
						身份证号码：
					</view>
					<view class="input">
						<u-input v-model="cardNo" type="text" maxlength="18" :border="true" :disabled="true" @click="showCardKeyBoard"/>
					</view>
				</view>
				<view class="submitBtn">
					<u-button type="primary" size="medium" @click="submit">确认修改</u-button>
				</view>
			</view>
		</u-popup>
		<u-keyboard ref="uKeyboard" mode="card" v-model="cardShow" @change="valChange" :mask="false" @backspace="backspace"></u-keyboard>
	</view>
</template>

<script>
	import { mapMutations } from 'vuex';
	export default {
		data() {
			return {
				res: {},
				modelshow: false,
				usernameShow: false,
				cardShow: false,
				title: '修改',
				username: '',
				cardNo: '',
				userInfo: {
					username: '',
					company: '',
					phone: '',
					position: '',
					idcard: ''
				}
			}
		},
		onLoad() {
			this.getUserInfo()
		},
		methods: {
			...mapMutations(['login']),
			getUserInfo() {
				uni.getStorage({//获得保存在本地的用户信息
					key: 'userInfo',  
					success:(res) => {
						this.res = res
						if (res.data.userInfo.state === 0) {
							this.userInfo.position = '职员'
						}
						
						this.userInfo.username = res.data.userInfo.realName
						this.username = res.data.userInfo.realName
						this.userInfo.company = res.data.userInfo.unitName
						this.userInfo.phone = res.data.userInfo.mobile
						
						if (res.data.userInfo.cardId === undefined) {
							this.userInfo.idcard = '请输入身份证号码'
						} else {
							this.cardNo = res.data.userInfo.cardId
							let str = this.cardNo.substr(6, 8)
							this.userInfo.idcard = this.cardNo.replace(str, '********')
						}
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
			showCardKeyBoard() {
				this.cardShow = true
			},
			// 按键被点击(点击退格键不会触发此事件)
			valChange(val) {
				// 将每次按键的值拼接到value变量中，注意+=写法
				this.cardNo += val;
			},
			// 退格键被点击
			backspace() {
				// 删除value的最后一个字符
				if(this.cardNo.length) this.cardNo = this.cardNo.substr(0, this.cardNo.length - 1);
			},
			submit() {
				let data = {}
				if (this.usernameShow) {
					data = {
						'userId': this.res.data.userInfo.userId,
						'realName': this.username
					}
					
					if (this.username === '') {
						this.$u.toast('请输入正确的姓名')
						return false
					}
					
				} else {
					data = {
						'userId': this.res.data.userInfo.userId,
						'cardId': this.cardNo
					}
					
					var reg =  /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;
					if(!reg.test(this.cardNo)) { 
					    this.$u.toast('请输入正确的身份证号码') 
					    return false; 
					} 
				}
				
				
				
				this.$http.post('/user/updateUserInfo', data, {
					header: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
						'Authentication': this.res.data.token
					}
				}).then((res) => {
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
						
						this.login(userInfo)
						
						this.userInfo.username = result.data.data.realName
						this.userInfo.idcard = result.data.data.cardId
						
						// 返回刷新
						
						let pages = getCurrentPages(); // 当前页面
						let beforePage = pages[pages.length - 2]; // 前一个页面
						uni.navigateBack({
						    success: function() {
						        beforePage.onLoad(); // 执行前一个页面的onLoad方法
						    }
						});
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
