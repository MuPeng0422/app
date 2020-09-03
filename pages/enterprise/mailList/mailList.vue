<template>
	<view class="content">
		<view class="mail-list" v-if="datalist.length > 0">
			<view class="mail-item" v-for="(item, index) in datalist" :key="index">
				<view class="mail-avatar">
					<u-avatar :src="item.userpicPath" mode="circle"></u-avatar>
				</view>
				<view class="mail-info">
					<view class="mail-info-content">
						<view class="mail-info-name">
							{{ item.realName }}
						</view>
						<view class="mail-info-phone">
							{{ item.mobile }}
						</view>
					</view>
					<view class="mail-info-status">
						<u-button :type="item.type" :custom-style="customStyle" size="mini" >{{ item.statusName }}</u-button>
					</view>
				</view>
			</view>
		</view>
		<view class="empty" v-else>
			<view>
				<u-empty text="暂无数据" mode="data"></u-empty>
			</view>
		</view>
		<view class="addBtn">
			<u-button type="primary" style="width: 80%;" @click="addUser">添加</u-button>
		</view>
		<u-modal v-model="show" title="添加用户" :show-cancel-button="true" :content-style="{ padding: '20rpx'}" @confirm="submit">
			<view class="slot-content" style="width: 80%;margin: 0 auto;">
				<u-input v-model="phone" placeholder="请输入手机号" maxlength="11" type="text" :border="true" />
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				res: {},
				show: false,
				phone: '',
				customStyle: {
					width: '100rpx',
					height: '60rpx'
				},
				datalist: []
			}
		},
		onLoad() {
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					this.res = res.data
					this.getUserList()
				}
			})
		},
		methods: {
			getUserList() {
				this.$http.post('/user/findUserByUnitId', {
					'unitId': this.res.userInfo.unitId
				}, {
					header: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
						'Authentication': this.res.token
					}
				}).then((res) => {
					if (res.data.code === 200) {
						for (var i = 0; i < res.data.data.length; i++) {
							if (res.data.data[i].userpicPath === undefined) {
								res.data.data[i].userpicPath = '/static/default_avatar.jpg'
							}
							if (res.data.data[i].findCourse === 0) {
								res.data.data[i].statusName = '休息'
								res.data.data[i].type = 'primary'
							} else {
								res.data.data[i].statusName = '在岗'
								res.data.data[i].type = 'info'
							}
						}
						this.datalist = res.data.data
					}
				})
			},
			addUser() {
				this.show = true
			},
			submit() {
				this.show = true
				console.log()
				if (this.phone !== '') {
					if(!(/^1[3456789]\d{9}$/.test(this.phone))){ 
						this.$u.toast('请输入正确的手机号') 
						return false; 
					} 
						
					this.$http.post('/user/findUserByPhone', {
						'phoneNum': this.phone
					}, {
						header: {
							'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
							'Authentication': this.res.token
						}
					}).then((res) => {
						console.log(res)
						if (res.data.code === 200) {
							if (res.data.data === 0) {
								this.$u.toast('用户未注册！')
							} else {
								if (res.data.data.unitId !== undefined) {
									this.$u.toast('该用户已有公司！')
								} else {
									this.$http.post('/user/updateUserInfo', {
										'userId': res.data.data.userId,
										'unitId': this.res.userInfo.unitId
									}, {
										header: {
											'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
											'Authentication': this.res.token
										}
									}).then((res) => {
										console.log(res)
										if (res.data.code === 200) {
											this.show = false
											this.getUserList()
										}
									})
								}
							}
						}
					})
				} else {
					this.$u.toast('请输入您的手机号') 
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		height: 100%;
		background-color: #FFFFFF;
		
		.mail-list{
			.mail-item{
				height: 150rpx;
				padding: 20rpx;
				display: flex;
				justify-content: space-between;
				border-bottom: 1rpx solid #c8c7cc;
				
				&:first-child{
					border-top: 1rpx solid #c8c7cc;
				}
				
				.mail-avatar{
					width: 150rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				
				.mail-info{
					width: calc(100% - 150rpx);
					display: flex;
					justify-content: space-between;
					align-items: center;
					
					.mail-info-content{
						width: calc(100% - 150rpx);
					}
					
					.mail-info-status{
						width: 150rpx;
					}
				}
			}
		}
		
		.empty{
			padding-top: 100rpx;
		}
		
		.addBtn{
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 100rpx;
			background-color: #FFFFFF;
		}
	}
</style>
