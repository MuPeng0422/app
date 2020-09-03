<template>
	<view class="content">
		<view class="content-main">
			<u-cell-group>
				<u-cell-item title="单位名称" :value="userInfo.unitName" :arrow="false" @click="showModel('unitName')"></u-cell-item>
				<u-cell-item title="负责人姓名" :value="userInfo.realName" :arrow="false" @click="showModel('realName')"></u-cell-item>
				<u-cell-item title="联系方式" :value="userInfo.mobile" :arrow="false"></u-cell-item>
				<u-cell-item title="身份证号码" :value="userInfo.cardId" :arrow="false" @click="showModel('cardId')"></u-cell-item>
			</u-cell-group>
		</view>
		
		<u-popup v-model="modelshow" width="80%" height="400" mode="center" :safe-area-inset-bottom="true" border-radius="14">
			<view class="popup">
				<view class="title">
					{{ title }}
				</view>
				<view class="taskList" v-if="usernameShow === 'unitName'">
					<view class="label">
						单位名称：
					</view>
					<view class="input">
						<u-input v-model="unitName" placeholder="单位名称" type="text" :border="true" />
					</view>
				</view>
				<view class="taskList" v-else-if="usernameShow === 'realName'">
					<view class="label">
						负责人姓名：
					</view>
					<view class="input">
						<u-input v-model="realName" placeholder="负责人姓名" type="text" :border="true" />
					</view>
				</view>
				<view class="taskList" v-else>
					<view class="label">
						身份证号码：
					</view>
					<view class="input">
						<u-input v-model="cardId" placeholder="身份证号码" type="text" maxlength="18" :border="true" :disabled="true" @click="showKeyBoard"/>
					</view>
				</view>
				<view class="submitBtn">
					<u-button type="primary" size="medium" @click="submit">确认修改</u-button>
				</view>
			</view>
		</u-popup>
		<u-keyboard ref="uKeyboard" mode="card" v-model="keyBoardShow"></u-keyboard>
	</view>
</template>

<script>
	import { mapMutations } from 'vuex';
	export default {
		data() {
			return {
				res: {},
				keyBoardShow: false,
				modelshow: false,
				usernameShow: '',
				title: '修改',
				unitName: '',
				realName: '',
				cardId: '',
				userInfo: {
					unitName: '',
					realName: '',
					mobile: '',
					cardId: ''
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
						this.res = res.data
						
						if (res.data.userInfo.unitName === undefined) {
							this.userInfo.unitName = '请输入单位名称'
						} else {
							this.userInfo.unitName = res.data.userInfo.unitName
							this.unitName = res.data.userInfo.unitName
						}
						
						if (res.data.userInfo.realName === undefined) {
							this.userInfo.realName = '请输入负责人姓名'
						} else {
							this.userInfo.realName = res.data.userInfo.realName
							this.realName = res.data.userInfo.realName
						}
						
						this.userInfo.mobile = res.data.userInfo.mobile
						
						if (res.data.userInfo.cardId === undefined) {
							this.userInfo.idcard = '请输入身份证号码'
						} else {
							let cardNo = res.data.userInfo.cardId
							let str = cardNo.substr(6, 8)
							this.userInfo.cardId = cardNo.replace(str, '********')
							this.cardId = res.data.userInfo.cardId
						}
						
					}
				})
			},
			showKeyBoard() {
				this.keyBoardShow = true
			},
			showModel(type) {
				this.usernameShow = type
				this.modelshow = true
			},
			submit() {
				let data = {}
				if (this.usernameShow === 'unitName') {
					data = {
						'id': this.res.userInfo.unitId,
						'unitName': this.unitName
					}
					
					if (this.unitName === '') {
						this.$u.toast('单位名称不能为空')
					} else {
						this.$http.post('/unit/updateUnit', data, {
							header: {
								'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
								'Authentication': this.res.token
							}
						}).then((res) => {
							this.modelshow = false
							
							this.$http.post('/user/findUserById', {
								'userId': this.res.userInfo.userId
							}, {
								header: {
									'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
									'Authentication': this.res.token
								}
							}).then((result) => {
								
								let userInfo = {
									'userInfo': result.data.data,
									'token': this.res.token
								}
								
								this.login(userInfo)
								this.userInfo.unitName = result.data.data.unitName
								
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
				} else if (this.usernameShow === 'realName') {
					
					data = {
						'userId': this.res.userInfo.userId,
						'realName': this.realName
					}
					
					if (this.realName === '') {
						this.$u.toast('负责人姓名不能为空')
					} else {
						this.$http.post('/user/updateUserInfo', data, {
							header: {
								'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
								'Authentication': this.res.token
							}
						}).then((res) => {
							this.modelshow = false
							
							this.$http.post('/user/findUserById', {
								'userId': this.res.userInfo.userId
							}, {
								header: {
									'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
									'Authentication': this.res.token
								}
							}).then((result) => {
								
								let userInfo = {
									'userInfo': result.data.data,
									'token': this.res.token
								}
								
								this.login(userInfo)
								
								this.userInfo.realName = result.data.data.realName
								
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
				} else {
					data = {
						'userId': this.res.userInfo.userId,
						'cardId': this.cardId
					}
					
					var reg =  /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;
					if(!reg.test(this.cardId)) { 
					    this.$u.toast('请输入正确的身份证号码') 
					    return false; 
					} else {
						this.$http.post('/user/updateUserInfo', data, {
							header: {
								'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
								'Authentication': this.res.token
							}
						}).then((res) => {
							this.modelshow = false
							
							this.$http.post('/user/findUserById', {
								'userId': this.res.userInfo.userId
							}, {
								header: {
									'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
									'Authentication': this.res.token
								}
							}).then((result) => {
								
								let userInfo = {
									'userInfo': result.data.data,
									'token': this.res.token
								}
								
								this.login(userInfo)
								
								this.userInfo.cardId = result.data.data.cardId
								
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
