<template>
	<view class="content">
		<view class="u-page">
			<view class="pageOne" v-if="current === 0">
				<home-page ref="homepage"></home-page>
			</view>
			<view class="pageTwo" v-else-if="current === 1">
				<my-page ref="mypage"></my-page>
			</view>
		</view>
		<u-tabbar
		    :beforeSwitch="beforeSwitch"
		    v-model="current"
		    :bg-color="bgColor"
		    :border-top="borderTop"
		    :list="list"
			:inactive-color="inactiveColor"
			:activeColor="activeColor"
		></u-tabbar>
	</view>
</template>

<script>
	import homepage from '../homepage/homepage.vue'
	import mypage from '../mypage/mypage.vue'
	
	
	export default {
		components: {
			'home-page': homepage,
			'my-page': mypage
		},
		data() {
			return {
				current: 0,
				bgColor: '#ffffff',
				borderTop: true,
				list: [{
						iconPath: "home",
						selectedIconPath: "home-fill",
						text: '首页'
					},
					{
						iconPath: "account",
						selectedIconPath: "account-fill",
						text: '我的'
					}
				],
				inactiveColor: '#909399',
				activeColor: '#5098FF'
			}
		},
		methods: {
			beforeSwitch(index) {
				return true;
			}
		}
	}
</script>

<style scoped lang="scss">
	.content{
		height: 100%;
		
		.u-page{
			height: calc(100% - 100rpx);
			
			.pageOne{
				height: 100%;
			}
			
			.pageTwo{
				height: 100%;
			}
		}
	}
	.u-demo-area {
		margin: 0 -40rpx;
	}
</style>
