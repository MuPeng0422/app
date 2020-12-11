<template>
	<view class="content">
		<view class="content-main">
			<u-cell-group>
				<u-cell-item title="设置壁纸" :arrow="false" @click="switchPhoto"></u-cell-item>
				<u-cell-item title="手机换绑" :arrow="false" @click="changePwd"></u-cell-item>
				<!-- <u-cell-item title="问题反馈" :arrow="false" @click="goFeedback"></u-cell-item> -->
				<u-cell-item title="退出登录" :arrow="false" @click="showModel"></u-cell-item>
			</u-cell-group>
			<view class="version">
				系统版本 V{{ version }}
			</view>
		</view>
		<u-modal ref="uModal" v-model="show" :show-cancel-button="true" :async-close="asyncClose" :content="content" @confirm="signOut"></u-modal>
	</view>
</template>

<script>
	import { mapMutations } from 'vuex'; 
	export default {
		data() {
			return {
				show: false,
				content: '确定退出吗？',
				version: '1.0.0'
			}
		},
		onLoad() {
			const accountInfo = uni.getAccountInfoSync();
			this.version = accountInfo.miniProgram.version
		},
		onUnload() {
			let pages = getCurrentPages(); // 当前页面
			let beforePage = pages[pages.length - 2]; // 前一个页面
			beforePage.onLoad(); // 执行前一个页面的onLoad方法
		},
		methods: {
			...mapMutations(['logout']),
			changePwd() {
				uni.navigateTo({
				    url: '/pages/changePwd/changePwd'
				})
			},
			goFeedback() {
				uni.navigateTo({
				    url: '/pages/feedback/feedback'
				})
			},
			switchPhoto() {
				uni.navigateTo({
				    url: '/pages/switchPhoto/switchPhoto'
				})
			},
			showModel() {
				this.show = true
			},
			signOut() {
				this.logout()
				uni.reLaunch({
				    url: '/pages/login/login'
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
			position: relative;
			height: 100%;
			background-color: #FFFFFF;
			
			.version{
				width: 100%;
				position: absolute;
				display: flex;
				justify-content: center;
				bottom: 50rpx;
			}
		}
	}
</style>
