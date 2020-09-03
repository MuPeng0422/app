<template>
	<view class="content">
		<view class="mail" v-if="datalist.length > 0">
			<view class="mail-list">
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
							<u-checkbox v-model="item.checked" @change="addUser(item)"></u-checkbox>
						</view>
					</view>
				</view>
			</view>
			<view class="addBtn">
				<u-button type="primary" style="width: 80%;" @click="submit">添加</u-button>
			</view>
		</view>
		<view class="empty" v-else>
			<view>
				<u-empty text="暂无数据" mode="data"></u-empty>
			</view>
		</view>
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
				datalist: [],
				checked: []
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
							res.data.data[i].checked = false
							
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
						console.log(this.datalist)
					}
				})
			},
			submit() {
				let pages = getCurrentPages();  //获取所有页面栈实例列表
				let nowPage = pages[ pages.length - 1];  //当前页页面实例
				let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
				prevPage.$vm.usersList = this.checked;   //修改上一页data里面的searchVal参数值为1211
				uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
					delta: 1
				});
			},
			addUser(item) {
				console.log(item)
				console.log('this.checked', this.checked)
				if (this.checked.length === 0) {
					this.checked.push(item)
				} else {
					if(this.checked.includes(item)) {
						// this.checked
						console.log('777777')
						this.deleteOne(item, this.checked)
					} else {
						this.checked.push(item)
					}
				}
		        console.log(this.checked)
			},
			deleteOne(id, arr) {
				var index = arr.indexOf(id)
				arr.splice(index, 1)
	            console.log(arr)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		height: 100%;
		background-color: #FFFFFF;
		
		.mail{
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
	}
</style>
